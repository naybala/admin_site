<script setup lang="ts">
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import Loader from "@/components/common/Loader.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import Description from "@/components/common/Description.vue";
import SingleImageUploader from "@/components/common/SingleImageUploader.vue";
import { useAssociationForm } from "../hooks/useAssociationForm";

const {
  t,
  isShowMode,
  form,
  countries,
  shortNames,
  validationErrors,
  handleSave,
  handleCancel,
  loading,
  saving,
} = useAssociationForm();
</script>

<template>
  <form @submit.prevent="handleSave">
    <div v-if="loading">
      <Loader />
    </div>
    <div v-else>
      <!-- Image Upload -->
      <SingleImageUploader
        id="logo"
        v-model="form.imageFiles"
        :initialUrl="form.logo"
        @update:initialUrl="(val:any) => (form.logo = val)"
        :error="validationErrors.logo"
      />
      <br />
      <!-- Name -->
      <NameField
        id="name"
        v-model="form.name"
        :label="t('associations.name')"
        :error="validationErrors.name"
        :readonly="isShowMode"
      />

      <!-- Short Name -->
      <SelectItem
        id="shortName"
        v-model="form.shortName"
        :label="t('associations.shortName')"
        :options="shortNames"
        :placeholder="t('associations.selectShortName')"
        :error="validationErrors.shortName"
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
        :error="validationErrors.countryId"
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
        :onCancel="handleCancel"
        :saveLabel="t('common.save')"
        :cancelLabel="t('common.cancel')"
        :loading="saving"
        :readonly="isShowMode"
      />
    </div>
  </form>
</template>
