import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import { validateAutoSubBranchForm } from "./validateAutoSubBranchForm";
import { AutoSubBranch_CREATE_API_PATHS } from "./apiPaths";
import { apiRequest } from "../common/useApi";

import type { AutoSubBranch } from "../../types";

export function useAutoSubBranchForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();

  const indexRouteName = "autoSubBranches";

  const autoTypes = ref<any[]>([]);
  const autoBranches = ref<any[]>([]);

  const state = reactive({
    saving: false,
    isEditMode: route.name === "autoSubBranch-edit",
    isShowMode: route.name === "autoSubBranch-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<AutoSubBranch>({
    apiPath: AutoSubBranch_CREATE_API_PATHS.AutoSubBranch,
  });

  const form = ref<AutoSubBranch>({
    autoBranchId: "",
    autoType: "",
    desc: "",
    name: "",
    status: true,
  });

  const loadInitialData = async () => {
    try {
      // Fetch item if editing or viewing
      const itemPromise = (async () => {
        if ((state.isEditMode || state.isShowMode) && route.params.id) {
          await fetchOne(route.params.id as string);
          if (item.value) {
            form.value = { ...item.value };
          }
        }
      })();

      // Fetch autoTypes and autoBranches in parallel
      const autoTypePromise = apiRequest<any>(
        AutoSubBranch_CREATE_API_PATHS.PrepareDataAutoBranch,
        { method: "GET" }
      );

      const autoBranchPromise = apiRequest<any>(
        AutoSubBranch_CREATE_API_PATHS.PrepareData,
        { method: "GET" }
      );

      const [_, autoTypeRes, autoBranchRes] = await Promise.all([
        itemPromise,
        autoTypePromise,
        autoBranchPromise,
      ]);

      autoTypes.value = autoTypeRes.data;
      autoBranches.value = autoBranchRes.data;
    } catch (err: any) {
      console.error("Initialization error:", err);
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    }
  };

  onMounted(loadInitialData);

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const save = async () => {
    if (state.isShowMode) return;

    state.validationErrors = validateAutoSubBranchForm(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    state.saving = true;

    try {
      if (state.isEditMode && route.params.id) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("autoSubBranches.updated"));
      } else {
        await createItem(form.value);
        showSuccess(t("common.success"), t("autoSubBranches.created"));
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
    save,
    cancel,
    autoTypes,
    autoBranches,
    loading,
    error,
  };
}
