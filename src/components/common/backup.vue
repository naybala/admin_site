<template>
  <div class="mb-4">
    <label
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
    </label>

    <Select
      :id="id"
      :modelValue="modelValue"
      @update:modelValue="updateValue"
      :options="normalizedOptions"
      :optionLabel="optionLabel || 'label'"
      :optionValue="optionValue || 'value'"
      :placeholder="placeholder"
      :filter="true"
      filterPlaceholder="Search..."
      class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600"
    >
      <!-- Option Template -->
      <template #option="slotProps">
        <div class="flex items-center gap-2">
          <span>{{ slotProps.option[optionLabel || "label"] }}</span>
        </div>
      </template>

      <!-- Selected Value Template -->
      <template #value="slotProps">
        <div class="flex items-center gap-2" v-if="slotProps.value">
          <span>
            {{ getLabelByValue(slotProps.value) }}
          </span>
        </div>
        <span v-else class="text-gray-400">{{ placeholder }}</span>
      </template>
    </Select>

    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Select } from "primevue";

const props = defineProps<{
  id: string;
  modelValue: string | null;
  options: Array<string | Record<string, any>>;
  label: string;
  placeholder: string;
  error?: string;
  optionLabel?: string;
  optionValue?: string;
  showFlag?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

function updateValue(value: string | null) {
  emit("update:modelValue", value);
}

// Normalize options: convert strings to objects with 'label' and 'value'
const normalizedOptions = computed(() => {
  return props.options.map((opt) => {
    if (typeof opt === "string") {
      return {
        label: opt,
        value: opt,
      };
    }
    return opt;
  });
});

function getLabelByValue(value: string | null): string {
  const option = normalizedOptions.value.find(
    (opt) => opt[props.optionValue || "value"] === value
  );
  return option?.[props.optionLabel || "label"] || "";
}
</script>
