<script setup lang="ts">
import { InputGroupAddon, InputText } from "primevue";
import InputGroup from "primevue/inputgroup";

defineProps<{
  id: string;
  modelValue: any;
  modelValueTwo?: any;
  preModelValue?: any;
  label: any;
  error?: any;
  type?: any;
  readonly?: boolean;
  min?: string;
  max?: string;
}>();

const emit = defineEmits(["update:modelValue", "update:modelValueTwo"]);

const updateValue = (value: string | undefined | null) => {
  emit("update:modelValue", value ?? "");
  emit("update:modelValueTwo", value ?? "");
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

    <InputGroup
      class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 h-14 rounded-lg"
    >
      <InputGroupAddon
        class="border-r border-gray-300 dark:border-gray-600 dark:bg-gray-700"
      >
        {{ preModelValue }}
      </InputGroupAddon>

      <InputText
        :id="id ?? 'name'"
        :modelValue="modelValue"
        @update:modelValue="updateValue"
        :type="type ?? 'text'"
        :readonly="readonly"
        class="p-2 dark:bg-gray-700"
        :class="readonly ? 'bg-gray-100' : ''"
        :min="min"
        :max="max"
      />
    </InputGroup>

    <span v-if="!modelValue">
      <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    </span>
  </div>
</template>
