<script setup lang="ts">
import { onMounted } from "vue";
import Loader from "@/components/common/Loader.vue";
import FormActions from "@components/common/FormActions.vue";
import { useUserForm } from "../hooks/useUserForm";

const {
  t,
  isShowMode,
  form,
  countries,
  userTypes,
  rolesOptions,
  associationsOptions,
  validationErrors,
  handleSave,
  handleCancel,
  loading,
  saving,
  initialize,
} = useUserForm();

onMounted(() => {
  initialize();
});
</script>

<template>
  <form @submit.prevent="handleSave">
    <div v-if="loading">
      <Loader />
    </div>
    <div v-else>
      <!-- User form fields would go here -->
      <!-- This is a simplified version - you'll need to add all the form fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>{{ t("users.username") }}</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full p-2 border rounded"
            :readonly="isShowMode"
          />
          <span v-if="validationErrors.username" class="text-red-500">{{
            validationErrors.username
          }}</span>
        </div>

        <div>
          <label>{{ t("users.fullName") }}</label>
          <input
            v-model="form.fullName"
            type="text"
            class="w-full p-2 border rounded"
            :readonly="isShowMode"
          />
          <span v-if="validationErrors.fullName" class="text-red-500">{{
            validationErrors.fullName
          }}</span>
        </div>

        <div>
          <label>{{ t("users.email") }}</label>
          <input
            v-model="form.email"
            type="email"
            class="w-full p-2 border rounded"
            :readonly="isShowMode"
          />
        </div>

        <div>
          <label>{{ t("users.phoneNumber") }}</label>
          <div class="flex gap-2">
            <select
              v-model="form.phoneNumberPrefix"
              class="p-2 border rounded"
              :disabled="isShowMode"
            >
              <option
                v-for="country in countries"
                :key="country.code"
                :value="country.code"
              >
                {{ country.name }}
              </option>
            </select>
            <input
              v-model="form.phoneNumber"
              type="text"
              class="flex-1 p-2 border rounded"
              :readonly="isShowMode"
            />
          </div>
          <span v-if="validationErrors.phoneNumber" class="text-red-500">{{
            validationErrors.phoneNumber
          }}</span>
        </div>

        <div>
          <label>{{ t("users.userType") }}</label>
          <select
            v-model="form.userType"
            class="w-full p-2 border rounded"
            :disabled="isShowMode"
          >
            <option v-for="type in userTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <div>
          <label>{{ t("users.role") }}</label>
          <select
            v-model="form.roleId"
            class="w-full p-2 border rounded"
            :disabled="isShowMode"
          >
            <option
              v-for="role in rolesOptions"
              :key="role.id"
              :value="role.id"
            >
              {{ role.name }}
            </option>
          </select>
        </div>
      </div>

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
