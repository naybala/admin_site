import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { UserIndex, User } from "@customTypes/index";
import { apiRequest } from "../common/useApi";
import { useDebouncedFn } from "../common/useDebouncedFn";
import { INDEX_API_PATHS } from "@/composables/users/apiPaths";
import { useAuthUserSocket } from "../realTimeSockets/useAuthUserSocket";
import { useAuthStore } from "@/stores/auth";

export function useUserTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo, showError } = useAppToast();
  const searchRole = ref("");
  const roles = ref<any[]>([]);
  const serverSideEdit = ref(true);

  const searchTerm = ref("");
  const searchPrefixPhoneNumber = ref("");
  const searchAssociation = ref("");

  const userTypes = ref<any[]>([]);
  const countries = ref<any>([]);
  const ownLicenses = ref<any>([]);
  const associations = ref<any[]>([]);
  const authStore = useAuthStore();
  const { userData, fetchUserData } = useAuthUserSocket();

  const { items, loading, error, page, limit, total, fetchAll, deleteItem } =
    useCrud<UserIndex>({
      apiPath: INDEX_API_PATHS.USERS,
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
    const [roleResponse, necessaryDataResponse, associationsResponse] =
      await Promise.all([
        apiRequest<any>(INDEX_API_PATHS.ROLES, { method: "GET" }),
        apiRequest<any>(INDEX_API_PATHS.COUNTRIES_AND_USER_TYPES, {
          method: "GET",
        }),
        apiRequest<any>(INDEX_API_PATHS.ASSOCIATIONS, {
          method: "GET",
        }),
        fetchUserData({ id: authStore.userId }),
      ]);

    roles.value = roleResponse.data || [];
    countries.value = necessaryDataResponse.data.countryList;
    userTypes.value = necessaryDataResponse.data.userType;
    ownLicenses.value = necessaryDataResponse.data.ownLicenseList;
    associations.value = associationsResponse.data.associations || [];
    // Get the selected association's canEdit if already selected
    const selected = associations.value.find(
      (assoc: any) => assoc.canEdit === true
    );
    if (userData.value.userType != "Developer") {
      searchAssociation.value = selected ? selected.id : "";
    } else {
      searchAssociation.value = "";
    }
    fetchData(1);
  });

  const submitFilters = () => {
    const selected = associations.value.find(
      (assoc: any) => assoc.id === searchAssociation.value
    );
    // This is now hard code , Will be fix later.
    if (userData.value.userType != "Developer") {
      serverSideEdit.value = selected ? selected.canEdit : false;
    }
    fetchData(1);
  };

  // const resetFilters = () => {
  //   const selected = associations.value.find(
  //     (assoc: any) => assoc.id === searchAssociation.value
  //   );
  //   serverSideEdit.value = selected ? selected.canEdit : false;
  //   searchTerm.value = "";
  //   searchPrefixPhoneNumber.value = "";
  //   fetchData(1);
  // };

  // Direct fetch
  const fetchData = async (newPage?: number, newLimit?: number) => {
    loading.value = true;
    try {
      await fetchAll({
        page: newPage ?? page.value,
        limit: newLimit ?? limit.value,
        phoneNumberPrefix: searchPrefixPhoneNumber.value,
        search: searchTerm.value,
        roleId: searchRole.value,
        associationId: searchAssociation.value,
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
      associationId: searchAssociation.value,
    });
  });

  const openNewForm = () => {
    router.push({ name: "user-new" });
  };

  const editItem = (item: User) => {
    router.push({ name: "user-edit", params: { id: item.id } });
  };

  const viewItem = (item: User) => {
    router.push({ name: "user-view", params: { id: item.id } });
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
    countries,
    ownLicenses,
    associations,
    roles,
    searchRole,
    loading,
    error,
    searchTerm,
    searchPrefixPhoneNumber,
    searchAssociation,
    page,
    limit,
    total,
    serverSideEdit,
    fetchData,
    openNewForm,
    editItem,
    submitFilters,
    viewItem,
    confirmDeleteItem,
  };
}
