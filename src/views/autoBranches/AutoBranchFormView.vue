<script setup lang="ts">
import { useAutoBranchForm } from "@composables/autoBranches/useAutoBranchForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import RadioBtn from "@/components/common/RadioBtn.vue";
import Description from "@/components/common/Description.vue";
import { handleFastLoading } from "@/utils/useFastLoading";

const { t, state, form, save, autoTypes, loading, cancel, error } =
  useAutoBranchForm();
handleFastLoading(loading);
useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("autoBranches.view")
          : state.isEditMode
          ? t("autoBranches.edit")
          : t("autoBranches.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <NameField
            id="name"
            :modelValue="form.name ?? ''"
            @update:modelValue="form.name = $event"
            :label="t('autoBranches.name')"
            :error="state.validationErrors.nameRequired"
            :readonly="state.isShowMode"
          />

          <!-- Auto Type -->
          <SelectItem
            id="autoType"
            v-model="form.autoType"
            :label="t('autoBranches.autoType')"
            :options="autoTypes"
            :placeholder="t('autoBranches.selectAutoType')"
            :error="state.validationErrors.autoTypeRequired"
            optionLabel="name"
            optionValue="id"
            :showFlag="false"
            :readonly="state.isShowMode"
            :showClear="true"
          />

          <!-- Description -->
          <Description
            v-model="form.desc"
            :label="t('autoBranches.desc')"
            :readonly="state.isShowMode"
          />

          <!-- Status -->
          <RadioBtn v-model="form.status" :readonly="state.isShowMode" />

          <!-- Action -->
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
