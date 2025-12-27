import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { UserGuide } from "@customTypes/index";
import { UserGuide_INDEX_API_PATHS } from "./apiPaths";
import { useDebouncedFn } from "../common/useDebouncedFn";

export function useUserGuideTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo, showError } = useAppToast();

  const searchTerm = ref("");

  const {
    items: items,
    loading,
    error,
    page,
    limit,
    total,
    fetchAll,
    deleteItem,
  } = useCrud<any>({
    apiPath: UserGuide_INDEX_API_PATHS.UserGuide,
  });

  const fetchAllWithParams = async (params: any) => {
    try {
      await fetchAll(params);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };
  const debouncedFetch = useDebouncedFn(fetchAllWithParams, 300, loading);

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
    } finally {
      loading.value = false;
    }
  };

  //  Watch searchTerm for filtering
  watch(searchTerm, (newTerm) => {
    debouncedFetch({
      page: 1,
      limit: limit.value,
      search: newTerm,
    });
  });

  const openNewForm = () => {
    router.push({ name: "userGuide-new" });
  };

  const editItem = (item: UserGuide) => {
    router.push({ name: "userGuide-edit", params: { id: item.id } });
  };

  const viewItem = (role: any) => {
    router.push({ name: "userGuide-view", params: { id: role.id } });
  };

  const confirmDeleteItem = (event: Event, item: UserGuide) => {
    confirm.require({
      target: event.currentTarget as HTMLElement,
      message: t("userGuides.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (item.id) {
          try {
            await deleteItem(item.id);
            showSuccess(t("common.success"), t("userGuides.deleted"));
            await fetchData(page.value, limit.value);
          } catch (e) {
            showError(error.value || "Something went wrong");
            console.error("Delete error:", e);
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("userGuides.notDeleted"));
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
    viewItem,
    editItem,
    confirmDeleteItem,
  };
}
