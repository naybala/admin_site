import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { usePermissionStore } from "@/stores/permission";
import { useAssociationsList } from "../queries/useAssociationsList";
import { useAssociationMutations } from "../mutations/useAssociationMutations";
import type { Column } from "@/components/common/BaseTable.vue";

export function useAssociationTable() {
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

  const { data, isLoading } = useAssociationsList(queryParams);
  const { deleteMutation } = useAssociationMutations();

  const items = computed(() => data.value?.data?.data || []);
  const total = computed(() => data.value?.data?.total || 0);
  const offset = computed(
    () => (queryParams.value.page - 1) * queryParams.value.limit
  );

  const createPermission = computed(() =>
    permissionStore.hasPermission("associations.store")
  );
  const editPermission = computed(() =>
    permissionStore.hasPermission("associations.edit")
  );
  const showPermission = computed(() =>
    permissionStore.hasPermission("associations.show")
  );
  const deletePermission = computed(() =>
    permissionStore.hasPermission("associations.delete")
  );

  const tableColumns: Column[] = [
    { label: "Logo", field: "logo", type: "image" },
    { label: "Name", field: "name" },
    { label: "Short Name", field: "shortName" },
    { label: "Country", field: "countryName" },
  ];

  const openNewForm = () => router.push({ name: "association-new" });
  const editItem = (item: any) =>
    router.push({ name: "association-edit", params: { id: item.id } });
  const viewItem = (item: any) =>
    router.push({ name: "association-view", params: { id: item.id } });

  const confirmDeleteItem = (item: any) => {
    confirm.require({
      message: t("associations.confirmDelete"),
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
