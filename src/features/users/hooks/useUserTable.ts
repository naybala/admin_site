import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { usePermissionStore } from "@/stores/permission";
import { useUsersList } from "../queries/useUsersList";
import { useUserMutations } from "../mutations/useUserMutations";
import { useUserFilters } from "../queries/useUserFilters";
import { useAuthUserSocket } from "@/composables/realTimeSockets/useAuthUserSocket";
import { useAuthStore } from "@/stores/auth";
import type { Column } from "@/components/common/BaseTable.vue";

export function useUserTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const permissionStore = usePermissionStore();
  const authStore = useAuthStore();
  const { userData, fetchUserData } = useAuthUserSocket();

  const queryParams = ref({
    page: 1,
    limit: 20,
    search: "",
    phoneNumberPrefix: "",
    roleId: "",
    associationId: "",
  });

  const searchTerm = ref("");
  const searchPrefixPhoneNumber = ref("");
  const searchRole = ref("");
  const searchAssociation = ref("");
  const serverSideEdit = ref(true);

  const { roles, associations, prepareData } = useUserFilters();

  watch(searchTerm, (val) => {
    queryParams.value.search = val;
    queryParams.value.page = 1;
  });

  const { data, isLoading } = useUsersList(queryParams);
  const { deleteMutation } = useUserMutations();

  const items = computed(() => data.value?.data?.data || []);
  const total = computed(() => data.value?.data?.total || 0);
  const offset = computed(
    () => (queryParams.value.page - 1) * queryParams.value.limit
  );

  const userTypes = computed(
    () => prepareData.data.value?.data?.userType || []
  );
  const countries = computed(
    () => prepareData.data.value?.data?.countryList || []
  );
  const ownLicenses = computed(
    () => prepareData.data.value?.data?.ownLicenseList || []
  );
  const rolesOptions = computed(() => roles.data.value?.data || []);
  const associationsOptions = computed(
    () => associations.data.value?.data?.associations || []
  );

  const createPermission = computed(() =>
    permissionStore.hasPermission("users.store")
  );
  const editPermission = computed(() =>
    permissionStore.hasPermission("users.edit")
  );
  const showPermission = computed(() =>
    permissionStore.hasPermission("users.show")
  );
  const deletePermission = computed(() =>
    permissionStore.hasPermission("users.delete")
  );

  const tableColumns: Column[] = [
    { label: "Username", field: "username" },
    { label: "Full Name", field: "fullName" },
    { label: "Email", field: "email" },
    { label: "Phone", field: "phoneNumber" },
  ];

  const openNewForm = () => router.push({ name: "user-new" });
  const editItem = (item: any) =>
    router.push({ name: "user-edit", params: { id: item.id } });
  const viewItem = (item: any) =>
    router.push({ name: "user-view", params: { id: item.id } });

  const confirmDeleteItem = (item: any) => {
    confirm.require({
      message: t("users.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: () => {
        deleteMutation.mutate(item.id);
      },
    });
  };

  const handlePageChange = (event: any) => {
    queryParams.value.page = event.page + 1;
    queryParams.value.limit = event.rows;
  };

  const submitFilters = () => {
    queryParams.value.phoneNumberPrefix = searchPrefixPhoneNumber.value;
    queryParams.value.roleId = searchRole.value;
    queryParams.value.associationId = searchAssociation.value;
    queryParams.value.page = 1;

    const selected = associationsOptions.value.find(
      (assoc: any) => assoc.id === searchAssociation.value
    );
    if (userData.value.userType !== "Developer") {
      serverSideEdit.value = selected ? selected.canEdit : false;
    }
  };

  // Initialize filters
  const initializeFilters = async () => {
    await fetchUserData({ id: authStore.userId });
    if (userData.value.userType !== "Developer") {
      const selected = associationsOptions.value.find(
        (assoc: any) => assoc.canEdit === true
      );
      searchAssociation.value = selected ? selected.id : "";
    }
  };

  const tableActions = computed(() => [
    {
      icon: "pi pi-eye",
      permission: showPermission.value,
      handler: (item: any) => viewItem(item),
      tooltip: "View Item",
      class: "p-button-text p-button-warning mr-2",
    },
    {
      icon: "pi pi-pencil",
      permission: editPermission.value && serverSideEdit.value,
      handler: (item: any) => editItem(item),
      tooltip: "Edit Item",
      class: "p-button-text p-button-warning mr-2",
    },
    {
      icon: "pi pi-trash",
      permission: deletePermission.value && serverSideEdit.value,
      handler: (item: any) => confirmDeleteItem(item),
      tooltip: "Delete Item",
      class: "p-button-text p-button-danger",
    },
  ]);

  return {
    t,
    searchTerm,
    searchPrefixPhoneNumber,
    searchRole,
    searchAssociation,
    items,
    total,
    offset,
    isLoading,
    queryParams,
    createPermission,
    serverSideEdit,
    userTypes,
    countries,
    ownLicenses,
    rolesOptions,
    associationsOptions,
    tableColumns,
    tableActions,
    openNewForm,
    handlePageChange,
    submitFilters,
    initializeFilters,
  };
}
