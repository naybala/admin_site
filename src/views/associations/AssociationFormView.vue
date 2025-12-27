<script setup lang="ts">
import { useAssociationForm } from "@composables/associations/useAssociationForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import Description from "@/components/common/Description.vue";
import SingleImageUploader from "@/components/common/SingleImageUploader.vue";
import { handleFastLoading } from "@/utils/useFastLoading";

const {
  t,
  isShowMode,
  isEditMode,
  form,
  save,
  countries,
  shortNames,
  loading,
  validationErrors,
  cancel,
  error,
  saving,
} = useAssociationForm();
handleFastLoading(loading);
useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        isShowMode
          ? t("associations.view")
          : isEditMode
          ? t("associations.edit")
          : t("associations.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading || saving" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <!-- Image Upload -->
          <SingleImageUploader
            v-model="form.imageFiles"
            :initialUrl="form.logo"
            @update:initialUrl="(val:any) => (form.logo = val)"
            :error="validationErrors.logoRequired"
          />
          <br />
          <!-- Name -->
          <NameField
            id="name"
            v-model="form.name"
            :label="t('associations.name')"
            :error="validationErrors.nameRequired"
            :readonly="isShowMode"
          />

          <!-- Short Name -->
          <SelectItem
            id="shortName"
            v-model="form.shortName"
            :label="t('associations.shortName')"
            :options="shortNames"
            :placeholder="t('associations.selectShortName')"
            :error="validationErrors.shortNameRequired"
            :showFlag="false"
            :readonly="isShowMode"
            :showClear="true"
            :isInsertable="true"
          />

          <!-- Country -->
          <SelectItem
            id="countryId"
            v-model="form.countryId"
            :label="t('associations.country')"
            :options="countries"
            :placeholder="t('associations.selectCountry')"
            :error="validationErrors.countryIdRequired"
            optionLabel="name"
            optionValue="code"
            :showFlag="true"
            :readonly="isShowMode"
            :showClear="true"
          />

          <!-- Description -->
          <Description
            v-model="form.description"
            :label="t('roles.description')"
            :readonly="isShowMode"
          />

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
