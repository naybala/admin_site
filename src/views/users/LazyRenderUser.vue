<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Paginator from "primevue/paginator";
import BaseTable from "@/components/common/BaseTable.vue";
import { useUserTable } from "@composables/users/useUserTable";
import { usePermissionStore } from "@/stores/permission";
import Loader from "@/components/common/Loader.vue";
import { useI18n } from "vue-i18n";
import { useInfiniteScroll } from "@/composables/common/useInfiniteScroll";
import { useLazyRender } from "@/composables/common/useLazyRender";

// composables
const {
  items,
  userTypes,
  countries,
  ownLicenses,
  loading,
  searchTerm,
  searchPrefixPhoneNumber,
  page,
  limit,
  total,
  fetchData,
  openNewForm,
  editItem,
  viewItem,
  confirmDeleteItem,
} = useUserTable();

const { t } = useI18n();
const footerRef = ref<HTMLElement | null>(null);
const first = computed(() => (page.value - 1) * limit.value);
const onPageChange = (event: any) => {
  currentRenderPage.value = 1;
  fetchData(event.page + 1, event.rows);
};

// Permissions
const permissionStore = usePermissionStore();
const createPermission = computed(() => permissionStore.hasPermission("users.store"));
const editPermission = computed(() => permissionStore.hasPermission("users.edit"));
const showPermission = computed(() => permissionStore.hasPermission("users.show"));
const deletePermission = computed(() => permissionStore.hasPermission("users.delete"));

// Table
const tableColumns = [
  { label: "ID", field: "id" },
  { label: "Phone Number Prefix", field: "phoneNumberPrefix" },
  { label: "Username", field: "username" },
  { label: "Email", field: "email" },
  { label: "Phone Number", field: "phoneNumber" },
];

const openModal = (item: any) => {
  console.log(`Upgrading User name: ${item.username}`);
};

const tableActions = [
  {
    icon: "pi pi-eject",
    permission: showPermission.value,
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

// Hybrid Lazy Render Logic
const {
  displayedItems,
  hasMoreToRender,
  loadMoreItems,
  currentRenderPage,
} = useLazyRender(items, limit);
useInfiniteScroll(footerRef, loadMoreItems);

// Initial fetch
onMounted(() => {
  fetchData();
});
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
        <InputText
          v-model="searchPrefixPhoneNumber"
          placeholder="Search By Prefix..."
          class="p-inputtext-sm w-full md:w-1/3 mb-2 md:mb-0 p-3 shadow-md"
        />
        <Button
          v-if="createPermission"
          label="Add User"
          icon="pi pi-plus"
          class="p-button-success border border-gray-300 p-2 shadow-md"
          @click="openNewForm"
        />
      </div>

      <!-- Table and Scroll -->
      <div>
        <div v-if="loading" class="">
          <Loader />
        </div>

        <div v-else>
          <div v-if="items.length === 0" class="text-gray-300">No Data Found...</div>
          <div v-else class="shadow-md">
            <BaseTable
              :columns="tableColumns"
              :items="displayedItems"
              :actions="tableActions"
              :userTypes="userTypes"
              :countries="countries"
              :ownLicenses="ownLicenses"
            />

            <!-- Lazy Render Scroll Footer -->
            <div ref="footerRef" class="text-center py-4">
              <p v-if="hasMoreToRender" class="text-gray-400 text-sm">Loading...</p>
              <p v-else class="text-gray-400 text-sm">All items loaded</p>
            </div>

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
                :rowsPerPageOptions="[10, 20, 50, 100, 200, 1000]"
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
