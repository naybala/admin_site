import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { New } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateNewForm } from "./validateNewForm";
import { NEW_CREATE_API_PATHS } from "./apiPaths";
import { apiRequest } from "../common/useApi";
import { useImageUpload } from "../common/useImageUpload";

export function useNewForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const newsTypes = ref<any>([]);
  const newsCategories = ref<any>([]);
  const index = "news";

  const state = reactive({
    saving: false,
    isEditMode: route.name === "news-edit",
    isShowMode: route.name === "news-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({ apiPath: NEW_CREATE_API_PATHS.New });

  const form = ref<New>({
    countryCode: "",
    urlList: [],
    category: "",
    title: "",
    type: "",
    body: "",
    writtenBy: "",
    videoLink: "",
    externalLink: "",
    imageFiles: [],
  });

  onMounted(async () => {
    try {
      if ((state.isEditMode || state.isShowMode) && route.params.id) {
        await fetchOne(route.params.id as string);
        if (item.value) {
          form.value = { ...item.value };
        }
      }
      const response = await apiRequest<any>(NEW_CREATE_API_PATHS.PrepareData, {
        method: "GET",
      });
      if (response.data) {
        newsTypes.value = response.data.newsTypes || [];
        newsCategories.value = response.data.newsCategories || [];
      }
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    } finally {
      loading.value = false;
    }
  });

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const save = async () => {
    if (state.isShowMode) return;

    state.validationErrors = validateNewForm(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    const { uploadImages, error: uploadError } = useImageUpload();
    const FIELDS_FOR_UPLOAD = [
      "countryCode",
      "urlList",
      "category",
      "title",
      "type",
      "body",
      "title",
    ];

    state.saving = true;

    try {
      let uploadedUrls: string[] = [];

      // only upload new files if they exist
      if (form.value.imageFiles?.length) {
        try {
          const keys = await uploadImages(
            form,
            NEW_CREATE_API_PATHS.Validate,
            true,
            FIELDS_FOR_UPLOAD
          );

          const CDN_PREFIX = import.meta.env.VITE_CDN_PREFIX;
          uploadedUrls = keys.map((k) =>
            k.startsWith(CDN_PREFIX) ? k.replace(CDN_PREFIX, "") : k
          );
        } catch {
          showError(
            t("common.error"),
            uploadError.value || t("common.uploadFailed")
          );
          return;
        }
      }

      // Merge existing and new URLs (avoid duplicating)
      const existingUrls = (form.value.urlList || []).map((u) => {
        // remove CDN prefix only if it’s clearly there
        const CDN_PREFIX = import.meta.env.VITE_CDN_PREFIX;
        return u.startsWith(CDN_PREFIX) ? u.replace(CDN_PREFIX, "") : u;
      });

      form.value.urlList = [...new Set([...existingUrls, ...uploadedUrls])];

      console.log("Final form before submit:", form.value);

      if (state.isEditMode && route.params.id) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("news.updated"));
      } else {
        await createItem(form.value);
        showSuccess(t("common.success"), t("news.created"));
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
    newsTypes,
    newsCategories,
    save,
    cancel,
    loading,
    error,
  };
}
