<script setup lang="ts">
import Toast from "primevue/toast";
import Card from "primevue/card";
import FormActions from "@components/common/FormActions.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import Loader from "@/components/common/Loader.vue";
import { useServerError } from "@/composables/common/useServerError";
import { useMapPriceOrderForm } from "@composables/mapPriceOrders/useMapPriceOrderForm";

const {
  t,
  state,
  form,
  save,
  orderList,
  isUpdate,
  loading,
  cancel,
  error,
} = useMapPriceOrderForm();
// Handle server error
useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("mapPriceOrders.view")
          : state.isEditMode
          ? t("mapPriceOrders.edit")
          : t("mapPriceOrders.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading">
          <Loader />
        </span>

        <form @submit.prevent="save" v-else>
          <div class="flex justify-start items-center">
            <div>
              <p>User Name : {{ form.userName }}</p>
              <p>Package Name : {{ form.packageName }}</p>
              <p>Platform : {{ form.transactionPlatform }}</p>
              <p>Transaction Ref : {{ form.transactionRef }}</p>
              <p>Transaction Type : {{ form.transactionType }}</p>
              <p>Price : {{ form.price }} ({{ form.currencyCode }})</p>
              <p>Duration : {{ form.duration }}</p>
              <p>Is Renew : {{ form.isRenew }}</p>
              <p>This order is created at : {{ form.createdAt }}</p>
            </div>
          </div>

          <br /><br />

          <!-- Order Status -->
          <div class="grid grid-cols-3 gap-3">
            <SelectItem
              id="orderStatus"
              v-model="form.status"
              :label="t('mapPriceOrders.orderStatus')"
              :options="orderList"
              :placeholder="t('mapPriceOrders.selectOrderStatus')"
              optionLabel="name"
              optionValue="id"
              :readonly="false"
            />
          </div>

          <FormActions
            :onCancel="cancel"
            :saveLabel="t('common.save')"
            :cancelLabel="t('common.cancel')"
            :loading="state.saving"
            :readonly="isUpdate"
          />
        </form>
      </template>
    </Card>
  </div>
</template>
