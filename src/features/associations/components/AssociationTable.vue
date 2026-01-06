<script setup lang="ts">
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Paginator from "primevue/paginator";
import BaseTable from "@/components/common/BaseTable.vue";
import Loader from "@/components/common/Loader.vue";
import { useAssociationTable } from "../hooks/useAssociationTable";

const {
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
} = useAssociationTable();
</script>

<template>
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
      <div v-if="isLoading" class="">
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
              :rows="queryParams.limit"
              :first="offset"
              :totalRecords="total"
              :page="queryParams.page - 1"
              :rowsPerPageOptions="[10, 20, 50, 100]"
              @page="handlePageChange"
              class="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
