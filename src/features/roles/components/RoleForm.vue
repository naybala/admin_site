<script setup lang="ts">
import NameField from "@components/common/NameField.vue";
import Description from "@components/common/Description.vue";
import FormActions from "@components/common/FormActions.vue";
import Loader from "@/components/common/Loader.vue";
import GroupedPermissions from "@/components/common/GroupedPermissions.vue";
import { useRoleForm } from "../hooks/useRoleForm";

const {
  t,
  isShowMode,
  form,
  permissions,
  validationErrors,
  handleSave,
  handleCancel,
  loading,
  saving,
} = useRoleForm();
</script>

<template>
  <form @submit.prevent="handleSave">
    <div v-if="loading">
      <Loader />
    </div>
    <div v-else>
      <!-- Name -->
      <NameField
        id="name"
        v-model="form.name"
        :label="t('roles.name')"
        :error="validationErrors.name"
        :readonly="isShowMode"
      />

      <!-- Description -->
      <Description
        v-model="form.description"
        :label="t('roles.description')"
        :readonly="isShowMode"
      />

      <!-- Permissions -->
      <GroupedPermissions
        v-if="Array.isArray(form.permissions)"
        :permissions="permissions ?? {}"
        v-model="form.permissions"
        :readonly="isShowMode"
      />

      <!-- Actions -->
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
