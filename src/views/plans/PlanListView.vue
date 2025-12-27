<script setup lang="ts">
import { onMounted, computed } from "vue";
import Button from "primevue/button";
import { usePlanTable } from "@composables/plans/usePlanTable";
import { usePermissionStore } from "@/stores/permission";
import Loader from "@/components/common/Loader.vue";
import { useI18n } from "vue-i18n";
import SelectItem from "@/components/common/SelectItem.vue";
import CombineRowBaseTable from "@/components/common/CombineRowBaseTable.vue";

const {
  items,
  loading,
  countries,
  defaultCountry,
  fetchAllData,
  openNewForm,
  editItem,
  viewItem,
  confirmDeleteItem,
} = usePlanTable();

const { t } = useI18n();

onMounted(() => fetchAllData());

const permissionStore = usePermissionStore();
const createPermission = computed(() =>
  permissionStore.hasPermission("roles.store")
);
const editPermission = computed(() =>
  permissionStore.hasPermission("roles.edit")
);

const showPermission = computed(() =>
  permissionStore.hasPermission("roles.show")
);

const deletePermission = computed(() =>
  permissionStore.hasPermission("roles.delete")
);

const groupedItems = computed(() => {
  return items.value.map((group: any) => {
    const parentInfo = {
      name: group.name,
      userType: group.userType,
      userTypeName: group.userTypeName,
      countryCode: group.countryCode,
      price: group.price,
      currency: group.currency,
    };

    return {
      ...group,
      id: `${group.name}-${group.userType}-${group.countryCode}`,
      children: (group.plans || []).map((plan: any) => ({
        ...plan,
        ...parentInfo,
      })),
    };
  });
});

const tableColumns = [
  { label: "Name", field: "name" },
  { label: "userTypeName", field: "userTypeName" },
  { label: "countryCode", field: "countryCode" },
  { label: "price", field: "price" },
  { label: "duration", field: "duration" },
  { label: "vatPercent", field: "vatPercent" },
  { label: "finalPrice", field: "finalPrice" },
  { label: "Currency", field: "currency" },
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
    <h1 class="text-3xl font-bold mb-6">{{ t("plans.plans") }}</h1>

    <div v-if="loading" class="">
      <Loader />
    </div>

    <div v-else>
      <div class="flex justify-between items-center mb-4 flex-wrap">
        <!-- Country -->
        <SelectItem
          id="country"
          v-model="defaultCountry"
          :label="t('users.country')"
          :options="countries"
          :placeholder="t('users.selectCountry')"
          optionLabel="name"
          optionValue="countryCode"
          :showFlag="true"
          :readonly="false"
          :showClear="false"
        />

        <Button
          v-if="createPermission"
          label="Add Plan"
          icon="pi pi-plus"
          class="p-button-success border border-gray-300 bg-green-400 p-2 shadow-md"
          @click="openNewForm"
        />
      </div>

      <div>
        <div v-if="items.length === 0" class="text-gray-300">
          No Data Found...
        </div>
        <div v-else class="shadow-md">
          <CombineRowBaseTable
            :columns="tableColumns"
            :items="groupedItems"
            :actions="tableActions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
