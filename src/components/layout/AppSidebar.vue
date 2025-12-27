<script setup lang="ts">
import { useAuthUserSocket } from "@/composables/realTimeSockets/useAuthUserSocket";
import NormalSideBar from "./NormalSideBar.vue";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const { userData, fetchUserData } = useAuthUserSocket();

const props = defineProps<{
  isOpen: boolean;
  isMobileVisible: boolean;
}>();

const emit = defineEmits<{
  (e: "close-mobile"): void;
}>();

onMounted(async () => {
  if (authStore.userId) {
    await fetchUserData({ id: authStore.userId || "" });
  }
});
</script>
<template>
  <NormalSideBar
    :isOpen="props.isOpen"
    :isMobileVisible="props.isMobileVisible"
    @close-mobile="emit('close-mobile')"
    :userData="userData"
  />
</template>
