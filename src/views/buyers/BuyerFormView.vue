<script setup lang="ts">
import { useBuyerForm } from "@composables/buyers/useBuyerForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import RadioBtn from "@/components/common/RadioBtn.vue";
import Description from "@/components/common/Description.vue";

const {
  t,
  state,
  form,
  save,
  propertyType,
  propertyGroupType,
  countries,
  locations,
  districts,
  loading,
  cancel,
  error,
} = useBuyerForm();

useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("buyers.view")
          : state.isEditMode
          ? t("buyers.edit")
          : t("buyers.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <NameField
            id="contactNumberRequired"
            v-model="form.contactNumber"
            :label="t('buyers.contactNumber')"
            :error="state.validationErrors.contactNumberRequired"
            :readonly="state.isShowMode"
          />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <!-- Min Price -->
            <NameField
              id="minPrice"
              v-model="form.minPrice"
              :label="t('buyers.minPrice')"
              :error="state.validationErrors.minPriceRequired"
              :readonly="state.isShowMode"
            />
            <!-- Max Price -->
            <NameField
              id="maxPrice"
              v-model="form.maxPrice"
              :label="t('buyers.maxPrice')"
              :error="state.validationErrors.maxPriceRequired"
              :readonly="state.isShowMode"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <!-- Property Type-->
            <SelectItem
              id="type"
              v-model="form.type"
              :label="t('buyers.type')"
              :options="propertyType"
              :placeholder="t('buyers.selectType')"
              :error="state.validationErrors.typeRequired"
              optionLabel="name"
              optionValue="id"
              :showFlag="false"
              :readonly="state.isShowMode"
              :showClear="true"
            />
            <!-- Group Type-->
            <SelectItem
              id="groupType"
              v-model="form.groupType"
              :label="t('buyers.groupType')"
              :options="propertyGroupType"
              :placeholder="t('buyers.selectGroupType')"
              :error="state.validationErrors.groupTypeRequired"
              optionLabel="name"
              optionValue="id"
              :showFlag="false"
              :readonly="state.isShowMode"
              :showClear="true"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <!-- Country -->
            <SelectItem
              id="countryId"
              v-model="form.countryId"
              :label="t('buyers.country')"
              :options="countries"
              :placeholder="t('buyers.selectCountry')"
              :error="state.validationErrors.countryIdRequired"
              optionLabel="name"
              optionValue="countryCode"
              :showFlag="true"
              :readonly="state.isShowMode"
              :showClear="true"
            />

            <!-- Location -->
            <SelectItem
              v-if="form.countryId"
              id="locationId"
              v-model="form.locationId"
              :label="t('buyers.location')"
              :options="locations"
              :placeholder="t('buyers.selectLocation')"
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
              :label="t('buyers.district')"
              :options="districts"
              :placeholder="t('buyers.selectDistrict')"
              :error="state.validationErrors.districtIdRequired"
              optionLabel="name"
              optionValue="id"
              :showFlag="false"
              :readonly="state.isShowMode"
              :showClear="true"
            />
          </div>

          <!-- Description -->
          <Description
            v-model="form.description"
            :label="t('buyers.description')"
            :readonly="state.isShowMode"
          />
          <br />

          <RadioBtn v-model="form.status" :readonly="state.isShowMode" />

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
