<script setup lang="ts">
import InputText from "primevue/inputtext";

defineProps<{
  id: string;
  modelValue: any;
  label: any;
  error?: any;
  type?: any;
  readonly?: boolean;
  min?: string;
  max?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const updateValue = (value: string | undefined | null) => {
  emit("update:modelValue", value ?? "");
};
</script>

<template>
  <div class="mb-4">
    <label
      for="name"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
    </label>
    <InputText
      :id="id ?? 'name'"
      :modelValue="modelValue"
      @update:modelValue="updateValue"
      :type="type ?? 'text'"
      :readonly="readonly"
      class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 p-2 h-14"
      :class="readonly ? 'bg-gray-100' : ''"
      :min="min"
      :max="max"
    />
    <span v-if="!modelValue">
      <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    </span>
  </div>
</template>
