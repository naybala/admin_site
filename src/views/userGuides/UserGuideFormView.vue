<script setup lang="ts">
import { useUserGuideForm } from "@composables/userGuides/useUserGuideForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";

const { t, state, form, save, loading, cancel, error } = useUserGuideForm();

useServerError(error);
const getYoutubeEmbedUrl = (url: any) => {
  const videoId = url.split("v=")[1]?.split("&")[0];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
};
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("userGuides.view")
          : state.isEditMode
          ? t("userGuides.edit")
          : t("userGuides.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading" class="">
          <Loader />
        </span>
        <form @submit.prevent="save" v-else>
          <NameField
            id="titleRequired"
            v-model="form.title"
            :label="t('userGuides.name')"
            :error="state.validationErrors.titleRequired"
            :readonly="state.isShowMode"
          />
          <NameField
            id="youtube_linkRequired"
            v-model="form.youtube_link"
            :label="t('userGuides.youtube_link')"
            :error="state.validationErrors.youtube_linkRequired"
            :readonly="state.isShowMode"
          />

          <div v-if="state.isShowMode" class="mt-4 shadow-lg rounded-lg p-5">
            <h3 class="font-semibold text-lg mb-2">Preview Video</h3>
            <div class="aspect-w-16 aspect-h-9">
              <iframe
                :src="getYoutubeEmbedUrl(form.youtube_link)"
                frameborder="0"
                allowfullscreen
                class="w-full h-80 rounded"
              ></iframe>
            </div>
          </div>

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
