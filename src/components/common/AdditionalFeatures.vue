<script setup lang="ts">
import { ref, watch } from "vue";

// Props: current type, all types (with their options), and current selected features
const props = defineProps<{
  type: string | undefined;
  types: Array<{ name: string; additional: string[] }>;
  modelValue: string[]; // This is form.additional
}>();

// Emit the updated list when user checks/unchecks boxes
const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
}>();

// Dynamic options based on selected type
const additionalOptions = ref<string[]>([]);

// Local state for checkboxes
const selected = ref<string[]>([]);

// 1. Watch for changes in type to update available options
watch(
  () => props.type,
  (newType) => {
    const selectedType = props.types.find((t) => t.name === newType);
    additionalOptions.value = selectedType?.additional || [];

    // When changing type, preserve only selected values that still exist in new options
    selected.value = props.modelValue.filter((val) =>
      additionalOptions.value.includes(val)
    );
  },
  { immediate: true }
);

// 2. Watch when parent updates modelValue (e.g., during form edit)
watch(
  () => props.modelValue,
  (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(selected.value)) {
      selected.value = newVal.filter((val) =>
        additionalOptions.value.includes(val)
      );
    }
  },
  { immediate: true }
);

// 3. Emit to parent on selection change
watch(selected, (newVal) => {
  emit("update:modelValue", newVal);
});
</script>

<template>
  <div
    v-if="additionalOptions.length"
    class="p-4 border border-brand-primary rounded-lg"
  >
    <label
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      Amenities
    </label>
    <div class="grid grid-cols-2 gap-2">
      <div
        v-for="feature in additionalOptions"
        :key="feature"
        class="flex items-center gap-2"
      >
        <input
          type="checkbox"
          :id="feature"
          :value="feature"
          v-model="selected"
          class="accent-primary"
        />
        <label :for="feature" class="text-sm capitalize">
          {{ feature }}
        </label>
      </div>
    </div>
  </div>
</template>
