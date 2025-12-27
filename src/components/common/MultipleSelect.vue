<template>
  <div class="mb-4">
    <label
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
    </label>

    <MultiSelect
      :id="id"
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      display="chip"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      filter
      filterPlaceholder="Search..."
      :placeholder="placeholder"
      :maxSelectedLabels="3"
      :disabled="readonly"
      class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
    />

    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import MultiSelect from "primevue/multiselect";

defineProps<{
  id: string;
  modelValue?: any;
  options?: Array<string | Record<string, any>>;
  label?: string;
  placeholder?: string;
  error?: string;
  optionLabel?: string;
  optionValue?: string;
  readonly?: boolean;
}>();

defineEmits<{
  (event: "update:modelValue", value: any): void;
}>();
</script>
<style scoped>
/* Deep selector for PrimeVue child components */

::v-deep(.p-multiselect-token) {
  @apply bg-blue-100 text-blue-800 rounded px-2 py-0.5 text-sm font-medium;
}

::v-deep(.p-multiselect-filter) {
  @apply border border-blue-400 rounded-md text-sm text-gray-800 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500;
}

::v-deep(.p-multiselect-panel) {
  @apply dark:bg-gray-800 bg-white;
}
</style>
