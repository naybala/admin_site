import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import { useDebouncedFn } from "../common/useDebouncedFn";
import type { Association, AssociationIndex } from "@customTypes/index";
import { ASSOCIATION_INDEX_API_PATHS } from "./apiPaths";

export function useAssociationTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo, showError } = useAppToast();

  const searchTerm = ref("");

  const { items, loading, error, page, limit, total, fetchAll, deleteItem } =
    useCrud<AssociationIndex>({
      apiPath: ASSOCIATION_INDEX_API_PATHS.Associations,
    });

  const fetchData = async (newPage?: number, newLimit?: number) => {
    loading.value = true;
    try {
      await fetchAll({
        page: newPage ?? page.value,
        limit: newLimit ?? limit.value,
        search: searchTerm.value,
      });
    } catch (e) {
      console.error("Fetch error:", e);
      showError(t("common.error"), t("common.fetchFailed"));
    } finally {
      loading.value = false;
    }
  };

  const debouncedFetch = useDebouncedFn(
    async (params: any) => {
      try {
        await fetchAll({ ...params });
      } catch (e) {
        console.error("Debounced fetch error:", e);
        showError(t("common.error"), t("common.fetchFailed"));
      }
    },
    Number(import.meta.env.VITE_DEBOUNCE_DURATION),
    loading
  );

  // Search filter watch
  watch(searchTerm, (newTerm) => {
    debouncedFetch({
      page: 1,
      limit: limit.value,
      search: newTerm,
    });
  });

  const openNewForm = () => {
    router.push({ name: "association-new" });
  };

  const editItem = (item: Association) => {
    router.push({ name: "association-edit", params: { id: item.id } });
  };

  const viewItem = (item: Association) => {
    router.push({ name: "association-view", params: { id: item.id } });
  };

  const confirmDeleteItem = (item: Association) => {
    confirm.require({
      message: t("associations.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        try {
          if (!item.id) return;

          await deleteItem(item.id);
          showSuccess(t("common.success"), t("associations.deleted"));
          await fetchData(page.value, limit.value);
        } catch (e) {
          console.error("Delete error:", e);
          showError(error.value || t("common.unexpectedError"));
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("associations.notDeleted"));
      },
    });
  };

  return {
    t,
    searchTerm,
    items,
    loading,
    error,
    page,
    limit,
    total,
    fetchData,
    openNewForm,
    editItem,
    viewItem,
    confirmDeleteItem,
  };
}
