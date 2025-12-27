<script setup lang="ts">
import { useOwnLicenseForm } from "@composables/ownLicenses/useOwnLicenseForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import Description from "@components/common/Description.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";
import SingleImageUploader from "@/components/common/SingleImageUploader.vue";
import { handleFastLoading } from "@/utils/useFastLoading";

const { t, state, form, save, loading, cancel, error } = useOwnLicenseForm();
handleFastLoading(loading);
useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("ownLicenses.view")
          : state.isEditMode
          ? t("ownLicenses.edit")
          : t("ownLicenses.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading || state.saving" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <!-- Image Upload -->
          <SingleImageUploader
            v-model="form.imageFiles"
            :initialUrl="form.logo"
            @update:initialUrl="(val:any) => (form.logo = val)"
            :error="state.validationErrors.logoRequired"
          />
          <br />
          <!-- Name -->
          <NameField
            id="nameRequired"
            v-model="form.name"
            :label="t('ownLicenses.name')"
            :error="state.validationErrors.nameRequired"
            :readonly="state.isShowMode"
          />

          <!--Short Code -->
          <NameField
            id="shortCodeRequired"
            v-model="form.shortCode"
            :label="t('ownLicenses.shortCode')"
            :error="state.validationErrors.shortCodeRequired"
            :readonly="state.isShowMode"
          />

          <!-- Description -->
          <Description
            v-model="form.description"
            :label="t('ownLicenses.description')"
            :readonly="state.isShowMode"
          />

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
