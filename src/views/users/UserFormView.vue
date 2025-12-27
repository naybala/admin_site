<script setup lang="ts">
import { useUserForm } from "@composables/users/useUserForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import SelectItem from "@components/common/SelectItem.vue";
import Loader from "@/components/common/Loader.vue";

import CombineInput from "@/components/common/CombineInput.vue";
import { handleFastLoading } from "@/utils/useFastLoading";
import { ref, watch } from "vue";

const {
  t,
  isShowMode,
  isEditMode,
  form,
  save,
  validationErrors,
  cancel,
  error,
  loading,
  saving,
  countries,
  roles,
  userTypes,
  getAgentRole,
  currentUserType,
} = useUserForm();
const isReadOnly = ref<any>(false);
const isReadOnlyRole = ref<any>(false);

watch(
  () => currentUserType.value,
  (newValue: any) => {
    // isReadOnly.value = newValue !== "Developer";
    isReadOnly.value = true;
    isReadOnlyRole.value = newValue !== "Developer";

    if (!isEditMode.value && !isShowMode.value) {
      form.value.userType = newValue === "Developer" ? "Member" : "Member";
    }
    if (currentUserType.value == "Association" && !isEditMode.value) {
      form.value.roleId = getAgentRole.value.id;
    }
    if (currentUserType.value == "Agency" && !isEditMode.value) {
      form.value.roleId = getAgentRole.value.id;
    }
  },
  { immediate: true }
);

handleFastLoading(loading);
useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        isShowMode
          ? t("users.view")
          : isEditMode
          ? t("users.edit")
          : t("users.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <!-- Name -->
          <NameField
            id="usernameRequired"
            :modelValue="form.username ?? ''"
            @update:modelValue="form.username = $event"
            :label="t('users.name')"
            :error="validationErrors.usernameRequired"
            :readonly="isShowMode"
          />

          <!-- Country -->
          <SelectItem
            id="phoneNumberPrefixRequired"
            v-model="form.phoneNumberPrefix"
            :label="t('users.country')"
            :options="countries"
            :placeholder="t('users.selectCountry')"
            :error="validationErrors.phoneNumberPrefixRequired"
            optionLabel="code"
            optionValue="code"
            :showFlag="true"
            :readonly="isShowMode"
          />

          <!-- Role -->
          <SelectItem
            id="roleIdRequired"
            v-model="form.roleId"
            :label="t('users.role')"
            :options="roles"
            :placeholder="t('users.selectRole')"
            :error="validationErrors.roleIdRequired"
            optionLabel="name"
            optionValue="id"
            :showFlag="false"
            :readonly="isReadOnlyRole"
          />

          <!-- User Type -->
          <SelectItem
            id="userTypeRequired"
            v-model="form.userType"
            :label="t('users.userType')"
            :options="userTypes"
            :placeholder="t('users.selectUserType')"
            :error="validationErrors.userTypeRequired"
            :readonly="isReadOnly"
            :showClear="true"
            optionLabel="name"
            optionValue="id"
          />

          <!-- Email -->
          <NameField
            id="emailRequired"
            :modelValue="form.email ?? ''"
            @update:modelValue="form.email = $event"
            :label="t('users.email')"
            :error="validationErrors.emailRequired"
            :readonly="isShowMode"
          />

          <!-- Phone Number -->
          <CombineInput
            id="phoneNumberRequired"
            v-model="form.phoneNumber"
            :preModelValue="form.phoneNumberPrefix"
            :modelValueTwo="form.phoneNumber"
            :label="t('users.phoneNumber')"
            :error="validationErrors.phoneNumberRequired"
            type="text"
            :readonly="isShowMode"
          />

          <!-- Facebook -->
          <NameField
            id="facebookRequired"
            :modelValue="form.facebook ?? ''"
            @update:modelValue="form.facebook = $event"
            :label="t('users.facebook')"
            :error="validationErrors.facebookRequired"
            :readonly="isShowMode"
          />

          <!-- telegram -->
          <NameField
            id="telegramRequired"
            :modelValue="form.telegram ?? ''"
            @update:modelValue="form.telegram = $event"
            :label="t('users.telegram')"
            :error="validationErrors.telegramRequired"
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
