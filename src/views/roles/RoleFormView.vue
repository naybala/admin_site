<script setup lang="ts">
import { useRoleForm } from "@composables/roles/useRoleForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import Description from "@components/common/Description.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import GroupedPermissions from "@/components/common/GroupedPermissions.vue";
import { watch } from "vue";
import Loader from "@/components/common/Loader.vue";
import { handleFastLoading } from "@/utils/useFastLoading";

//  Use the refactored composable
const {
  t,
  state, // Contains isShowMode, isEditMode, saving, validationErrors
  roleForm,
  saveRole,
  cancel,
  loading,
  error,
  permissions,
} = useRoleForm();

watch(
  () => state.isEditMode,
  (newValue) => {
    console.log("Edit mode changed:", newValue);
  }
);
handleFastLoading(loading);
useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("roles.view")
          : state.isEditMode
          ? t("roles.edit")
          : t("roles.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading">
          <Loader />
        </span>

        <form @submit.prevent="saveRole" v-else>
          <!-- Name -->
          <NameField
            id="name"
            v-model="roleForm.name"
            :label="t('roles.name')"
            :error="state.validationErrors.name"
            :readonly="state.isShowMode"
          />

          <!-- Description -->
          <Description
            v-model="roleForm.description"
            :label="t('roles.description')"
            :readonly="state.isShowMode"
          />

          <!-- Permissions -->
          <GroupedPermissions
            v-if="Array.isArray(roleForm.permissions)"
            :permissions="permissions ?? {}"
            v-model="roleForm.permissions"
            :readonly="state.isShowMode"
          />

          <!-- Actions -->
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
