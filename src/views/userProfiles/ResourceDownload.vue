<script setup lang="ts">
import { useAuthUserSocket } from "@/composables/realTimeSockets/useAuthUserSocket";
import { useAuthStore } from "@/stores/auth";
import { Button } from "primevue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const { userData, fetchUserData } = useAuthUserSocket();
const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.userId) {
    await fetchUserData({ id: authStore.userId || "" });
  }
});

const goToSubscribe = () => {
  router.push("my-packages");
};
</script>

<template>
  <div class="mt-5">
    <div v-if="userData.userType != 'Member'">
      <div class="p-4">
        <div class="md:text-md lg:text-2xl text-center">
          Congratulation , You have permission to access this page.
          <br />
          Comming Soon!
        </div>
        <br />
      </div>

      <br />
    </div>
    <div v-else class="shadow-lg rounded-xl border border-gray-200">
      <div class="p-4">
        <div class="md:text-md lg:text-2xl text-center">
          You don't have permission to access this page, please upgrade.
        </div>
        <br />
      </div>
      <div class="flex justify-center">
        <Button
          @click="goToSubscribe()"
          label="Upgrade Here"
          class="bg-green-400 text-white md:px-4 md:py-1 lg:px-10 lg:py-3 hover:scale-110 hover:bg-brand-primary transition-all duration-500"
        />
      </div>
      <br />
    </div>
  </div>
</template>
