<template>
  <div class="audio-uploader">
    <!-- Audio Preview -->
    <div v-if="previewUrl" class="relative border rounded p-3 bg-gray-50">
      <audio controls :src="previewUrl" class="w-full"></audio>

      <button
        class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded"
        @click.prevent="triggerFileInput"
      >
        Change Audio
      </button>
    </div>

    <!-- Upload Button -->
    <div v-else>
      <button
        class="bg-blue-600 text-white text-sm px-4 py-2 rounded"
        @click.prevent="triggerFileInput"
      >
        Upload Audio
      </button>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="audio/*"
      class="hidden"
      @change="onFileSelected"
    />

    <!-- Progress -->
    <div
      v-if="uploadProgress > 0 && uploadProgress < 100"
      class="mt-2 text-blue-600"
    >
      Uploading: {{ uploadProgress }}%
    </div>

    <!-- Error -->
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { apiRequest } from "@/composables/common/useApi";

const props = defineProps<{
  modelValue: string | undefined;
  maxSizeMB?: number;
  path?: string;
}>();

const emit = defineEmits([
  "update:modelValue",
  "update:uploadProgress",
  "update:duration",
]);

const fileInput = ref<HTMLInputElement | null>(null);
const uploadProgress = ref<number>(0);
const previewUrl = ref<string | undefined>(undefined);
const error = ref<string | null>(null);

const MAX_SIZE_MB = props.maxSizeMB ?? 20;
const CDN_BASE_URL = "https://proptechapp.sgp1.cdn.digitaloceanspaces.com";

const triggerFileInput = () => fileInput.value?.click();

const onFileSelected = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const selectedFile = input.files?.[0];
  if (!selectedFile) return;

  if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
    error.value = `File exceeds ${MAX_SIZE_MB}MB limit.`;
    return;
  }

  error.value = null;
  uploadProgress.value = 0;

  try {
    const filename = selectedFile.name;
    const contentType = selectedFile.type;

    // Step 1: Get pre-signed URL
    const presignedRes: any = await apiRequest(
      "/get-presigned-urls/get-single-url",
      {
        method: "POST",
        body: JSON.stringify({
          file: { filename, contentType },
          path: props.path || "audios",
        }),
      }
    );

    if (!presignedRes?.data?.url?.url) {
      throw new Error("Presigned URL not returned correctly");
    }

    const signedUrl = presignedRes.data.url.url;
    const publicKey = presignedRes.data.url.key;

    // Step 2: Upload via XHR
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedUrl, true);
      xhr.setRequestHeader("Content-Type", contentType);
      xhr.setRequestHeader("x-amz-acl", "public-read");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          uploadProgress.value = Math.round((event.loaded / event.total) * 100);
          emit("update:uploadProgress", uploadProgress.value);
        }
      };

      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve()
          : reject(new Error(`Upload failed with status ${xhr.status}`));

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(selectedFile);
    });

    // Step 3: Update preview
    const fullUrl = `${CDN_BASE_URL}/${publicKey}`;
    previewUrl.value = fullUrl;
    emit("update:modelValue", publicKey);

    // Step 4: Get duration in seconds
    const audio = document.createElement("audio");
    audio.src = fullUrl;
    audio.addEventListener("loadedmetadata", () => {
      const durationSeconds = Math.round(audio.duration);
      emit("update:duration", durationSeconds); // send duration to parent
    });

    input.value = "";
  } catch (err: any) {
    console.error("Upload failed:", err);
    error.value = err.message || "Upload failed";
  } finally {
    uploadProgress.value = 0;
  }
};

// Sync when parent updates modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    previewUrl.value = newVal
      ? newVal.startsWith("http")
        ? newVal
        : `${CDN_BASE_URL}/${newVal}`
      : undefined;
  },
  { immediate: true }
);
</script>

<style scoped>
.audio-uploader audio {
  width: 100%;
}
</style>
