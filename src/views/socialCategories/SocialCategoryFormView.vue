<script setup lang="ts">
import { useSocialCategoryForm } from "@composables/socialCategories/useSocialCategoryForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import Description from "@components/common/Description.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import RadioBtn from "@/components/common/RadioBtn.vue";

const { t, state, form, save, types, loading, cancel, error } =
  useSocialCategoryForm();

useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("socialCategories.view")
          : state.isEditMode
          ? t("socialCategories.edit")
          : t("socialCategories.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <!-- Code -->
          <NameField
            id="codeRequired"
            v-model="form.code"
            :label="t('socialCategories.code')"
            :error="state.validationErrors.codeRequired"
            :readonly="state.isShowMode"
          />

          <!-- Name -->
          <NameField
            id="nameRequired"
            v-model="form.name"
            :label="t('socialCategories.name')"
            :error="state.validationErrors.codeRequired"
            :readonly="state.isShowMode"
          />

          <!-- Type -->
          <SelectItem
            id="type"
            v-model="form.type"
            :label="t('socialCategories.type')"
            :options="types"
            :placeholder="t('socialCategories.selectType')"
            :error="state.validationErrors.typeRequired"
            optionLabel="name"
            optionValue="id"
            :showFlag="false"
            :readonly="state.isShowMode"
            :showClear="true"
          />

          <!-- Description -->
          <Description
            v-model="form.description"
            :label="t('roles.description')"
            :readonly="state.isShowMode"
          />

          <!-- Status -->
          <RadioBtn v-model="form.status" :readonly="state.isShowMode" />

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
