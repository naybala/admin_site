import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { RoleIndex, Role } from "@customTypes/index";
import { ROLE_INDEX_API_PATHS } from "./apiPaths";
import { useDebouncedFn } from "../common/useDebouncedFn";

export function useRoleTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo, showError } = useAppToast();

  const searchTerm = ref("");

  const {
    items: roles,
    loading,
    error,
    page,
    limit,
    offset,
    total,
    fetchAll,
    deleteItem,
    handlePageChange,
  } = useCrud<RoleIndex>({
    apiPath: ROLE_INDEX_API_PATHS.ROLES,
  });

  // Debounce search

  const fetchAllWithParams = async (params: any) => {
    try {
      await fetchAll(params);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };

  const debouncedFetch = useDebouncedFn(
    fetchAllWithParams,
    Number(import.meta.env.VITE_DEBOUNCE_DURATION),
    loading
  );

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

  const openNewRoleForm = () => {
    router.push({ name: "role-new" });
  };

  const editRole = (role: Role) => {
    router.push({ name: "role-edit", params: { id: role.id } });
  };

  const viewRole = (role: Role) => {
    router.push({ name: "role-view", params: { id: role.id } });
  };

  const confirmDeleteRole = (event: Event, role: Role) => {
    confirm.require({
      target: event.currentTarget as HTMLElement,
      message: t("roles.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (role.id) {
          try {
            await deleteItem(role.id);
            showSuccess(t("common.success"), t("roles.roleDeleted"));
            await fetchData(page.value, limit.value);
          } catch (e) {
            showError(error.value || t("common.error"));
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("roles.roleNotDeleted"));
      },
    });
  };

  return {
    t,
    searchTerm,
    roles,
    loading,
    error,
    page,
    limit,
    offset,
    total,
    fetchData,
    handlePageChange,
    openNewRoleForm,
    viewRole,
    editRole,
    confirmDeleteRole,
  };
}
