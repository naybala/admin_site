<template>
  <div class="card flex justify-start">
    <div class="flex flex-wrap gap-4">
      <!-- Public -->
      <div
        class="flex items-center gap-2 p-2 rounded-md cursor-pointer transition"
        :class="{
          'bg-blue-100 border border-blue-600 text-blue-800':
            modelValue === false,
          'border border-gray-300 text-gray-700': modelValue !== false,
        }"
        @click="$emit('update:modelValue', false)"
      >
        <RadioButton
          :modelValue="modelValue"
          @update:modelValue="$emit('update:modelValue', false)"
          :inputId="`${uid}-public`"
          :name="uid"
          :disabled="readonly"
          :value="false"
        />
        <label :for="`${uid}-public`" class="dark:text-gray-300 text-gray-900">
          Public
        </label>
      </div>

      <!-- Private -->
      <div
        class="flex items-center gap-2 p-2 rounded-md cursor-pointer transition"
        :class="{
          'bg-yellow-100 border border-yellow-600 text-yellow-800':
            modelValue === true,
          'border border-gray-300 text-gray-700': modelValue !== true,
        }"
        @click="$emit('update:modelValue', true)"
      >
        <RadioButton
          :modelValue="modelValue"
          @update:modelValue="$emit('update:modelValue', true)"
          :inputId="`${uid}-private`"
          :name="uid"
          :disabled="readonly"
          :value="true"
        />
        <label :for="`${uid}-private`" class="dark:text-gray-300 text-gray-900">
          Private
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import RadioButton from "primevue/radiobutton";

defineProps<{
  modelValue: boolean;
  readonly?: boolean;
}>();

defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const uid = Math.random().toString(36).substring(2, 9);
</script>
