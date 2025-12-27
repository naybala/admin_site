import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { SocialAudio } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateSocialAudioForm } from "./validateSocialAudioForm";
import { SocialAudio_CREATE_API_PATHS } from "./apiPaths";
import { apiRequest } from "../common/useApi";

export function useSocialAudioForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const categories = ref<any>([]);
  const types = ref<any>([]);
  const artists = ref<any>([]);

  const state = reactive({
    saving: false,
    isEditMode: route.name === "socialAudio-edit",
    isShowMode: route.name === "socialAudio-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({ apiPath: SocialAudio_CREATE_API_PATHS.SocialAudio });

  const form = ref<SocialAudio>({
    title: "",
    category: "",
    audioLink: "",
    duration: 0,
    status: false,
    artistId: "",
    countryId: "",
    typeId: "",
    youtubeLink: "",
    imageFiles: null,
    thumbnail_photo: "",
  });

  onMounted(async () => {
    try {
      if ((state.isEditMode || state.isShowMode) && route.params.id) {
        await fetchOne(route.params.id as string);
        if (item.value) {
          form.value = { ...item.value };
        }
      }

      const [categoryResponse, typeResponse, artistResponse] =
        await Promise.all([
          apiRequest<any>(SocialAudio_CREATE_API_PATHS.PrepareData, {
            method: "GET",
          }),
          apiRequest<any>(SocialAudio_CREATE_API_PATHS.Type, { method: "GET" }),
          apiRequest<any>(SocialAudio_CREATE_API_PATHS.Artist, {
            method: "GET",
          }),
        ]);

      categories.value = categoryResponse.data.categoryType ?? [];
      types.value = typeResponse.data ?? [];
      artists.value = artistResponse.data ?? [];
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

  const prepareForm = (form: any): any => {
    const audioUrl = form.audioLink || "";
    const cdnPrefix = import.meta.env.VITE_CDN_PREFIX;
    const file = form.imageFiles;
    return {
      ...form,
      audioLink: audioUrl.startsWith(cdnPrefix)
        ? audioUrl.slice(cdnPrefix.length)
        : audioUrl,
      thumbnail_photo: file
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

    state.validationErrors = validateSocialAudioForm(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    state.saving = true;
    try {
      const preparedForm = prepareForm(form.value);
      let response: any;

      if (state.isEditMode && route.params.id) {
        console.log(preparedForm);
        response = await updateItem(preparedForm);
        showSuccess(t("common.success"), t("socialAudios.updated"));
      } else {
        response = await createItem(preparedForm);
        showSuccess(t("common.success"), t("socialAudios.created"));
      }
      const uploadUrl = response?.data?.uploadUrl;
      if (form.value.imageFiles && uploadUrl) {
        await uploadToCloud(uploadUrl, form.value.imageFiles);
      }
      router.push({ name: "socialAudios" });
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
    router.push({ name: "socialAudios" });
  };

  return {
    t,
    state,
    form,
    save,
    cancel,
    categories,
    types,
    artists,
    loading,
    error,
  };
}
