import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { AutoBranch } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateAutoBranchForm } from "./validateAutoBranchForm";
import { AutoBranch_CREATE_API_PATHS } from "./apiPaths";
import { apiRequest } from "../common/useApi";

export function useAutoBranchForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();

  const autoTypes = ref<any[]>([]);
  const form = ref<AutoBranch>({
    name: "",
    autoType: "",
    desc: "",
    status: true,
  });

  const indexRouteName = "autoBranches";

  const state = reactive({
    saving: false,
    isEditMode: route.name === "autoBranch-edit",
    isShowMode: route.name === "autoBranch-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<AutoBranch>({
    apiPath: AutoBranch_CREATE_API_PATHS.AutoBranch,
  });

  const init = async () => {
    try {
      const id = route.params.id as string | undefined;

      const itemPromise =
        (state.isEditMode || state.isShowMode) && id
          ? fetchOne(id)
          : Promise.resolve();

      const autoTypePromise = apiRequest<any>(
        AutoBranch_CREATE_API_PATHS.PrepareData,
        { method: "GET" }
      );

      const [_, autoTypeRes] = await Promise.all([
        itemPromise,
        autoTypePromise,
      ]);

      if (item.value) {
        form.value = { ...item.value };
      }

      autoTypes.value = autoTypeRes.data;
    } catch (err: any) {
      console.error("Initialization failed:", err);
      showError(t("common.error"), err.message || "Failed to load data");
    }
  };

  onMounted(init);

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const save = async () => {
    if (state.isShowMode) return;

    state.validationErrors = validateAutoBranchForm(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    state.saving = true;

    try {
      const id = route.params.id as string | undefined;

      if (state.isEditMode && id) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("autoBranch.updated"));
      } else {
        await createItem(form.value);
        showSuccess(t("common.success"), t("autoBranch.created"));
      }

      router.push({ name: indexRouteName });
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
    router.push({ name: indexRouteName });
  };

  return {
    t,
    state,
    form,
    autoTypes,
    save,
    cancel,
    loading,
    error,
  };
}
