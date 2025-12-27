<script setup lang="ts">
import { useLiveStreamingForm } from "@composables/liveStreamings/useLiveStreamingForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";

const { t, state, form, save, loading, cancel, error } = useLiveStreamingForm();

useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("liveStreamings.view")
          : state.isEditMode
          ? t("liveStreamings.edit")
          : t("liveStreamings.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <NameField
            id="channelNameRequired"
            v-model="form.channelName"
            :label="t('liveStreamings.channelName')"
            :error="state.validationErrors.channelNameRequired"
            :readonly="state.isShowMode"
          />
          <NameField
            id="liveLinkRequired"
            v-model="form.liveLink"
            :label="t('liveStreamings.liveLink')"
            :error="state.validationErrors.liveLinkRequired"
            :readonly="state.isShowMode"
          />

          <a
            class="p-button p-button-success"
            :href="form.liveLink"
            target="_blank"
          >
            {{ t("liveStreamings.liveLink") }}
          </a>

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
