import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { Video } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateVideoForm } from "./validateVideoForm";
import { Video_CREATE_API_PATHS } from "./apiPaths";
import { apiRequest } from "../common/useApi";

export function useVideoForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const index = "videos";
  const categories = ref<any>("");

  const state = reactive({
    saving: false,
    isEditMode: route.name === "video-edit",
    isShowMode: route.name === "video-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({ apiPath: Video_CREATE_API_PATHS.Video });

  const form = ref<Video>({
    imageFile: null,
    coverImage: "",
    category: "",
    description: "",
    videoLink: "",
    status: false,
    isSeries: false,
    videoLinkSeries: [],
  });

  onMounted(async () => {
    try {
      if ((state.isEditMode || state.isShowMode) && route.params.id) {
        await fetchOne(route.params.id as string);
        if (item.value) {
          form.value = { ...item.value };
        }
      }
      const response = await apiRequest<any>(
        Video_CREATE_API_PATHS.PrepareData,
        {
          method: "GET",
        }
      );
      if (response.data) {
        categories.value = response.data || [];
      }
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    }
    setTimeout(() => {
      loading.value = false;
    }, 300);
  });

  watch(
    () => form.value.isSeries,
    (isSeries) => {
      console.log(isSeries);

      if (isSeries && form.value.videoLinkSeries!.length === 0) {
        form.value.videoLinkSeries!.push("");
      }

      if (!isSeries) {
        form.value.videoLinkSeries = [];
        form.value.videoLink = "";
      }
    }
  );

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const prepareForm = (form: Video): any => {
    const cdnPrefix = import.meta.env.VITE_CDN_PREFIX;

    const normalize = (url?: string) =>
      url && url.startsWith(cdnPrefix) ? url.slice(cdnPrefix.length) : url;

    return {
      ...form,

      coverImage: form.imageFile
        ? {
            filename: form.imageFile.name,
            contentType: form.imageFile.type,
          }
        : normalize(form.coverImage),

      // movie video
      videoLink: normalize(form.videoLink),

      // series videos
      videoLinkSeries: form.videoLinkSeries.map(normalize),
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
    console.log(prepareForm(form.value));

    if (state.isShowMode) return;
    state.validationErrors = validateVideoForm(form.value, t);
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
        showSuccess(t("common.success"), t("videos.updated"));
      } else {
        response = await createItem(preparedForm);
        showSuccess(t("common.success"), t("videos.created"));
      }

      const uploadUrl = response?.data?.uploadUrl;
      if (form.value.imageFile && uploadUrl) {
        await uploadToCloud(uploadUrl, form.value.imageFile);
      }
      router.push({ name: index });
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
    router.push({ name: index });
  };

  return {
    t,
    state,
    form,
    save,
    categories,
    cancel,
    loading,
    error,
  };
}
