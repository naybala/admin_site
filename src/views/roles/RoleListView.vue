<script setup lang="ts">
import { onMounted, computed } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Paginator from "primevue/paginator";
import BaseTable from "@/components/common/BaseTable.vue";
import { useRoleTable } from "@composables/roles/useRoleTable";
import { usePermissionStore } from "@/stores/permission";
import Loader from "@/components/common/Loader.vue";
import { useI18n } from "vue-i18n";

const {
  roles,
  loading,
  searchTerm,
  page,
  limit,
  offset,
  total,
  fetchData,
  handlePageChange,
  openNewRoleForm,
  editRole,
  viewRole,
  confirmDeleteRole,
} = useRoleTable();

const { t } = useI18n();
onMounted(() => {
  fetchData();
});

const permissionStore = usePermissionStore();

const createRolePermission = computed(() =>
  permissionStore.hasPermission("roles.store")
);
const editRolePermission = computed(() =>
  permissionStore.hasPermission("roles.edit")
);
const showPermission = computed(() =>
  permissionStore.hasPermission("roles.show")
);
const deleteRolePermission = computed(() =>
  permissionStore.hasPermission("roles.delete")
);

// Table columns and actions
import type { Column } from "@/components/common/BaseTable.vue";

const tableColumns: Column[] = [
  { label: "Name", field: "name" },
  { label: "Description", field: "description" },
];

const tableActions = [
  {
    icon: "pi pi-eye",
    permission: showPermission.value,
    handler: (item: any) => viewRole(item),
    tooltip: "View Item",
    class: "p-button-text p-button-warning mr-2",
  },
  {
    icon: "pi pi-pencil",
    permission: editRolePermission.value,
    handler: (item: any) => editRole(item),
    tooltip: "Edit Item",
    class: "p-button-text p-button-warning mr-2",
  },
  {
    icon: "pi pi-trash",
    permission: deleteRolePermission.value,
    tooltip: "Delete Item",
    handler: (item: any, event: Event) => confirmDeleteRole(event, item),
    class: "p-button-text p-button-danger",
  },
];
</script>

<template>
  <div class="p-1 md:p-6">
    <h1 class="text-3xl font-bold mb-6">{{ t("roles.roles") }}</h1>

    <div>
      <!-- Search and Add -->
      <div class="flex justify-between items-center mb-4 flex-wrap">
        <InputText
          v-model="searchTerm"
          placeholder="Search..."
          class="p-inputtext-sm w-full md:w-1/3 mb-2 md:mb-0 p-3 shadow-md"
        />

        <Button
          v-if="createRolePermission"
          label="Add Role"
          icon="pi pi-plus"
          class="p-button-success border border-gray-300 bg-green-400 p-2 shadow-md"
          @click="openNewRoleForm"
        />
      </div>

      <!-- Table & Paginator -->
      <div>
        <!-- Loading/Error -->
        <div v-if="loading" class="">
          <Loader />
        </div>

        <div v-else>
          <div v-if="roles.length === 0" class="text-gray-300">
            No Data Found...
          </div>
          <div v-else class="shadow-md">
            <BaseTable
              :columns="tableColumns"
              :items="roles"
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
