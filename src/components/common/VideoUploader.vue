<template>
  <div class="video-uploader">
    <!-- Video Preview -->
    <div v-if="previewUrl" class="relative border rounded overflow-hidden">
      <video
        controls
        :src="previewUrl"
        class="w-full max-h-80 object-contain"
      ></video>

      <button
        class="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded"
        @click.prevent="triggerFileInput"
      >
        Change Video
      </button>
    </div>

    <!-- Upload Button -->
    <div v-else>
      <button
        class="bg-blue-600 text-white text-sm px-4 py-2 rounded"
        @click.prevent="triggerFileInput"
      >
        Upload {{ name }}
      </button>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="video/*"
      class="hidden"
      @change="onFileSelected"
    />

    <!-- Progress -->
    <div
      v-if="uploadProgress > 0 && uploadProgress < 100"
      class="mt-2 text-brand-primary"
    >
      Uploading: {{ uploadProgress }}%
    </div>

    <!-- Error -->
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { apiRequest } from "@/composables/common/useApi";
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: string | undefined; // stored value (key)
  maxSizeMB?: number;
  path?: string;
  name?: string;
}>();

const emit = defineEmits(["update:modelValue", "update:uploadProgress"]);

const fileInput = ref<HTMLInputElement | null>(null);
const uploadProgress = ref<number>(0);
const previewUrl = ref<string | undefined>(undefined);
const error = ref<string | null>(null);

const MAX_SIZE_MB = props.maxSizeMB ?? 100;
const CDN_BASE_URL = "https://proptechapp.sgp1.cdn.digitaloceanspaces.com";

// Trigger file picker
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Handle file upload
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
      "api/v1/web/get-presigned-urls/get-single-url",
      {
        method: "POST",
        body: JSON.stringify({
          file: { filename, contentType },
          path: props.path || "videos",
        }),
      }
    );

    if (!presignedRes?.data?.url?.url) {
      throw new Error("Presigned URL not returned correctly");
    }

    const signedUrl = presignedRes.data.url.url;
    const publicKey = presignedRes.data.url.key; // e.g. videos/mainVideo/...

    // Step 2: Upload
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

    // Step 3: Emit key for backend storage, and show full preview
    emit("update:modelValue", publicKey);
    previewUrl.value = `${CDN_BASE_URL}/${publicKey}`;

    input.value = ""; // reset input
  } catch (err: any) {
    console.error("Upload failed:", err);
    error.value = err.message || "Upload failed";
  } finally {
    uploadProgress.value = 0;
  }
};

// Watch parent value → update preview (supports full or relative)
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
.video-uploader video {
  background-color: #000;
}
</style>
