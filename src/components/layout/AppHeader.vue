<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@stores/auth";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useAppToast } from "@/composables/common/useAppToast";
import useAuthData from "@/composables/auth/index";
import Button from "primevue/button";
import "primeicons/primeicons.css";
import DarkLight from "../common/DarkLight.vue";

const emit = defineEmits(["toggle-sidebar"]);
const isChecked: any = ref(true);

const authStore = useAuthStore();
const { locale } = useI18n();
const confirm = useConfirm();
const { showSuccess } = useAppToast();
const { callToLogoutApi } = useAuthData();

function toggleSidebarAndAnimate() {
  isChecked.value = !isChecked.value;
  emit("toggle-sidebar");
}

const changeLocale = () => {
  locale.value = locale.value === "en" ? "mm" : "en";
};

const handleLogoutConfirm = () => {
  confirm.require({
    message: "Are you sure you want to log out?",
    header: "Logout Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectLabel: "Cancel",
    acceptLabel: "Confirm",
    acceptClass: "p-button-danger",
    accept: async () => {
      await callToLogoutApi();
      authStore.clearAuthData();
      window.location.href = "/login"; // or use router if available
    },
    reject: () => {
      showSuccess("Success", "Logout cancelled");
    },
  });
};
</script>

<template>
  <header
    class="bg-white dark:bg-gray-800 shadow p-0 md:p-4 flex justify-between items-center transition-colors duration-300"
  >
    <!-- Sidebar Toggle -->
    <div class="flex items-center ms-2">
      <div class="relative">
        <input
          class="label-check hidden"
          id="label-check"
          type="checkbox"
          :checked="isChecked?.value"
          readonly
        />
        <label
          for="label-check"
          class="hamburger-label relative p-0 mx-2 my-3 md:my-0 md:mx-0"
          @click="toggleSidebarAndAnimate"
        >
          <div class="line1 bg-gray-950 dark:bg-white"></div>
          <div class="line2 bg-gray-950 dark:bg-white"></div>
          <div class="line3 bg-gray-950 dark:bg-white"></div>
        </label>
      </div>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center space-x-4 pe-4">
      <!-- Language Toggle -->
      <div
        class="flex items-center space-x-2 cursor-pointer"
        @click="changeLocale"
      >
        <img
          :src="locale === 'en' ? '/mm.webp' : '/en.jpeg'"
          alt="Language Toggle"
          class="w-8 rounded-lg"
        />
        <span class="hidden md:inline">
          {{ locale === "en" ? "မြန်မာ" : "English" }}
        </span>
      </div>

      <!-- Theme Toggle -->
      <DarkLight />

      <!-- Logout -->
      <Button
        icon="pi pi-sign-out"
        severity="danger"
        outlined
        @click="handleLogoutConfirm"
      />
    </div>
  </header>
</template>

<style scoped>
.label-check {
  display: none;
}

.hamburger-label {
  width: 50px;
  height: 27px;
  display: block;
  cursor: pointer;
  position: relative;
}

.hamburger-label div {
  width: 50px;
  height: 6px;
  position: absolute;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.line1 {
  top: 0;
}

.line2 {
  top: 9px;
}

.line3 {
  top: 18px;
}

#label-check:checked + .hamburger-label .line1 {
  transform: rotate(29deg) scaleX(0.55) translate(27px, -4.5px);
  border-radius: 50px 50px 50px 0;
}

#label-check:checked + .hamburger-label .line2 {
  width: 45px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
}

#label-check:checked + .hamburger-label .line3 {
  transform: rotate(-29deg) scaleX(0.55) translate(27px, 4.5px);
  border-radius: 0 50px 50px 50px;
}
</style>
