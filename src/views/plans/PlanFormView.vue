<script setup lang="ts">
import { usePlanForm } from "@composables/plans/usePlanForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import { Button } from "primevue";
import { TransitionGroup } from "vue";
import { handleFastLoading } from "@/utils/useFastLoading";

const {
  t,
  isShowMode,
  isEditMode,
  form,
  countries,
  userTypes,
  save,
  loading,
  deletedPlans,
  validationErrors,
  cancel,
  error,
  saving,
} = usePlanForm();

handleFastLoading(loading);
useServerError(error);

function addMore() {
  form.value.plans.push({
    duration: 1,
    discountPercent: 0,
    vatPercent: 0,
    numAgent: 0,
    numProperty: 0,
    numAuto: 0,
    numDocument: 0,
    numMeasurement: 0,
    pricePerAdvertise: 0,
    pricePerValuation: 0,
  });
}

function removePlan(index: number) {
  if (form.value.plans.length > 1) {
    const removed = form.value.plans[index];
    if (removed.id) {
      deletedPlans.value.push(removed.id);
    }
    form.value.plans.splice(index, 1);
  }
}

function calculateFinalPrice(plan: any): number {
  const basePrice = Number(form.value.price || 0);
  const duration = Number(plan.duration || 1);
  const discount = Number(plan.discountPercent || 0);
  const vat = Number(plan.vatPercent || 0);

  if (!basePrice || duration <= 0) return 0;

  const priceBeforeDiscount = basePrice * duration;
  const discountAmount = (priceBeforeDiscount * discount) / 100;
  const vatAmount = ((priceBeforeDiscount - discountAmount) * vat) / 100;
  const finalPrice = priceBeforeDiscount - discountAmount + vatAmount;

  return Math.round(finalPrice * 100) / 100;
}

