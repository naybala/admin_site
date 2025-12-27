<script setup lang="ts">
import { useAgentForm } from "@composables/agents/useAgentForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import CombineInput from "@/components/common/CombineInput.vue";

const {
  t,
  state,
  form,
  save,
  roles,
  userTypes,
  countries,
  loading,
  cancel,
  error,
} = useAgentForm();

useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("agents.view")
          : state.isEditMode
          ? t("agents.edit")
          : t("agents.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <!-- Image Upload -->
          <!-- <div class="flex justify-center">
            <SingleImageUploader
              v-model="form.imageFiles"
              :initialUrl="form.logo"
              @update:initialUrl="(val:any) => (form.logo = val)"
              :error="validationErrors.logoRequired"
            />
          </div> -->
          <br />
          <!-- Name -->
          <NameField
            id="username"
            :modelValue="form.username ?? ''"
            @update:modelValue="form.username = $event"
            :label="t('users.name')"
            :error="state.validationErrors.usernameRequired"
            :readonly="state.isShowMode"
          />

          <!-- Country -->
          <SelectItem
            id="phoneNumberPrefix"
            v-model="form.phoneNumberPrefix"
            :label="t('users.country')"
            :options="countries"
            :placeholder="t('users.selectCountry')"
            :error="state.validationErrors.phoneNumberPrefixRequired"
            optionLabel="code"
            optionValue="code"
            :showFlag="true"
            :readonly="state.isShowMode"
          />

          <!-- Email -->
          <NameField
            id="email"
            :modelValue="form.email ?? ''"
            @update:modelValue="form.email = $event"
            :label="t('users.email')"
            :error="state.validationErrors.emailRequired"
            :readonly="state.isShowMode"
          />

          <!-- Role -->
          <SelectItem
            id="roleId"
            v-model="form.roleId"
            :label="t('users.role')"
            :options="roles"
            :placeholder="t('users.selectRole')"
            :error="state.validationErrors.roleIdRequired"
            optionLabel="name"
            optionValue="id"
            :showFlag="false"
            :readonly="state.isShowMode"
          />

          <!-- User Type -->
          <SelectItem
            id="userType"
            v-model="form.userType"
            :label="t('users.userType')"
            :options="userTypes"
            :placeholder="t('users.selectUserType')"
            :error="state.validationErrors.userTypeRequired"
            :readonly="true"
            optionLabel="name"
            optionValue="id"
          />

          <!-- Phone Number -->
          <CombineInput
            id="phoneNumber"
            v-model="form.phoneNumber"
            :preModelValue="form.phoneNumberPrefix"
            :modelValueTwo="form.phoneNumber"
            :label="t('users.phoneNumber')"
            :error="state.validationErrors.phoneNumberRequired"
            type="text"
            :readonly="state.isShowMode"
          />

          <!-- Facebook -->
          <NameField
            id="facebook"
            :modelValue="form.facebook ?? ''"
            @update:modelValue="form.facebook = $event"
            :label="t('users.facebook')"
            :error="state.validationErrors.facebookRequired"
            :readonly="state.isShowMode"
          />

          <!-- telegram -->
          <NameField
            id="telegram"
            :modelValue="form.telegram ?? ''"
            @update:modelValue="form.telegram = $event"
            :label="t('users.telegram')"
            :error="state.validationErrors.telegramRequired"
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
