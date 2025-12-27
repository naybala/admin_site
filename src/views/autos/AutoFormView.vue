<script setup lang="ts">
import { useAutoForm } from "@composables/autos/useAutoForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";
import ImageUploader from "@/components/common/ImageUploader.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import Description from "@/components/common/Description.vue";
import MapPicker from "@/components/map/MapPicker.vue";
import { computed } from "vue";
import AutoShowView from "./AutoShowView.vue";

const {
  t,
  state,
  form,
  save,
  autoTypes,
  autoBranches,
  autoSubBranches,
  autoConditions,
  transmissionType,
  fuelTypes,
  bodyTypes,
  groupTypes,
  taxTypes,
  status,
  countries,
  locations,
  districts,
  loading,
  cancel,
  error,
} = useAutoForm();

const filteredAutoBranches = computed(() =>
  autoBranches?.value?.filter((branch: any) => branch.autoType === form?.value?.autoType)
);

// Add computed property for safe position data
const safePosition = computed(() => {
  if (
    form.value?.position &&
    typeof form.value.position === "object" &&
    form.value.position !== null &&
    isFinite(form.value.position.lat) &&
    isFinite(form.value.position.lng)
  ) {
    return form.value.position;
  }
  return null;
});

// Add computed property for safe nearBy data
const safeNearBy = computed(() => {
  return Array.isArray(form.value?.nearBy) ? form.value.nearBy : [];
});

useServerError(error);

