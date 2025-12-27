<template>
  <div>
    <!-- Cropping Modal -->
    <Dialog
      v-model:visible="showCropModal"
      modal
      header="Crop Image"
      :style="{ width: '90vw', maxWidth: '600px' }"
    >
      <div class="flex flex-col items-center">
        <VuePictureCropper
          v-if="cropImageUrl"
          :img="cropImageUrl"
          :options="cropperOptions"
          class="cropper-container"
        />

        <div class="flex gap-2 mt-4">
          <Button label="Cancel" @click="cancelCrop" text />
          <Button label="Apply Crop" @click="applyCrop" severity="success" />
        </div>
      </div>
    </Dialog>

    <!-- Existing image display -->
    <div
      v-if="previewUrl"
      class="relative"
      :class="[containerWidth, containerHeight, shapeClass, 'border overflow-hidden']"
    >
      <Image :src="previewUrl" alt="Image" :class="imageClass" preview />

      <!-- Action Buttons -->
      <div class="absolute top-1 right-1 flex gap-1">
        <!-- <button
          v-if="editable"
          @click.prevent="removeFile"
          class="bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded"
          title="Remove"
        >
          ✕
        </button>
        <button
          v-if="editable && previewUrl"
          @click.prevent="openCrop"
          class="bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded"
          title="Crop"
        >
          ⚙️
        </button> -->
      </div>

      <input
        type="file"
        :multiple="false"
        accept="image/*"
        ref="fileInput"
        @change="onSelectFile"
        class="hidden"
      />
      <button
        class="absolute bottom-1 right-8 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded"
        @click.prevent="triggerFileInput"
        title="Upload new image"
      >
        Upload
      </button>
    </div>

    <!-- Upload button when no image -->
    <div v-else>
      <input
        type="file"
        :multiple="false"
        accept="image/*"
        ref="fileInput"
        @change="onSelectFile"
        class="hidden"
      />
      <button
        class="bg-blue-600 text-white text-sm px-4 py-2 rounded"
        @click.prevent="triggerFileInput"
      >
        Upload Image
      </button>
    </div>

    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { Image, Dialog, Button } from "primevue";
import { ref, watch, computed, reactive } from "vue";
import VuePictureCropper, { cropper } from "vue-picture-cropper";

const props = defineProps<{
  modelValue: File | undefined;
  initialUrl?: string;
  error?: string;
  shape?: "square" | "rectangle" | "cover" | "rounded";
  editable?: boolean;
  width?: string;
  height?: string;
  cropAspectRatio?: number;
}>();

const emit = defineEmits(["update:modelValue", "update:initialUrl"]);

// Cropping state
const showCropModal = ref(false);
const cropImageUrl = ref<string | null>(null);

// Image state
const file = ref<File | undefined>(props.modelValue);
const existingUrl = ref<string | undefined>(props.initialUrl);
const previewUrl = ref<string | undefined>();
const fileInput = ref<HTMLInputElement | null>(null);

// Aspect ratios
const defaultCropAspectRatio = computed(() => {
  switch (props.shape) {
    case "square":
      return 1;
    case "rounded":
      return 1;
    case "cover":
      return 2;
    default:
      return 4 / 3;
  }
});

const currentCropAspectRatio = computed(
  () => props.cropAspectRatio || defaultCropAspectRatio.value
);

// Cropper options
const cropperOptions = reactive({
  viewMode: 1,
  dragMode: "move",
  initialAspectRatio: currentCropAspectRatio.value,
  aspectRatio: currentCropAspectRatio.value,
  background: false,
  autoCrop: true,
  movable: true,
  rotatable: true,
  scalable: true,
  zoomable: true,
  cropBoxMovable: true,
  cropBoxResizable: true,
  toggleDragModeOnDblclick: true,
  ready: () => {
    console.log("Cropper ready");
  },
});

// Crop handlers
const openCrop = () => {
  cropImageUrl.value = previewUrl.value || null;
  showCropModal.value = true;
};

const cancelCrop = () => {
  showCropModal.value = false;
  cropImageUrl.value = null;
};

const applyCrop = async () => {
  try {
    // Fixed size crop canvas
    const canvas = cropper?.getCroppedCanvas();

    if (!canvas) {
      console.error("Could not get cropped canvas");
      return;
    }

    canvas.toBlob(
      async (blob: Blob | null) => {
        if (!blob) {
          console.error("Could not create blob from canvas");
          return;
        }

        const croppedFile = new File([blob], "cropped-image.jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        file.value = croppedFile;
        emit("update:modelValue", croppedFile);

        if (previewUrl.value) {
          URL.revokeObjectURL(previewUrl.value);
        }
        previewUrl.value = URL.createObjectURL(blob);

        showCropModal.value = false;
        cropImageUrl.value = null;
      },
      "image/jpeg",
      0.9
    );
  } catch (error) {
    console.error("Error applying crop:", error);
  }
};

const updatePreview = () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = undefined;
  }

  if (file.value instanceof File) {
    previewUrl.value = URL.createObjectURL(file.value);
  } else if (typeof existingUrl.value === "string") {
    previewUrl.value = existingUrl.value;
  }
};

// const removeFile = () => {
//   file.value = undefined;
//   existingUrl.value = undefined;
//   previewUrl.value && URL.revokeObjectURL(previewUrl.value);
//   previewUrl.value = undefined;
//   emit("update:modelValue", undefined);
//   emit("update:initialUrl", undefined);
// };

const onSelectFile = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const selectedFile = input.files?.[0];
  if (selectedFile) {
    file.value = selectedFile;
    emit("update:modelValue", selectedFile);
    updatePreview();

    if (props.editable) {
      setTimeout(() => openCrop(), 100);
    }
  }
  input.value = "";
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

// Watchers
watch(
  () => props.modelValue,
  (newFile) => {
    file.value = newFile;
    updatePreview();
  },
  { immediate: true }
);

watch(
  () => props.initialUrl,
  (newUrl) => {
    existingUrl.value = newUrl;
    if (!file.value) updatePreview();
  },
  { immediate: true }
);

watch(currentCropAspectRatio, (newRatio) => {
  cropperOptions.aspectRatio = newRatio;
  cropperOptions.initialAspectRatio = newRatio;
  cropper?.setAspectRatio?.(newRatio);
});

// Styling helpers
const shapeClass = computed(() => {
  switch (props.shape) {
    case "rectangle":
      return "rounded-lg";
    case "cover":
      return "rounded-md";
    case "rounded":
      return "rounded-full";
    default:
      return "rounded";
  }
});

const containerWidth = computed(() => props.width ?? "w-32");
const containerHeight = computed(() => props.height ?? "h-32");

const imageClass = computed(() => {
  return props.shape === "cover"
    ? "w-full h-[200px] md:h-[350px]  lg:h-[500px] object-cover"
    : "w-full h-full object-cover";
});
</script>

<style scoped>
.cropper-container {
  width: 100%;
  height: 450px;
  background: #f8f9fa;
}

:deep(.cropper-container) {
  direction: ltr;
  font-size: 0;
  line-height: 0;
  position: relative;
  touch-action: none;
  user-select: none;
}

:deep(.cropper-view-box) {
  outline: 2px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
}
</style>
