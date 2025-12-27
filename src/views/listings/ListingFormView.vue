<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useListingForm } from "@composables/listings/useListingForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import Description from "@components/common/Description.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import ImageUploader from "@/components/common/ImageUploader.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import Loader from "@/components/common/Loader.vue";
import MapPicker from "@/components/map/MapPicker.vue";
import AdditionalFeatures from "@/components/common/AdditionalFeatures.vue";
import ListingShowView from "./ListingShowView.vue";
import PrivatePublicToggle from "@/components/common/PrivatePublicToggle.vue";

const {
  t,
  isShowMode,
  isEditMode,
  form,
  countries,
  save,
  locations,
  districts,
  types,
  status,
  groupTypes,
  currencies,
  titleTypes,
  dimensions,
  validationErrors,
  cancel,
  loading,
  error,
  saving,
} = useListingForm();
useServerError(error);

const additionalOptions = ref<string[]>([]);
const selectedAdditionals = ref<string[]>([]);

const displayData = computed(() => ({
  ...form.value,
  urlList: form.value.urlList || [],
}));

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

watch(
  () => form.value.type,
  (newType) => {
    const selectedType = types.value.find((t: any) => t.name === newType);
    additionalOptions.value = selectedType?.additional || [];

    if (form.value.additional?.length) {
      selectedAdditionals.value = [...form.value.additional];
    } else {
      selectedAdditionals.value = [];
    }
  },
  { immediate: true }
);