const displayData = computed(() => ({
  ...form.value,
  urlList: form.value.urlList || [],
}));
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("autos.view")
          : state.isEditMode
          ? t("autos.edit")
          : t("autos.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading" class="">
          <Loader />
        </span>

        <form @submit.prevent="save" v-else>
          <span v-if="state.isShowMode">
            <AutoShowView v-if="form" :data="displayData" />
            <div v-else class="text-center p-4">
              <Loader />
              <p>Loading auto details...</p>
            </div>
          </span>
          <span v-else>
            <!-- Image  -->
            <ImageUploader
              v-model="form.imageFiles"
              :initialUrls="form.urlList"
              :isMultiple="true"
              @update:initialUrls="(val:any) => (form.urlList = val)"
            />

            <!-- Title -->
            <NameField
              id="title"
              v-model="form.title"
              :label="t('autos.formTitle')"
              :error="state.validationErrors.titleRequired"
              :readonly="state.isShowMode"
            />

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <!-- Country -->
              <SelectItem
                id="phoneNumberPrefix"
                v-model="form.phoneNumberPrefix"
                :label="t('users.country')"
                :options="countries"
                :placeholder="t('users.selectCountry')"
                :error="state.validationErrors.phoneNumberPrefixRequired"
                optionLabel="name"
                optionValue="code"
                :showFlag="true"
                :readonly="state.isShowMode"
                :showClear="true"
              />

              <!-- Location  -->
              <SelectItem
                v-if="form.phoneNumberPrefix"
                id="locationId"
                v-model="form.locationId"
                :label="t('listings.location')"
                :options="locations"
                :placeholder="t('listings.selectLocation')"
                :error="state.validationErrors.locationIdRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
                :showClear="true"
              />

              <!-- District -->
              <SelectItem
                v-if="form.locationId"
                id="districtId"
                v-model="form.districtId"
                :label="t('listings.district')"
                :options="districts"
                :placeholder="t('listings.selectDistrict')"
                :error="state.validationErrors.districtIdRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
                :showClear="true"
              />
            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
              v-if="form.districtId"
            >
              <!-- Auto Type -->
              <SelectItem
                id="autoTypeRequired"
                v-model="form.autoType"
                :label="t('autos.autoType')"
                :options="autoTypes"
                :placeholder="t('autos.selectAutoType')"
                :error="state.validationErrors.autoTypeRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
              />

              <!-- Auto Branch -->
              <SelectItem
                id="autoBranchIdRequired"
                v-model="form.autoBranch"
                :label="t('autos.autoBranch')"
                :options="filteredAutoBranches"
                :placeholder="t('autos.selectAutoBranch')"
                :error="state.validationErrors.autoBranchRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
              />

              <!-- Auto Sub Branch -->
              <SelectItem
                id="autoSubBranchIdRequired"
                v-model="form.autoSubBranch"
                :label="t('autos.autoSubBranch')"
                :options="autoSubBranches"
                :placeholder="t('autos.selectAutoSubBranch')"
                :error="state.validationErrors.autoSubBranchRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
                :showClear="true"
              />
            </div>

            <!-- Price ,Country Code,Currency Code, Currency Symbol -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-2" v-if="form.autoType">
              <!-- Price -->
              <NameField
                id="priceRequired"
                v-model="form.price"
                :error="state.validationErrors.priceRequired"
                :readonly="state.isShowMode"
                :label="t('autos.price')"
              />
              <!--Currency Symbol -->
              <SelectItem
                id="currencySymbolRequired"
                v-model="form.currencySymbol"
                :label="t('autos.currencySymbol')"
                :options="countries"
                :placeholder="t('autos.selectCurrencySymbol')"
                :error="state.validationErrors.currencySymbolRequired"
                optionLabel="currencySymbol"
                optionValue="currencySymbol"
                :showFlag="true"
                :readonly="state.isShowMode"
              />

              <!-- Currency Code -->
              <SelectItem
                id="currencyCodeRequired"
                v-model="form.currencyCode"
                :label="t('autos.currencyCode')"
                :options="countries"
                :placeholder="t('autos.selectCurrencyCode')"
                :error="state.validationErrors.currencyCodeRequired"
                optionLabel="currencyCode"
                optionValue="currencyCode"
                :showFlag="false"
                :readonly="true"
                :showClear="false"
              />

              <!-- Country Code -->
              <SelectItem
                id="countryCodeRequired"
                v-model="form.countryCode"
                :label="t('autos.countryCode')"
                :options="countries"
                :placeholder="t('autos.selectCountryCode')"
                :error="state.validationErrors.countryCodeRequired"
                optionLabel="countryCode"
                optionValue="countryCode"
                :showFlag="true"
                :readonly="true"
                :showClear="false"
              />
            </div>
            <!-- color , year , status  -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              v-if="form.autoType"
            >
              <!-- Color -->
              <NameField
                id="colorRequired"
                v-model="form.color"
                :label="t('autos.color')"
                :error="state.validationErrors.colorRequired"
                :readonly="state.isShowMode"
              />

              <!-- Year -->
              <NameField
                id="yearRequired"
                v-model="form.year"
                :label="t('autos.year')"
                :error="state.validationErrors.yearRequired"
                :readonly="state.isShowMode"
              />
              <!-- Status -->
              <SelectItem
                id="statusRequired"
                v-model="form.status"
                :label="t('autos.status')"
                :options="status"
                :placeholder="t('autos.selectStatus')"
                :error="state.validationErrors.statusRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
              />
            </div>

            <!-- Body Type , Tax Type , Transmission Type -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              v-if="form.autoType"
            >
              <!-- Body Type -->
              <SelectItem
                id="bodyTypeRequired"
                v-model="form.bodyType"
                :label="t('autos.bodyType')"
                :options="bodyTypes"
                :placeholder="t('autos.selectBodyType')"
                :error="state.validationErrors.bodyTypeRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
              />

              <!-- Tax Type -->
              <SelectItem
                id="taxTypeRequired"
                v-model="form.taxType"
                :label="t('autos.taxType')"
                :options="taxTypes"
                :placeholder="t('autos.selectTaxType')"
                :error="state.validationErrors.taxTypeRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
              />
              <!--Transmission Type -->
              <SelectItem
                id="transmissionTypeRequired"
                v-model="form.transmissionType"
                :label="t('autos.transmissionType')"
                :options="transmissionType"
                :placeholder="t('autos.selectTransmissionType')"
                :error="state.validationErrors.transmissionTypeRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
              />
            </div>

            <!-- Auto Condition , Fuel Type ,Group Type  -->
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              v-if="form.autoType"
            >
              <!-- Auto Condition -->
              <SelectItem
                id="autoConditionRequired"
                v-model="form.autoCondition"
                :label="t('autos.autoCondition')"
                :options="autoConditions"
                :placeholder="t('autos.selectAutoCondition')"
                :error="state.validationErrors.autoConditionRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
              />

              <!--Fuel Type -->
              <SelectItem
                id="fuelTypeRequired"
                v-model="form.fuelType"
                :label="t('autos.fuelType')"
                :options="fuelTypes"
                :placeholder="t('autos.selectFuelType')"
                :error="state.validationErrors.fuelTypeRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
              />

              <!--Group Type -->
              <SelectItem
                id="groupTypeRequired"
                v-model="form.groupType"
                :label="t('autos.groupType')"
                :options="groupTypes"
                :placeholder="t('autos.selectGroupType')"
                :error="state.validationErrors.groupTypeRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
              />
            </div>

            <!-- desc -->
            <Description
              v-model="form.desc"
              :label="t('autos.description')"
              :readonly="state.isShowMode"
            />

            <!-- address -->
            <Description
              v-model="form.address"
              :label="t('autos.address')"
              :readonly="state.isShowMode"
            />
          </span>
          <!-- Map Picker - Only show when form data is loaded -->
          <div>
            <MapPicker
              :initial-position="safePosition"
              :initial-nearby="safeNearBy"
              @update:address="(val) => (form.position = val)"
              @update:nearBy="(val) => (form.nearBy = val)"
              :readonly="state.isShowMode"
            />
          </div>

          <FormActions
            :onCancel="cancel"
            :saveLabel="t('common.save')"
            :cancelLabel="t('common.cancel')"
            :loading="state.saving"
            :readonly="state.isShowMode"
          />
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped></style>
