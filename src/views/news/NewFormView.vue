<script setup lang="ts">
import { useNewForm } from "@composables/news/useNewForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";
import RichEditor from "@/components/common/RichEditor.vue";
import { ref } from "vue";
import { inject } from "vue";
import SelectItem from "@/components/common/SelectItem.vue";
import NameField from "@/components/common/NameField.vue";
import ImageUploader from "@/components/common/ImageUploader.vue";

const {
  t,
  state,
  save,
  form,
  newsTypes,
  newsCategories,
  loading,
  cancel,
  error,
} = useNewForm();
const countries: any = inject("countryList");
const uploadProgress = ref<number[]>([]);

useServerError(error);
</script>

<template>
  <div class="p-6">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("news.view")
          : state.isEditMode
          ? t("news.edit")
          : t("news.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
      <template #content>
        <span v-if="loading"><Loader /></span>
        <div v-else>
          <form @submit.prevent="save">
            <!-- Image  -->
            <ImageUploader
              v-model="form.imageFiles"
              :initialUrls="form.urlList"
              :isMultiple="true"
              @update:initialUrls="(val:any) => (form.urlList = val)"
            />
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Country -->
              <SelectItem
                id="countryId"
                v-model="form.countryCode"
                :label="t('buyers.country')"
                :options="countries"
                :placeholder="t('buyers.selectCountry')"
                :error="state.validationErrors.countryIdRequired"
                optionLabel="name"
                optionValue="countryCode"
                :showFlag="true"
                :readonly="state.isShowMode"
                :showClear="true"
              />

              <!-- New Type -->
              <SelectItem
                id="newsTypeId"
                v-model="form.type"
                :label="t('news.type')"
                :options="newsTypes"
                :placeholder="t('news.selectType')"
                :error="state.validationErrors.newsTypeIdRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
                :showClear="true"
              />

              <!-- New Category -->
              <SelectItem
                id="newsCategoryId"
                v-model="form.category"
                :label="t('news.category')"
                :options="newsCategories"
                :placeholder="t('news.selectCategory')"
                :error="state.validationErrors.newsCategoryIdRequired"
                optionLabel="name"
                optionValue="id"
                :showFlag="false"
                :readonly="state.isShowMode"
                :showClear="true"
              />
            </div>

            <!-- Title -->
            <NameField
              id="title"
              v-model="form.title"
              :label="t('news.name')"
              :error="state.validationErrors.titleRequired"
              :readonly="state.isShowMode"
            />

            <!-- Show progress bars -->
            <div v-if="uploadProgress.length" class="space-y-2 mb-4">
              <div
                v-for="(progress, i) in uploadProgress"
                :key="i"
                class="w-full bg-gray-200 rounded h-2 overflow-hidden"
              >
                <div
                  class="bg-blue-500 h-full transition-all duration-200"
                  :style="{ width: progress + '%' }"
                ></div>
              </div>
            </div>

            <!-- Body -->
            <RichEditor
              v-model="form.body"
              class="mb-4"
              @update:uploadProgress="(val) => (uploadProgress = val)"
            />

            <!-- Written By -->
            <NameField
              id="writtenBy"
              v-model="form.writtenBy"
              :label="t('news.writtenBy')"
              :error="state.validationErrors.writtenByRequired"
              :readonly="state.isShowMode"
            />

            <!-- External Link -->
            <NameField
              id="externalLink"
              v-model="form.externalLink"
              :label="t('news.externalLink')"
              :error="state.validationErrors.externalLinkRequired"
              :readonly="state.isShowMode"
            />

            <!--YouTube Link -->
            <NameField
              id="youtubeLink"
              v-model="form.videoLink"
              :label="t('news.youtubeLink')"
              :error="state.validationErrors.youtubeLinkRequired"
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
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* Optional: enhance list styling in dark mode */
.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}
.prose ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
}
</style>
