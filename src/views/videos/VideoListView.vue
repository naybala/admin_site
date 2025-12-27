<script setup lang="ts">
import { onMounted, computed } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Paginator from "primevue/paginator";
import BaseTable from "@/components/common/BaseTable.vue";
import { useVideoTable } from "@composables/videos/useVideoTable";
import { usePermissionStore } from "@/stores/permission";
import Loader from "@/components/common/Loader.vue";
import { useI18n } from "vue-i18n";
import FilterSelect from "@/components/common/FilterSelect.vue";

const {
  items,
  loading,
  searchTerm,
  searchCategory,
  categories,
  page,
  limit,
  total,
  fetchData,
  openNewForm,
  editItem,
  viewItem,
  confirmDeleteItem,
} = useVideoTable();

const first = computed(() => (page.value - 1) * limit.value);
const onPageChange = (event: any) => fetchData(event.page + 1, event.rows);
const { t } = useI18n();

onMounted(() => fetchData());

const permissionStore = usePermissionStore();
const createPermission = computed(() =>
  permissionStore.hasPermission("videos.store")
);
const editPermission = computed(() =>
  permissionStore.hasPermission("videos.edit")
);
const showPermission = computed(() =>
  permissionStore.hasPermission("videos.show")
);
const deletePermission = computed(() =>
  permissionStore.hasPermission("videos.delete")
);

const tableColumns = [
  { label: "News Date", field: "createdAt" },
  { label: "coverImage", field: "coverImage", isImage: true },
  { label: "category", field: "category" },
  { label: "description", field: "description" },
  { label: "Status", field: "status" },
];

const tableActions = [
  {
    icon: "pi pi-eye",
    permission: showPermission.value,
    handler: (item: any) => viewItem(item),
    class: "p-button-text p-button-warning mr-2",
    tooltip: "View Item",
  },
  {
    icon: "pi pi-pencil",
    permission: editPermission.value,
    handler: (item: any) => editItem(item),
    class: "p-button-text p-button-warning mr-2",
    tooltip: "Edit Item",
  },
  {
    icon: "pi pi-trash",
    permission: deletePermission.value,
    handler: (item: any, event: Event) => confirmDeleteItem(event, item),
    class: "p-button-text p-button-danger",
    tooltip: "Delete Item",
  },
];
</script>

<template>
  <div class="p-0 md:p-6">
    <h1 class="text-3xl font-bold mb-6">{{ t("videos.title") }}</h1>

    <div>
      <div class="flex justify-between items-center mb-4 flex-wrap">
        <InputText
          v-model="searchTerm"
          placeholder="Search..."
          class="p-inputtext-sm w-full md:w-1/3 mb-2 md:mb-0 p-3 shadow-md"
        />

        <FilterSelect
          id="searchCategory"
          v-model="searchCategory"
          :label="t('videos.category')"
          :options="categories"
          :placeholder="t('videos.selectCategory')"
          optionLabel="name"
          optionValue="id"
          :showFlag="false"
          :showClear="true"
        />

        <Button
          v-if="createPermission"
          label="Add Video"
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
              tdHeaderClass="border px-1 py-1 text-center"
              tdStyleClass="border px-1 py-1 text-center"
            />
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
                :rowsPerPageOptions="[10, 20, 50, 100, 500]"
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

<style scoped></style>
