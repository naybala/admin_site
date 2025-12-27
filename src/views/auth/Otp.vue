<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
  >
    <div class="bg-gray-200 rounded-lg p-6 w-full max-w-md shadow-lg relative">
      <button
        class="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
        @click="$emit('close')"
      >
        ✕
      </button>

      <h2 class="text-xl font-semibold mb-4 text-center dark:text-black">
        OTP Verification
      </h2>
      <p class="text-gray-600 text-sm text-center mb-6">
        Enter the 4-digit code sent to your phone number.
      </p>

      <div class="flex justify-center mb-4">
        <InputOtp v-model="otpValue" integer-only size="large" />
      </div>

      <div class="flex justify-between items-center">
        <p class="dark:text-black">Didn't get OTP?</p>
        <p class="underline cursor-pointer dark:text-black">
          Click here for resend
        </p>
      </div>

      <div class="flex justify-between gap-3 mt-4">
        <button
          @click="handleVerify"
          :disabled="otpValue == ''"
          class="flex-1 bg-brand-primary text-white py-2 rounded-md hover:bg-brand-primary-dark transition"
        >
          Verify
        </button>
        <button
          @click="$emit('close')"
          class="flex-1 bg-white text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import InputOtp from "primevue/inputotp";

defineProps<{ show: boolean }>();
const emits = defineEmits(["update:show", "close", "verify"]);

const otpValue = ref("");

const handleVerify = () => {
  emits("verify", otpValue.value);
  emits("update:show", false);
};
</script>
