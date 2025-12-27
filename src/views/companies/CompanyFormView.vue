<script setup lang="ts">
import { useCompanyForm } from "@composables/companies/useCompanyForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import Description from "@/components/common/Description.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";
import { handleFastLoading } from "@/utils/useFastLoading";
import SelectItem from "@/components/common/SelectItem.vue";
import MultipleSelect from "@/components/common/MultipleSelect.vue";
import SingleImageUploader from "@/components/common/SingleImageUploader.vue";

const {
  t,
  state,
  form,
  save,
  countries,
  locations,
  associations,
  types,
  loading,
  cancel,
  error,
} = useCompanyForm();
handleFastLoading(loading);
useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("companies.view")
          : state.isEditMode
          ? t("companies.edit")
          : t("companies.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <!-- Image Upload -->
          <div class="flex justify-center">
            <SingleImageUploader
              id="imageFiles"
              v-model="form.imageFiles"
              :initialUrl="form.logo"
              @update:initialUrl="(val:any) => 
              (form.logo = val)"
              :error="state.validationErrors.imageFilesRequired"
            />
          </div>
          <br />

          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <!-- Name -->
            <NameField
              id="companyName"
              :modelValue="form.name ?? ''"
              @update:modelValue="form.name = $event"
              :label="t('companies.companyName')"
              :error="state.validationErrors.companyNameRequired"
              :readonly="state.isShowMode"
            />

            <!-- Email -->
            <NameField
              id="email"
              :modelValue="form.email ?? ''"
              @update:modelValue="form.email = $event"
              :label="t('companies.email')"
              :error="state.validationErrors.emailRequired"
              :readonly="state.isShowMode"
            />

            <!-- Phone Number -->
            <NameField
              id="phoneNumber"
              :modelValue="form.phoneNumber ?? ''"
              @update:modelValue="form.phoneNumber = $event"
              :label="t('companies.phoneNumber')"
              :error="state.validationErrors.phoneNumberRequired"
              :readonly="state.isShowMode"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <!-- Country -->
            <SelectItem
              id="countryId"
              v-model="form.countryId"
              :label="t('users.country')"
              :options="countries"
              :placeholder="t('users.selectCountry')"
              :error="state.validationErrors.countryIdRequired"
              optionLabel="name"
              optionValue="code"
              :showFlag="true"
              :readonly="state.isShowMode"
              :showClear="true"
            />

            <!-- Location -->
            <SelectItem
              v-if="form.countryId"
              id="locationId"
              v-model="form.locationId"
              :label="t('companies.location')"
              :options="locations"
              :placeholder="t('companies.selectLocation')"
              :error="state.validationErrors.locationIdRequired"
              optionLabel="name"
              optionValue="id"
              :showFlag="false"
              :readonly="state.isShowMode"
              :showClear="true"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <!-- Association -->
            <SelectItem
              id="associationId"
              v-model="form.associationId"
              :label="t('companies.association')"
              :options="associations"
              :placeholder="t('companies.selectAssociation')"
              :error="state.validationErrors.associationIdRequired"
              optionLabel="name"
              optionValue="id"
              :showFlag="false"
              :readonly="state.isShowMode"
              :showClear="true"
            />

            <!-- Association Member Code-->
            <div class="ms-2">
              <NameField
                id="associationMemberCode"
                :modelValue="form.associationMemberCode ?? ''"
                @update:modelValue="form.associationMemberCode = $event"
                :label="t('companies.associationMemberCode')"
                :error="state.validationErrors.associationMemberCodeRequired"
                :readonly="state.isShowMode"
              />
            </div>
          </div>

          <!-- Company Type -->
          <MultipleSelect
            id="type"
            v-model="form.type"
            :label="t('companies.companyType')"
            :options="types"
            :placeholder="t('companies.selectCompanyType')"
            :error="state.validationErrors.typeRequired"
            optionLabel="name"
            optionValue="typeId"
            :readonly="state.isShowMode"
          />

          <!-- Facebook -->
          <NameField
            id="facebook"
            :modelValue="form.facebook ?? ''"
            @update:modelValue="form.facebook = $event"
            :label="t('companies.facebook')"
            :error="state.validationErrors.facebook"
            :readonly="state.isShowMode"
          />
          <!-- Telegram -->
          <NameField
            id="telegram"
            :modelValue="form.telegram ?? ''"
            @update:modelValue="form.telegram = $event"
            :label="t('companies.telegram')"
            :error="state.validationErrors.telegram"
            :readonly="state.isShowMode"
          />

          <!-- Address -->
          <Description
            v-model="form.address"
            :label="t('companies.address')"
            :readonly="state.isShowMode"
          />

          <!-- Description -->
          <Description
            v-model="form.description"
            :label="t('roles.description')"
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
