<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppSidebar from "@components/layout/AppSidebar.vue";
import AppHeader from "@components/layout/AppHeader.vue";
import { useThemeStore } from "@stores/theme";
import ConfirmDialog from "primevue/confirmdialog";
import Toast from "primevue/toast";
import { usePermissionSocket } from "./composables/realTimeSockets/usePermissionSocket";
import { usePermissionStore } from "./stores/permission";

const route = useRoute();
const router = useRouter();
const isSidebarOpen = ref(true); // Desktop: open/collapsed
const isMobileSidebarVisible = ref(false); // Mobile: slide-in/out

const themeStore = useThemeStore();
usePermissionSocket();
const permissionStore = usePermissionStore();

watch(
  () => permissionStore.permissions,
  () => {
    const requiredPermission = route.meta.permission as string;
    if (
      requiredPermission &&
      !permissionStore.hasPermission(requiredPermission)
    ) {
      console.warn("Permission removed — redirecting to /unauthorized");
      router.push("/unauthorized");
    }
  }
);

const toggleSidebar = () => {
  if (window.innerWidth < 768) {
    isMobileSidebarVisible.value = !isMobileSidebarVisible.value;
  } else {
    isSidebarOpen.value = !isSidebarOpen.value;
  }
};

const closeMobileSidebar = () => {
  isMobileSidebarVisible.value = false;
};

const showLayout = computed(() => {
  const noLayoutRoutes = ["/login", "/login-with-user", "/privacy-policy"];
  return !noLayoutRoutes.includes(route.path);
});
onMounted(async () => {
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      isMobileSidebarVisible.value = false;
    }
  });

  // Auto-close sidebar on route change (mobile only)
  router.afterEach(() => {
    if (window.innerWidth < 768) {
      isMobileSidebarVisible.value = false;
    }
  });
});

function handleResize() {
  if (window.innerWidth >= 768) {
    isMobileSidebarVisible.value = false;
  }
}

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div
    :class="{ dark: themeStore.isDark }"
    class="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors"
  >
    <div v-if="showLayout" class="flex h-screen relative overflow-hidden">
      <!-- Backdrop (mobile only) -->
      <div
        v-if="isMobileSidebarVisible"
        @click="closeMobileSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      ></div>

      <AppSidebar
        :isOpen="isSidebarOpen"
        :isMobileVisible="isMobileSidebarVisible"
        @close-mobile="closeMobileSidebar"
      />

      <div class="flex flex-col flex-1 overflow-hidden">
        <AppHeader @toggle-sidebar="toggleSidebar" />
        <main class="p-1 md:p-3 lg:p-6 flex-1 overflow-y-auto">
          <router-view />
        </main>
      </div>
    </div>

    <!-- Login page -->
    <div v-else class="h-screen">
      <router-view />
    </div>
  </div>

  <Toast />
  <ConfirmDialog />
</template>
