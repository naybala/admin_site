<template>
  <div class="card flex justify-start">
    <div class="flex flex-wrap gap-4">
      <!-- Active -->
      <div
        class="flex items-center gap-2 p-2 rounded-md cursor-pointer transition"
        :class="{
          'bg-green-100 border border-green-600 text-green-800':
            modelValue === true,
          'border border-gray-300 text-gray-700': modelValue !== true,
        }"
      >
        <RadioButton
          :modelValue="modelValue"
          @update:modelValue="$emit('update:modelValue', true)"
          :inputId="`${uid}-active`"
          :name="uid"
          :disabled="readonly"
          :value="true"
        />
        <label :for="`${uid}-active`" class="dark:text-gray-500 text-gray-900"
          >Active</label
        >
      </div>

      <!-- Inactive -->
      <div
        class="flex items-center gap-2 p-2 rounded-md cursor-pointer transition"
        :class="{
          'bg-red-500 border border-red-600': modelValue === false,
          'border border-gray-300 text-gray-700': modelValue !== false,
        }"
      >
        <RadioButton
          :modelValue="modelValue"
          @update:modelValue="$emit('update:modelValue', false)"
          :inputId="`${uid}-inactive`"
          :name="uid"
          :disabled="readonly"
          :value="false"
        />
        <label :for="`${uid}-inactive`" class="dark:text-gray-300 text-gray-900"
          >Inactive</label
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RadioButton from "primevue/radiobutton";

defineProps<{
  modelValue: any;
  readonly?: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const uid = Math.random().toString(36).substring(2, 9); // unique ID for radio group
</script>
