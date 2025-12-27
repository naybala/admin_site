import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { Artist } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateArtistForm } from "./validateArtistForm";
import { Artist_CREATE_API_PATHS } from "./apiPaths";
import { apiRequest } from "../common/useApi";

export function useArtistForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const genderTypes = ref<any>([]);
  const artistTypes = ref<any>([]);

  const state = reactive({
    saving: false,
    isEditMode: route.name === "artist-edit",
    isShowMode: route.name === "artist-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({ apiPath: Artist_CREATE_API_PATHS.Artist });

  const form = ref<Artist>({
    name: "",
    enName: "",
    gender: "",
    type: "",
    imageFiles: null,
    countryId: "",
    description: "",
    status: false,
    url: "",
  });

  onMounted(async () => {
    try {
      if ((state.isEditMode || state.isShowMode) && route.params.id) {
        await fetchOne(route.params.id as string);
        if (item.value) {
          form.value = { ...item.value };
        }
      }
      const response: any = await apiRequest<any>(
        Artist_CREATE_API_PATHS.PrepareData,
        {
          method: "GET",
        }
      );
      genderTypes.value = response.data.genderType ?? [];
      artistTypes.value = response.data.artistType ?? [];
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    }
    loading.value = false;
  });

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const prepareForm = (form: Artist): Artist => {
    const file = form.imageFiles;
    return {
      ...form,
      url: file
        ? {
            filename: file.name,
            contentType: file.type,
          }
        : null,
    };
  };

  const uploadToCloud = async (url: string, file: File) => {
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
        "x-amz-acl": "public-read",
      },
    });
  };

  const save = async () => {
    if (state.isShowMode) return;

    state.validationErrors = validateArtistForm(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }
    state.saving = true;
    try {
      const preparedForm = prepareForm(form.value);
      let response: any;
      if (state.isEditMode && route.params.id) {
        response = await updateItem(preparedForm);
        showSuccess(t("common.success"), t("artists.updated"));
      } else {
        response = await createItem(preparedForm);
        showSuccess(t("common.success"), t("artists.created"));
      }
      const uploadUrl = response?.data?.uploadUrl;
      if (form.value.imageFiles && uploadUrl) {
        await uploadToCloud(uploadUrl, form.value.imageFiles);
      }
      router.push({ name: "artists" });
    } catch (err: any) {
      console.error("Save failed:", err);
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    } finally {
      state.saving = false;
    }
  };

  const cancel = () => {
    router.push({ name: "artists" });
  };

  return {
    t,
    state,
    form,
    save,
    artistTypes,
    genderTypes,
    cancel,
    loading,
    error,
  };
}
