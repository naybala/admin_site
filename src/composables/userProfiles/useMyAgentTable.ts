import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { UserIndex, User } from "@customTypes/index";
import { useDebouncedFn } from "../common/useDebouncedFn";
import { INDEX_API_PATHS } from "@/composables/userProfiles/apiPaths";

export function useMyAgentTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo, showError } = useAppToast();

  const searchTerm = ref("");

  const userTypes = ref<any[]>([]);

  const { items, loading, error, page, limit, total, fetchAll, deleteItem } =
    useCrud<UserIndex>({
      apiPath: INDEX_API_PATHS.MY_AGENT,
    });

  // Debounced fetch
  const fetchAllWithParams = async (params: any) => {
    try {
      await fetchAll(params);
    } catch (e) {
      console.error("Error in fetchAllWithParams:", e);
    }
  };

  const debouncedFetch = useDebouncedFn(
    fetchAllWithParams,
    Number(import.meta.env.VITE_DEBOUNCE_DURATION),
    loading
  );

  onMounted(async () => {
    fetchData();
  });

  // Direct fetch
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

  // Debounced search watcher
  watch([searchTerm], ([newTerm]) => {
    debouncedFetch({
      page: 1,
      limit: 20,
      search: newTerm,
    });
  });

  const openNewForm = () => {
    router.push({ name: "my-association-members-new" });
  };

  const openAddExistingUserForm = () => {
    router.push({ name: "my-association-members-add-existing-user" });
  };

  const editItem = (item: User) => {
    router.push({
      name: "my-association-members-edit",
      params: { id: item.id },
    });
  };

  const viewItem = (item: User) => {
    router.push({
      name: "my-association-members-view",
      params: { id: item.id },
    });
  };

  const confirmDeleteItem = (item: User) => {
    confirm.require({
      message: t("users.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (item.id) {
          try {
            await deleteItem(item.id);
            showSuccess(t("common.success"), t("users.deleted"));
            await fetchData(page.value, limit.value);
          } catch (e) {
            showError(error.value || "Something went wrong");
            console.error("Delete error:", e);
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("users.notDeleted"));
      },
    });
  };

  return {
    t,
    items,
    userTypes,
    loading,
    error,
    searchTerm,
    page,
    limit,
    total,
    fetchData,
    openNewForm,
    openAddExistingUserForm,
    editItem,
    viewItem,
    confirmDeleteItem,
  };
}
