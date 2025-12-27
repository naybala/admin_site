<script setup lang="ts">
import { computed } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Paginator from "primevue/paginator";
import BaseTable from "@/components/common/BaseTable.vue";
import { useListingTable } from "@/composables/listings/useListingTable";
import { usePermissionStore } from "@/stores/permission";
import Loader from "@/components/common/Loader.vue";
import { useI18n } from "vue-i18n";
import FilterSelect from "@/components/common/FilterSelect.vue";

const {
  items,
  loading,
  searchTerm,
  searchLocation,
  searchType,
  searchGroupType,
  searchCountry,
  page,
  filteredLocations,
  countries,
  groupTypes,
  types,
  minPrice,
  maxPrice,
  submitFilters,
  resetFilters,
  limit,
  total,
  fetchData,
  openNewForm,
  editItem,
  viewItem,
  sentItemToTelegram,
  confirmDeleteItem,
  sentNotification,
  sentItemToFacebook,
} = useListingTable();

const first = computed(() => (page.value - 1) * limit.value);
const onPageChange = (event: any) => fetchData(event.page + 1, event.rows);
const { t } = useI18n();

const permissionStore = usePermissionStore();

const createPermission = computed(() =>
  permissionStore.hasPermission("properties.store")
);
const editPermission = computed(() =>
  permissionStore.hasPermission("properties.edit")
);

const sentTelegramPermission = computed(() =>
  permissionStore.hasPermission("properties.can_sent_telegram")
);

const showPermission = computed(() =>
  permissionStore.hasPermission("properties.show")
);
const deletePermission = computed(() =>
  permissionStore.hasPermission("properties.delete")
);

const tableColumns = [
  { label: "List Date", field: "createdAt" },
  { label: "code", field: "code" },
  { label: "Img URL", field: "url", isImage: true },
  { label: "Property Type", field: "type" },
  { label: "Rent Or Sale", field: "groupType" },
  { label: "Old Price", field: "price" },
  { label: "New Price", field: "lastPrice" },
  { label: "Location", field: "location", isHeaderStart: true },
  { label: "Visibility", field: "is_private" },
];

const tableActions = [
  {
    icon: "pi pi-telegram",
    permission: sentTelegramPermission.value,
    handler: (item: any) => sentItemToTelegram(item.id),
    tooltip: "Send to Telegram",
    class: "p-button-text p-button-info mr-2",
  },
  {
    icon: "pi pi-facebook",
    permission: sentTelegramPermission.value,
    handler: (item: any) => sentItemToFacebook(item.id),
    tooltip: "Send to Facebook",
    class: "p-button-text p-button-info mr-2",
  },

  {
    icon: "pi pi-bell",
    permission: sentTelegramPermission.value,
    handler: (item: any) => sentNotification(item.id),
    tooltip: "Send to Notification",
    class: "p-button-text p-button-info mr-2",
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
    tooltip: "Delete Item",
    handler: (item: any) => confirmDeleteItem(item),
    class: "p-button-text p-button-danger",
  },
];
</script>

<template>
  <div class="p-1 md:p-6">
    <h1 class="text-3xl font-bold mb-6">{{ t("listings.title") }}</h1>

    <div>
      <div
        class="shadow-lg dark:shadow-slate-500 px-3 py-1 mb-1 md:mb-3 rounded-md"
      >
        <div class="flex justify-between items-center mb-1 flex-wrap">
          <InputText
            v-model="searchTerm"
            placeholder="Search Everything..."
            class="p-inputtext-sm w-full md:w-1/3 mb-2 md:mb-0 p-3 shadow-md dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
          />

          <Button
            v-if="createPermission"
            label="Add Listing"
            icon="pi pi-plus"
            class="p-button-success border border-gray-300 bg-green-400 p-2 shadow-md"
            @click="openNewForm"
          />
        </div>
        <div
          class="flex justify-between gap-4 items-center mt-3 mb-3 flex-wrap"
        >
          <span v-if="loading">Fetching User Location...</span>
          <span v-else>
            <FilterSelect
              id="phoneNumberPrefix"
              v-model="searchCountry"
              :label="t('users.country')"
              :options="countries"
              :placeholder="t('users.selectCountry')"
              optionLabel="name"
              optionValue="code"
              :showFlag="true"
              :showClear="true"
            />
          </span>

          <FilterSelect
            id="locationId"
            v-model="searchLocation"
            :label="t('listings.location')"
            :options="filteredLocations"
            :placeholder="t('listings.selectLocation')"
            optionLabel="name"
            optionValue="id"
            :showFlag="false"
            :showClear="true"
          />

          <FilterSelect
            id="groupType"
            v-model="searchGroupType"
            :label="t('listings.rentOrSale')"
            :options="groupTypes"
            :placeholder="t('listings.selectRentOrSale')"
            optionLabel=""
            optionValue=""
            :showFlag="false"
            :showClear="true"
          />

          <FilterSelect
            id="type"
            v-model="searchType"
            :label="t('listings.propertyType')"
            :options="types"
            :placeholder="t('listings.selectPropertyType')"
            optionLabel="name"
            optionValue="name"
            :showFlag="false"
            :showClear="true"
          />
          <div>
            <InputText
              v-model.number="minPrice"
              placeholder="Min Price"
              type="number"
              class="p-inputtext-sm w-full md:w-32 mb-2 md:mb-0 px-3 py-3.5 shadow-md dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <InputText
              v-model.number="maxPrice"
              placeholder="Max Price"
              type="number"
              class="p-inputtext-sm w-full md:w-32 mb-2 md:mb-0 px-3 py-3.5 shadow-md dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
            />
          </div>

          <Button
            label="Reset Filter"
            icon="pi pi-filter"
            class="p-button-info border border-gray-300 p-2 shadow-md"
            @click="resetFilters"
          />

          <Button
            label="Apply Filter"
            icon="pi pi-filter"
            class="p-button-info border border-gray-300 p-2 shadow-md"
            @click="submitFilters"
          />
        </div>
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
              v-if="showPermission"
              rowClickUrl="listing-view"
              :columns="tableColumns"
              :items="items"
              :actions="tableActions"
              tdHeaderClass="border text-center"
              tdStyleClass="border px-1 py-1 text-center "
            />
            <BaseTable
              v-else
              :columns="tableColumns"
              :items="items"
              :actions="tableActions"
              tdHeaderClass="border text-center"
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
