<script setup lang="ts">
import { useAuthUserSocket } from "@/composables/realTimeSockets/useAuthUserSocket";
import AnimatedSidebar from "./AnimatedSidebar.vue";
import NormalSideBar from "./NormalSideBar.vue";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import StaticSidebar from "./StaticSidebar.vue";

const isAnimated = import.meta.env.VITE_SIDEBAR_TYPE ?? "Normal";
const isDynamicSidebar = import.meta.env.VITE_DYNAMIC_SIDEBAR === "true";

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
  <div v-if="isDynamicSidebar">
    <KeepAlive>
      <AnimatedSidebar
        v-if="isAnimated === 'Animated'"
        :isOpen="props.isOpen"
        :isMobileVisible="props.isMobileVisible"
        @close-mobile="emit('close-mobile')"
        :userData="userData"
      />
    </KeepAlive>

    <KeepAlive>
      <NormalSideBar
        v-if="isAnimated === 'Normal'"
        :isOpen="props.isOpen"
        :isMobileVisible="props.isMobileVisible"
        @close-mobile="emit('close-mobile')"
        :userData="userData"
      />
    </KeepAlive>
  </div>
  <div v-else>
    <StaticSidebar
      :isOpen="props.isOpen"
      :isMobileVisible="props.isMobileVisible"
      @close-mobile="emit('close-mobile')"
      :userData="userData"
    />
  </div>
</template>
