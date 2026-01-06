<script setup lang="ts">
import { onMounted } from "vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Paginator from "primevue/paginator";
import Dropdown from "primevue/dropdown";
import BaseTable from "@/components/common/BaseTable.vue";
import Loader from "@/components/common/Loader.vue";
import { useUserTable } from "../hooks/useUserTable";

const {
  t,
  searchTerm,
  searchPrefixPhoneNumber,
  searchRole,
  searchAssociation,
  items,
  total,
  offset,
  isLoading,
  queryParams,
  createPermission,
  userTypes,
  countries,
  ownLicenses,
  rolesOptions,
  associationsOptions,
  tableColumns,
  tableActions,
  openNewForm,
  handlePageChange,
  submitFilters,
  initializeFilters,
} = useUserTable();

onMounted(() => {
  initializeFilters();
});
</script>

<template>
  <div>
    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
      <InputText
        v-model="searchTerm"
        placeholder="Search..."
        class="p-inputtext-sm p-3 shadow-md"
      />
      <Dropdown
        v-model="searchPrefixPhoneNumber"
        :options="countries"
        optionLabel="name"
        optionValue="code"
        placeholder="Select Country"
        class="p-inputtext-sm shadow-md"
        showClear
      />
      <Dropdown
        v-model="searchRole"
        :options="rolesOptions"
        optionLabel="name"
        optionValue="id"
        placeholder="Select Role"
        class="p-inputtext-sm shadow-md"
        showClear
      />
      <Dropdown
        v-model="searchAssociation"
        :options="associationsOptions"
        optionLabel="name"
        optionValue="id"
        placeholder="Select Association"
        class="p-inputtext-sm shadow-md"
        showClear
      />
    </div>

    <div class="flex justify-between items-center mb-4">
      <Button
        label="Apply Filters"
        icon="pi pi-filter"
        class="p-button-info p-2 shadow-md"
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

    <div>
      <div v-if="isLoading">
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
