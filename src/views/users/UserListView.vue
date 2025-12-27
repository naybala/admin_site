<script setup lang="ts">
import { computed } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Paginator from "primevue/paginator";
import BaseTable from "@/components/common/BaseTable.vue";
import { useUserTable } from "@composables/users/useUserTable";
import { usePermissionStore } from "@/stores/permission";
import Loader from "@/components/common/Loader.vue";
import { useI18n } from "vue-i18n";
import FilterSelect from "@/components/common/FilterSelect.vue";

// composables
const {
  items,
  userTypes,
  countries,
  ownLicenses,
  associations,
  loading,
  roles,
  searchRole,
  searchTerm,
  serverSideEdit,
  searchAssociation,
  page,
  limit,
  total,
  fetchData,
  openNewForm,
  editItem,
  viewItem,
  submitFilters,
  confirmDeleteItem,
} = useUserTable();

const { t } = useI18n();
const first = computed(() => (page.value - 1) * limit.value);
const onPageChange = (event: any) => {
  fetchData(event.page + 1, event.rows);
};

// Permissions
const permissionStore = usePermissionStore();
const createPermission = computed(() =>
  permissionStore.hasPermission("users.store")
);

const showPermission = computed(() =>
  permissionStore.hasPermission("users.show")
);

const upgradePermission = computed(() =>
  permissionStore.hasPermission("users.upgrade")
);

const overAllEditPermission = computed(
  () => permissionStore.hasPermission("users.edit") && serverSideEdit.value
);

const overAllDeletePermission = computed(
  () => permissionStore.hasPermission("users.delete") && serverSideEdit.value
);

// Table
const tableColumns = [
  { label: "Id", field: "id" },
  { label: "Register Date", field: "createdAt" },
  { label: "Username", field: "username" },
  { label: "fullName", field: "fullName" },
  { label: "User Type", field: "userType" },
  { label: "Email", field: "email" },
  { label: "Phone Number", field: "phoneNumber" },
];

const openModal = (item: any) => {
  console.log(`Upgrading User name: ${item.username}`);
};

const tableActions = computed(() => [
  {
    icon: "pi pi-eject",
    permission: upgradePermission.value,
    handler: (item: any) => openModal(item),
    tooltip: "Upgrade User",
    class: "p-button-text p-button-warning mr-2",
  },
  {
    icon: "pi pi-eye",
    permission: showPermission.value,
    handler: (item: any) => viewItem(item),
    tooltip: "View Item",
    class: "p-button-text p-button-warning mr-2",
  },
  {
    icon: "pi pi-pencil",
    permission: overAllEditPermission.value,
    handler: (item: any) => editItem(item),
    tooltip: "Edit Item",
    class: "p-button-text p-button-warning mr-2",
  },
  {
    icon: "pi pi-trash",
    permission: overAllDeletePermission.value,
    handler: (item: any) => confirmDeleteItem(item),
    tooltip: "Delete Item",
    class: "p-button-text p-button-danger",
  },
]);
</script>
<template>
  <div class="p-1 md:p-6">
    <h1 class="text-3xl font-bold mb-6">{{ t("users.users") }}</h1>

    <div>
      <!-- Filters -->
      <div class="flex justify-between items-center mb-4 flex-wrap">
        <InputText
          v-model="searchTerm"
          placeholder="Search..."
          class="p-inputtext-sm w-full md:w-1/3 mb-2 md:mb-0 p-3 shadow-md"
        />

        <FilterSelect
          id="role"
          v-model="searchRole"
          :label="t('users.role')"
          :options="roles"
          :placeholder="t('users.selectRole')"
          optionLabel="name"
          optionValue="id"
          :showFlag="false"
          :showClear="true"
        />

        <FilterSelect
          id="association"
          v-model="searchAssociation"
          :label="t('users.association')"
          :options="associations"
          :placeholder="t('users.selectAssociation')"
          optionLabel="name"
          optionValue="id"
          :showFlag="true"
          imgKey="logo"
          :showClear="true"
        />

        <Button
          label="Apply Filter"
          icon="pi pi-filter"
          class="p-button-info border border-gray-300 p-2 shadow-md"
          @click="submitFilters"
        />

        <Button
          v-if="createPermission"
          label="Add User"
          icon="pi pi-plus"
          class="p-button-success border border-gray-300 bg-green-400 p-2 shadow-md"
          @click="openNewForm"
        />
      </div>

      <!-- Table and Scroll -->
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
              :userTypes="userTypes"
              :countries="countries"
              :ownLicenses="ownLicenses"
              :isHeaderSticky="false"
              :isModal="true"
            />

            <!-- Pagination -->
            <div
              class="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 pb-2"
            >
              <p class="text-sm text-gray-500 mb-2 ms-0 md:ms-2 text-start">
                Total - {{ total }} items
              </p>
              <Paginator
                :rows="limit"
                :first="first"
                :totalRecords="total"
                :page="page - 1"
                :rowsPerPageOptions="[10, 20, 50, 100]"
                @page="onPageChange"
                class="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
