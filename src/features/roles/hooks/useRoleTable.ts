import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { usePermissionStore } from "@/stores/permission";
import { useRolesList } from "../queries/useRolesList";
import { useRoleMutations } from "../mutations/useRoleMutations";
import type { Column } from "@/components/common/BaseTable.vue";

export function useRoleTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const permissionStore = usePermissionStore();

  const queryParams = ref({
    page: 1,
    limit: 10,
    search: "",
  });

  const searchTerm = ref("");
  watch(searchTerm, (val) => {
    queryParams.value.search = val;
    queryParams.value.page = 1;
  });

  const { data, isLoading } = useRolesList(queryParams);
  const { deleteMutation } = useRoleMutations();

  const items = computed(() => data.value?.data?.data || []);
  const total = computed(() => data.value?.data?.total || 0);
  const offset = computed(
    () => (queryParams.value.page - 1) * queryParams.value.limit
  );

  const createPermission = computed(() =>
    permissionStore.hasPermission("roles.store")
  );
  const editPermission = computed(() =>
    permissionStore.hasPermission("roles.edit")
  );
  const showPermission = computed(() =>
    permissionStore.hasPermission("roles.show")
  );
  const deletePermission = computed(() =>
    permissionStore.hasPermission("roles.delete")
  );

  const tableColumns: Column[] = [
    { label: "Name", field: "name" },
    { label: "Description", field: "description" },
  ];

  const openNewForm = () => router.push({ name: "role-new" });
  const editItem = (item: any) =>
    router.push({ name: "role-edit", params: { id: item.id } });
  const viewItem = (item: any) =>
    router.push({ name: "role-view", params: { id: item.id } });

  const confirmDeleteItem = (item: any) => {
    confirm.require({
      message: t("roles.confirmDelete"),
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
      permission: editPermission.value,
      handler: (item: any) => editItem(item),
      tooltip: "Edit Item",
      class: "p-button-text p-button-warning mr-2",
    },
    {
      icon: "pi pi-trash",
      permission: deletePermission.value,
      handler: (item: any) => confirmDeleteItem(item),
      tooltip: "Delete Item",
      class: "p-button-text p-button-danger",
    },
  ]);

  return {
    t,
    searchTerm,
    items,
    total,
    offset,
    isLoading,
    queryParams,
    createPermission,
    tableColumns,
    tableActions,
    openNewForm,
    handlePageChange,
  };
}
