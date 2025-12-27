<template>
  <div>
    <!-- File input -->
    <input
      type="file"
      :multiple="isMultiple"
      accept="image/*"
      @change="onSelectFiles"
    />

    <!-- Image previews with drag-and-drop -->
    <Draggable
      v-model="combinedList"
      item-key="uid"
      class="flex gap-2 mt-4 flex-wrap"
      @end="onDragEnd"
    >
      <template #item="{ element, index }">
        <div
          class="relative group w-32 h-32 border rounded overflow-hidden"
          :key="element.uid"
        >
          <img :src="element.url" class="w-full h-full object-cover" />
          <button
            @click.prevent="removeFile(index)"
            class="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100"
            title="Remove"
          >
            ✕
          </button>
        </div>
      </template>
    </Draggable>

    <!-- Error display -->
    <span v-if="!modelValue">
      <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Draggable from "vuedraggable";

// Define props and emits
const props = defineProps<{
  modelValue: File[] | undefined;
  initialUrls?: string[];
  isMultiple?: boolean;
  error?: string;
}>();

const emit = defineEmits(["update:modelValue", "update:initialUrls"]);

// Reactive state
const newFiles = ref<any>(props.modelValue ?? []);
const existingUrls = ref<string[]>(props.initialUrls ?? []);
const combinedList = ref<
  { uid: string; url: string; isExisting: boolean; file?: File }[]
>([]);

// Utility to generate a unique ID
const generateUID = () => Math.random().toString(36).substring(2, 9);

// Update combined list when props change
watch(
  [existingUrls, newFiles],
  () => {
    combinedList.value = [
      ...existingUrls.value.map((url) => ({
        uid: generateUID(),
        url,
        isExisting: true,
      })),
      ...newFiles.value.map((f: any) => ({
        uid: f.uid,
        url: f.url,
        isExisting: false,
        file: f.file,
      })),
    ];
  },
  { immediate: true }
);

// Handle file selection
const onSelectFiles = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const addedFiles = Array.from(input.files ?? []).map((file) => ({
    file,
    url: URL.createObjectURL(file),
    uid: generateUID(),
    isExisting: false,
  }));

  newFiles.value = [...newFiles.value, ...addedFiles];

  emit(
    "update:modelValue",
    newFiles.value.map((f: any) => f.file)
  );

  input.value = ""; // allow selecting same file again
};

// Handle drag end to sync order
const onDragEnd = () => {
  const newExisting: string[] = [];
  const newFilesOrdered: File[] = [];

  for (const item of combinedList.value) {
    if (item.isExisting) {
      newExisting.push(item.url);
    } else if (item.file) {
      newFilesOrdered.push(item.file);
    }
  }

  existingUrls.value = newExisting;
  newFiles.value = newFilesOrdered;
  emit("update:initialUrls", [...existingUrls.value]);
  emit("update:modelValue", [...newFiles.value]);
};

// Handle file removal
const removeFile = (index: number) => {
  const item = combinedList.value[index];
  if (!item) return;

  if (item.isExisting) {
    const i = existingUrls.value.indexOf(item.url);
    if (i !== -1) existingUrls.value.splice(i, 1);
    emit("update:initialUrls", [...existingUrls.value]);
  } else {
    const i = newFiles.value.findIndex((f: any) => f.url === item.url);
    if (i !== -1) {
      URL.revokeObjectURL(newFiles.value[i].url);
      newFiles.value.splice(i, 1);
    }
    console.log(newFiles.value);

    emit(
      "update:modelValue",
      newFiles.value.map((f: any) => f.file)
    );
  }

  combinedList.value.splice(index, 1);
};
</script>
