<template>
  <br /><br />
  <div class="flex justify-start space-x-6 mt-4">
    <Button
      :label="cancelLabel"
      severity="secondary"
      @click="onCancel"
      class="p-button-secondary text-white bg-gray-600 dark:bg-gray-700 px-5"
    />
    <Button
      v-if="!readonly"
      :label="saveLabel"
      type="submit"
      :disabled="loading"
      :loading="loading"
      class="p-button-primary text-white bg-gray-600 dark:bg-gray-700 px-5"
    />
  </div>
</template>

<script setup lang="ts">
import Button from "primevue/button";

defineProps<{
  onCancel: () => void;
  saveLabel: string;
  cancelLabel: string;
  loading: boolean;
  readonly?: boolean;
}>();
</script>
