<script setup lang="ts">
import { onMounted, computed } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Paginator from "primevue/paginator";
import BaseTable, { type Column } from "@/components/common/BaseTable.vue";
import { useAssociationTable } from "@composables/associations/useAssociationTable";
import { usePermissionStore } from "@/stores/permission";
import Loader from "@/components/common/Loader.vue";
import { useI18n } from "vue-i18n";

const {
  items,
  loading,
  searchTerm,
  page,
  limit,
  offset,
  total,
  fetchData,
  handlePageChange,
  openNewForm,
  editItem,
  viewItem,
  confirmDeleteItem,
} = useAssociationTable();

const { t } = useI18n();

onMounted(() => {
  fetchData();
});

const permissionStore = usePermissionStore();
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

const tableActions = [
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
];
</script>

<template>
  <div class="p-1 md:p-6">
    <h1 class="text-3xl font-bold mb-6">
      {{ t("associations.associations") }}
    </h1>
    <div>
      <div class="flex justify-between items-center mb-4 flex-wrap">
        <InputText
          v-model="searchTerm"
          placeholder="Search..."
          class="p-inputtext-sm w-full md:w-1/3 mb-2 md:mb-0 p-3 shadow-md"
        />
        <Button
          v-if="createPermission"
          label="Add Association"
          icon="pi pi-plus"
          class="p-button-success border border-gray-300 bg-green-400 p-2 shadow-md"
          @click="openNewForm"
        />
      </div>

      <div>
        <div v-if="loading" class="">
          <Loader />
        </div>
        <div v-else>
          <div v-if="items.length === 0" class="text-gray-300">
            No Data Found...
          </div>
          <div v-else class="shadow-md">
            <BaseTable
              :columns="tableColumns"
              :items="items"
              :actions="tableActions"
            />
            <div
              class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 pb-2"
            >
              <p class="text-sm text-gray-500 mb-2 ms-0 md:ms-2 text-start">
                Total - {{ total }} items
              </p>
              <Paginator
                :rows="limit"
                :first="offset"
                :totalRecords="total"
                :page="page - 1"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                @page="(e) => handlePageChange(e, fetchData)"
                class="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
