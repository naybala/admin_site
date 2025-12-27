<script setup lang="ts">
import { computed } from "vue";
import Paginator from "primevue/paginator";
import BaseTable from "@/components/common/BaseTable.vue";
import Loader from "@/components/common/Loader.vue";
import { useI18n } from "vue-i18n";
import { useListingBoostOrderTable } from "@/composables/listings/useListingBoostOrder";
import InputText from "primevue/inputtext";

const { items, loading, page, limit, total, fetchData, searchTerm } =
  useListingBoostOrderTable();

const first = computed(() => (page.value - 1) * limit.value);
const onPageChange = (event: any) => fetchData(event.page + 1, event.rows);
const { t } = useI18n();

const tableColumns = [
  { label: "Content Id", field: "contentId" },
  { label: "Created Date", field: "createdAt" },
  { label: "User Name", field: "userName" },
  { label: "User Email", field: "userEmail" },
  { label: "User Phone", field: "userPhoneNumber" },
  { label: "Plan Id", field: "planId" },
  { label: "Amount", field: "amount" },
  { label: "Transaction Type", field: "transactionType" },
  { label: "Status", field: "orderStatus" },
  { label: "Facebook", field: "isSentFacebook" },
  { label: "OneSignal", field: "isSentOneSignal" },
  { label: "Telegram", field: "isSentTelegram" },
];
</script>

<template>
  <div class="p-0 md:p-6">
    <h1 class="text-3xl font-bold mb-6">
      {{ t("listings.propertyBoostOrders") }}
    </h1>

    <div>
      <div class="flex justify-start items-center mb-4 flex-wrap gap-4">
        <InputText
          v-model="searchTerm"
          placeholder="Search Everything..."
          class="mt-2 p-inputtext-sm w-full md:w-1/3 mb-2 md:mb-0 p-3 shadow-md dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
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
            <BaseTable :columns="tableColumns" :items="items" />
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

<style scoped></style>