watch(
  () => selectedAdditionals.value,
  (newVal) => {
    form.value.additional = newVal;
  },
  { immediate: true }
);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6 mx-0 lg:mx-20">
      {{
        isShowMode
          ? t("listings.view")
          : isEditMode
          ? t("listings.edit")
          : t("listings.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md mx-0 lg:mx-20">
      <template #content>
        <span v-if="loading" class="">
          <Loader />
        </span>

        <form v-else @submit.prevent="save">
          <span v-if="isShowMode">
            <ListingShowView v-if="form" :data="displayData" />
          </span>

          <span v-else>
            <!-- Show loading state for form data -->

            <div>
              <!-- Image Upload -->
              <ImageUploader
                v-model="form.imageFiles"
                :initialUrls="form.urlList"
                :isMultiple="true"
                @update:initialUrls="(val:any) => (form.urlList = val)"
              />
              <br />
              <div>
                <PrivatePublicToggle v-model="form.is_private" />
              </div>
              <br />

              <!-- Country -->
              <SelectItem
                id="phoneNumberPrefix"
                v-model="form.phoneNumberPrefix"
                :label="t('users.country')"
                :options="countries"
                :placeholder="t('users.selectCountry')"
                :error="validationErrors.phoneNumberPrefixRequired"
                optionLabel="name"
                optionValue="code"
                :showFlag="true"
                :readonly="isShowMode"
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
                :error="validationErrors.locationIdRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="isShowMode"
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
                :error="validationErrors.districtIdRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="isShowMode"
                :showClear="true"
              />

              <!-- Type -->
              <SelectItem
                v-if="form.districtId"
                id="type"
                v-model="form.type"
                :label="t('listings.type')"
                :options="types"
                :placeholder="t('listings.selectType')"
                :error="validationErrors.typeRequired"
                optionLabel="name"
                optionValue="name"
                :showFlag="false"
                :readonly="isShowMode"
                :showClear="true"
              />

              <!--  Additional Features (Checkboxes) -->
              <AdditionalFeatures
                v-model="form.additional"
                :type="form.type"
                :types="types"
              />

              <br />

              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <!-- Status -->
                <SelectItem
                  v-if="form.type"
                  id="status"
                  v-model="form.status"
                  :label="t('listings.status')"
                  :options="status"
                  :placeholder="t('listings.selectStatus')"
                  :error="validationErrors.propertyStatusRequired"
                  optionLabel=""
                  optionValue=""
                  :showFlag="false"
                  :readonly="isShowMode"
                  :showClear="true"
                />

                <!-- Group Type -->
                <SelectItem
                  v-if="form.type"
                  id="groupType"
                  v-model="form.groupType"
                  :label="t('listings.groupType')"
                  :options="groupTypes"
                  :placeholder="t('listings.selectGroupType')"
                  :error="validationErrors.groupTypeRequired"
                  optionLabel=""
                  optionValue=""
                  :showFlag="false"
                  :readonly="isShowMode"
                  :showClear="true"
                />
                <!-- Title Type -->
                <SelectItem
                  v-if="form.type"
                  id="titleType"
                  v-model="form.titleType"
                  :label="t('listings.titleType')"
                  :options="titleTypes"
                  :placeholder="t('listings.selectTitleType')"
                  :error="validationErrors.titleTypeRequired"
                  optionLabel=""
                  optionValue=""
                  :showFlag="false"
                  :readonly="isShowMode"
                  :showClear="true"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                <!-- old Price -->
                <NameField
                  v-if="form.type"
                  id="price"
                  v-model="form.price"
                  :label="t('listings.oldPrice')"
                  :error="validationErrors.priceRequired"
                  :readonly="isShowMode"
                  type="number"
                />
                <!-- New Price -->
                <NameField
                  v-if="form.type"
                  id="lastPrice"
                  v-model="form.lastPrice"
                  :label="t('listings.newPrice')"
                  :error="validationErrors.lastPriceRequired"
                  :readonly="isShowMode"
                  type="number"
                />
                <!-- Currency -->
                <SelectItem
                  v-if="form.type"
                  id="currencySymbol"
                  v-model="form.currencySymbol"
                  :label="t('listings.currency')"
                  :options="currencies"
                  :placeholder="t('listings.selectCurrency')"
                  :error="validationErrors.currencySymbolRequired"
                  optionLabel=""
                  optionValue=""
                  :showFlag="false"
                  :readonly="isShowMode"
                  :showClear="true"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <!-- Total Size -->
                <NameField
                  v-if="form.type"
                  v-model="form.size"
                  :label="t('listings.totalSize')"
                  :error="validationErrors.sizeRequired"
                  :readonly="isShowMode"
                  type="number"
                  id="size"
                />
                <!-- Dimension -->
                <SelectItem
                  v-if="form.type"
                  id="dimension"
                  v-model="form.dimension"
                  :label="t('listings.dimension')"
                  :options="dimensions"
                  :placeholder="t('listings.selectDimension')"
                  :error="validationErrors.dimensionRequired"
                  optionLabel=""
                  optionValue=""
                  :showFlag="false"
                  :readonly="isShowMode"
                  :showClear="true"
                />
              </div>

              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-2"
                v-if="
                  form.type == 'House' ||
                  form.type == 'queenVilla' ||
                  form.type == 'room' ||
                  form.type == 'shopHouse' ||
                  form.type == 'roomForRent' ||
                  form.type == 'twinVilla' ||
                  form.type == 'apartment'
                "
              >
                <!-- Number Of Bed -->
                <NameField
                  id="numBed"
                  v-if="form.type"
                  v-model="form.numBed"
                  :label="t('listings.numberOfBed')"
                  :error="validationErrors.numberOfBed"
                  :readonly="isShowMode"
                  type="number"
                />
                <!-- Number Of Bedroom -->
                <NameField
                  id="numBathroom"
                  v-if="form.type"
                  v-model="form.numBathroom"
                  :label="t('listings.numberOfBedroom')"
                  :error="validationErrors.numberOfBedroom"
                  :readonly="isShowMode"
                  type="number"
                />
              </div>

              <!-- You Tube Link -->
              <NameField
                id="linkYoutube"
                v-if="form.type"
                v-model="form.linkYoutube"
                :label="t('listings.youTubeLink')"
                :error="validationErrors.youTubeLink"
                :readonly="isShowMode"
              />
              <!-- Description -->
              <Description
                v-if="form.type"
                v-model="form.desc"
                :label="t('roles.description')"
                :readonly="isShowMode"
              />
            </div>
          </span>

          <br />

          <!-- Map Picker - Only show when form data is loaded -->
          <div>
            <MapPicker
              :initial-position="safePosition"
              :initial-nearby="safeNearBy"
              @update:address="(val) => (form.position = val)"
              @update:nearBy="(val) => (form.nearBy = val)"
              :readonly="isShowMode"
            />
          </div>

          <br />

          <!-- Action Save And Cancel -->
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

<style scoped></style>