const minMonth = "1";
const maxMonth = "12";
const minNumber = "0";
const maxPercent = "100";
const maxNumber = "1000000000000";
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        isShowMode
          ? t("plans.view")
          : isEditMode
          ? t("plans.edit")
          : t("plans.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <!-- Country  -->
          <SelectItem
            id="countryCode"
            v-model="form.countryCode"
            :label="t('plans.country')"
            :options="countries"
            :placeholder="t('users.selectCountry')"
            :error="validationErrors.countryCode"
            optionLabel="name"
            optionValue="countryCode"
            :showFlag="true"
            :readonly="isShowMode"
            :showClear="true"
          />

          <!-- User Type  -->
          <SelectItem
            id="userType"
            v-model="form.userType"
            :label="t('plans.userType')"
            :options="userTypes"
            :placeholder="t('plans.selectUserType')"
            :error="validationErrors.userType"
            :showFlag="false"
            :readonly="isShowMode"
            :showClear="true"
            optionLabel="name"
            optionValue="id"
          />

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <!-- Price -->
            <NameField
              id="price"
              v-model="form.price"
              :label="t('plans.price')"
              :error="validationErrors.price"
              :readonly="isShowMode"
            />
            <!-- Currency   -->
            <SelectItem
              id="currency"
              v-model="form.currency"
              :label="t('plans.currency')"
              :options="countries"
              :placeholder="t('plans.selectCurrency')"
              :error="validationErrors.currency"
              :showFlag="false"
              :readonly="isShowMode"
              :showClear="true"
              optionLabel="currencyCode"
              optionValue="currencyCode"
            />
          </div>

          <div
            class="border border-gray-300 dark:border-gray-600 px-5 py-4 rounded-lg"
          >
            <div>
              <Button
                label=" + Add More"
                severity="secondary"
                @click="addMore"
                class="p-button-secondary text-white bg-gray-600 dark:bg-gray-700 px-5"
              />
            </div>
            <br />
            <TransitionGroup tag="div" name="fade-slide" class="space-y-4">
              <div
                v-for="(plan, index) in form.plans"
                :key="index"
                class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 hover:shadow-2xl hover:translate-y-1 transition-all duration-500 ease-in-out hover:rounded-lg px-3"
              >
                <!-- Duration -->
                <NameField
                  :id="`duration-${index}`"
                  v-model="plan.duration"
                  :label="t('plans.duration')"
                  :error="validationErrors.duration"
                  :readonly="isShowMode"
                  type="number"
                  :min="minMonth"
                  :max="maxMonth"
                />
                <!-- Discount Percent -->
                <NameField
                  :id="`discountPercent-${index}`"
                  v-model="plan.discountPercent"
                  :label="t('plans.discountPercent')"
                  :error="validationErrors[`plans.${index}.discountPercent`]"
                  :readonly="isShowMode"
                  type="number"
                  :min="minNumber"
                  :max="maxPercent"
                />
                <!-- Price Per Advertise -->
                <NameField
                  :id="`pricePerAdvertise-${index}`"
                  v-model="plan.pricePerAdvertise"
                  :label="t('plans.pricePerAdvertise')"
                  :readonly="isShowMode"
                  type="number"
                  :min="minNumber"
                  :max="maxNumber"
                />
                <!-- Price Per Valuation -->
                <NameField
                  :id="`pricePerValuation-${index}`"
                  v-model="plan.pricePerValuation"
                  :label="t('plans.pricePerValuation')"
                  :readonly="isShowMode"
                  type="number"
                  :min="minNumber"
                  :max="maxNumber"
                />
                <!-- VAT Percent + Delete Button -->
                <div class="flex items-center justify-start">
                  <NameField
                    :id="`vatPercent-${index}`"
                    v-model="plan.vatPercent"
                    :label="t('plans.vatPercent')"
                    :error="validationErrors[`plans.${index}.vatPercent`]"
                    :readonly="isShowMode"
                    type="number"
                    min="0"
                    max="100"
                    style="width: 100%"
                  />

                  <!-- Delete Button -->
                  <Button
                    icon="pi pi-trash"
                    class="p-button-danger p-button-sm"
                    @click="removePlan(index)"
                    v-if="!isShowMode && form.plans.length > 1"
                    type="button"
                  />
                </div>
                <!-- Number Of Agents -->
                <NameField
                  :id="`numAgent-${index}`"
                  v-model="plan.numAgent"
                  :label="t('plans.numAgent')"
                  :readonly="isShowMode"
                  type="number"
                  :min="minNumber"
                  :max="maxNumber"
                />
                <!-- Number Of Property -->
                <NameField
                  :id="`numOfProperty-${index}`"
                  v-model="plan.numProperty"
                  :label="t('plans.numProperty')"
                  :readonly="isShowMode"
                  type="number"
                  :min="minNumber"
                  :max="maxNumber"
                />
                <!-- Number Of Autos -->
                <NameField
                  :id="`numOfAutos-${index}`"
                  v-model="plan.numAuto"
                  :label="t('plans.numAuto')"
                  :readonly="isShowMode"
                  type="number"
                  :min="minNumber"
                  :max="maxNumber"
                />
                <!-- Number Of numDocuments -->
                <NameField
                  :id="`numOfDocuments-${index}`"
                  v-model="plan.numDocument"
                  :label="t('plans.numDocument')"
                  :readonly="isShowMode"
                  type="number"
                  :min="minNumber"
                  :max="maxNumber"
                />
                <!-- Number Of Measurements -->
                <NameField
                  :id="`numOfMeasurements-${index}`"
                  v-model="plan.numMeasurement"
                  :label="t('plans.numMeasurement')"
                  :readonly="isShowMode"
                  type="number"
                  :min="minNumber"
                  :max="maxNumber"
                />

                <!--  Calculated Final Price -->
                <p class="text-sm text-gray-700 dark:text-gray-300">
                  {{ t("plans.finalPrice") }}:
                  <span class="font-semibold">
                    {{ calculateFinalPrice(plan) }}
                  </span>
                </p>
              </div>
            </TransitionGroup>
          </div>

          <FormActions
            :onCancel="cancel"
            :saveLabel="t('common.save')"
            :cancelLabel="t('common.cancel')"
            :loading="saving"
            :readonly="isShowMode"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* .fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
} */
</style>
