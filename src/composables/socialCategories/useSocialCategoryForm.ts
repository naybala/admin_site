import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { SocialCategory } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateSocialCategoryForm } from "./validateSocialCategoryForm";
import { SocialCategory_CREATE_API_PATHS } from "./apiPaths";
import { apiRequest } from "../common/useApi";

export function useSocialCategoryForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const types = ref<any>([]);

  const state = reactive({
    saving: false,
    isEditMode: route.name === "socialCategory-edit",
    isShowMode: route.name === "socialCategory-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({ apiPath: SocialCategory_CREATE_API_PATHS.SocialCategory });

  const form = ref<SocialCategory>({
    code: "",
    name: "",
    type: "",
    status: false,
    description: "",
  });

  onMounted(async () => {
    try {
      if ((state.isEditMode || state.isShowMode) && route.params.id) {
        await fetchOne(route.params.id as string);
        if (item.value) {
          form.value = { ...item.value };
        }
      }
      const typeResponse: any = await apiRequest<any>(
        SocialCategory_CREATE_API_PATHS.PrepareData,
        {
          method: "GET",
        }
      );
      types.value = typeResponse.data ?? [];
      console.log(types);
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

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const save = async () => {
    if (state.isShowMode) return;

    state.validationErrors = validateSocialCategoryForm(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    state.saving = true;
    try {
      if (state.isEditMode && route.params.id) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("socialCategory.updated"));
      } else {
        await createItem(form.value);
        showSuccess(t("common.success"), t("socialCategory.created"));
      }
      router.push({ name: "socialCategories" });
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
    router.push({ name: "socialCategories" });
  };

  return {
    t,
    state,
    form,
    save,
    types,
    cancel,
    loading,
    error,
  };
}
