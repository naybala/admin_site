<script setup lang="ts">
import { InputText } from "primevue";
import { ref } from "vue";

defineProps<{
  modelValue: string;
  label: string;
  error?: string;
  placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const showPassword = ref(false);

function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}
</script>

<template>
  <div class="mb-4 relative">
    <label class="block text-sm font-medium mb-1">{{ label }}</label>
    <InputText
      :type="showPassword ? 'text' : 'password'"
      :value="modelValue"
      @input="(e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)"
      class="w-full p-inputtext-sm dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 p-2 h-14"
      :placeholder="placeholder"
    />
    <button
      type="button"
      @click="toggleShowPassword"
      class="absolute right-2 top-10 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
      aria-label="Toggle password visibility"
    >
      {{ showPassword ? "Hide" : "Show" }}
    </button>
    <small v-if="error" class="text-red-500">{{ error }}</small>
  </div>
</template>

<style scoped>
/* Optional: you can style the button better or add icons */
</style>
