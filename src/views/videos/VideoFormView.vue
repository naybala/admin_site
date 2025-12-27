<script setup lang="ts">
import { useVideoForm } from "@composables/videos/useVideoForm";
import Toast from "primevue/toast";
import Card from "primevue/card";
import NameField from "@components/common/NameField.vue";
import FormActions from "@components/common/FormActions.vue";
import { useServerError } from "@/composables/common/useServerError";
import Loader from "@/components/common/Loader.vue";
import SelectItem from "@/components/common/SelectItem.vue";
import SingleImageUploader from "@/components/common/SingleImageUploader.vue";
import VideoUploader from "@/components/common/VideoUploader.vue";
import { computed, ref } from "vue";
import RadioBtn from "@/components/common/RadioBtn.vue";
import SeriesOrMovie from "@/components/common/SeriesOrMovie.vue";
import Draggable from "vuedraggable";

const { t, state, form, save, categories, loading, cancel, error } =
  useVideoForm();
const progress = ref<any>(0);
const isUploading = computed(() => progress.value > 0 && progress.value < 100);

useServerError(error);
</script>
<template>
  <div class="p-6 relative">
    <Toast />
    <h1 class="text-3xl font-bold mb-6">
      {{
        state.isShowMode
          ? t("videos.view")
          : state.isEditMode
          ? t("videos.edit")
          : t("videos.add")
      }}
    </h1>

    <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md relative">
      <template #content>
        <span v-if="loading || state.saving" class="">
          <Loader />
        </span>

        <form
          @submit.prevent="save"
          v-else
          :class="{ 'blur-sm pointer-events-none select-none': isUploading }"
        >
          <!-- Image -->
          <div class="flex justify-center">
            <SingleImageUploader
              v-model="form.imageFile"
              :initialUrl="form.coverImage"
              @update:initialUrl="(val: any) => (form.coverImage = val)"
              shape="rectangle"
              width="w-24 md:w-32"
              height="h-24 md:h-32"
              :crop-aspect-ratio="1"
              :editable="false"
              :error="state.validationErrors.profilePhotoRequired"
            />
          </div>
          <!-- Description -->
          <NameField
            id="description"
            v-model="form.description"
            :label="t('videos.description')"
            :error="state.validationErrors.descriptionRequired"
            :readonly="state.isShowMode"
          />
          <!-- Category -->
          <SelectItem
            id="category"
            v-model="form.category"
            :label="t('videos.category')"
            :options="categories"
            :placeholder="t('videos.selectCategory')"
            :error="state.validationErrors.categoryRequired"
            optionLabel="name"
            optionValue="id"
            :showFlag="false"
            :readonly="state.isShowMode"
            :showClear="true"
          />

          <br />
          <!-- Series or Movie -->
          <SeriesOrMovie v-model="form.isSeries" :readonly="state.isShowMode" />

          <!-- video -->
          <div v-if="!form.isSeries" class="flex justify-center my-5">
            <VideoUploader
              v-model="form.videoLink"
              @update:uploadProgress="progress = $event"
              :maxSizeMB="5120"
              path="videos/mainVideo"
              name="Movie"
            />
          </div>

          <!-- Series -->
          <Draggable
            v-if="form.isSeries"
            v-model="form.videoLinkSeries"
            item-key="__key"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-5"
            handle=".drag-handle"
            ghost-class="drag-ghost"
            animation="200"
          >
            <template #item="{ index }">
              <div
                class="border rounded-md p-4 relative cursor-move hover:translate-y-[-10px] transition-all duration-300 bg-white dark:bg-gray-800"
              >
                <!-- Drag handle -->
                <div
                  class="drag-handle absolute top-2 left-2 text-gray-400 cursor-grab"
                  title="Drag to reorder"
                >
                  ☰
                </div>

                <h4 class="font-semibold mb-2 pl-5">Episode {{ index + 1 }}</h4>

                <VideoUploader
                  v-model="form.videoLinkSeries[index]"
                  @update:uploadProgress="progress = $event"
                  :maxSizeMB="5120"
                  path="videos/series"
                  :name="`Episode ${index + 1}`"
                />

                <!-- Remove -->
                <button
                  v-if="form.videoLinkSeries.length > 1"
                  type="button"
                  class="absolute top-2 right-2 text-red-500 text-sm"
                  @click="form.videoLinkSeries.splice(index, 1)"
                >
                  ✕
                </button>
              </div>
            </template>
          </Draggable>

          <!-- Add Episode -->
          <div class="flex justify-center" v-if="form.isSeries">
            <button
              type="button"
              class="px-4 py-2 bg-blue-600 text-white rounded"
              @click="form?.videoLinkSeries.push('')"
            >
              + Add Episode
            </button>
          </div>

          <!-- Status -->
          <RadioBtn v-model="form.status" :readonly="state.isShowMode" />

          <FormActions
            v-if="progress == 100 || state.isEditMode"
            :onCancel="cancel"
            :saveLabel="t('common.save')"
            :cancelLabel="t('common.cancel')"
            :loading="state.saving"
            :readonly="state.isShowMode"
          />
        </form>

        <!-- Overlay when uploading -->
        <div
          v-if="isUploading"
          class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 pointer-events-auto"
        >
          <div class="relative flex flex-col items-center">
            <div
              class="absolute top-10 text-white font-semibold text-sm text-center"
            >
              <span class="loader"></span>
              {{ progress }}%
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* Optional: add blur when disabled */
.blur-sm {
  filter: blur(2px);
  user-select: none;
  pointer-events: none;
}

.loader {
  width: 175px;
  height: 80px;
  display: block;
  margin: auto;
  background-image: radial-gradient(
      circle 25px at 25px 25px,
      #fff 100%,
      transparent 0
    ),
    radial-gradient(circle 50px at 50px 50px, #fff 100%, transparent 0),
    radial-gradient(circle 25px at 25px 25px, #fff 100%, transparent 0),
    linear-gradient(#fff 50px, transparent 0);
  background-size: 50px 50px, 100px 76px, 50px 50px, 120px 40px;
  background-position: 0px 30px, 37px 0px, 122px 30px, 25px 40px;
  background-repeat: no-repeat;
  position: relative;
  box-sizing: border-box;
}
.loader::after {
  content: "";
  left: 50%;
  bottom: 30px;
  transform: translate(-50%, 0);
  position: absolute;
  border: 15px solid transparent;
  border-bottom-color: #ff3d00;
  box-sizing: border-box;
  animation: fadePull 1s linear infinite;
}
.loader::before {
  content: "";
  left: 50%;
  bottom: 15px;
  transform: translate(-50%, 0);
  position: absolute;
  width: 15px;
  height: 15px;
  background: #ff3d00;
  box-sizing: border-box;
  animation: fadePull 1s linear infinite;
}

@keyframes fadePull {
  0% {
    transform: translate(-50%, 15px);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, 0px);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -15px);
    opacity: 0;
  }
}
</style>
