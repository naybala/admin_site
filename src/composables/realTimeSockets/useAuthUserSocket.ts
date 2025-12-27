// src/composables/realTimeSockets/useAuthUserSocket.ts

import { onMounted, onUnmounted, ref } from "vue";
import { useAuthStore } from "@stores/auth";
import { io } from "socket.io-client";
import { apiRequest } from "../common/useApi";

// Define your socket server URL (adjust this as needed)
const socketUrl =
  import.meta.env.VITE_SOCKET_LOCAL_URL ?? "http://localhost:3000";

// Connect to the socket server
const socket = io(socketUrl);

export function useAuthUserSocket() {
  const authStore = useAuthStore();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const userData = ref<any>({});

  // Fetch the latest user data from API
  const fetchUserData = async (data: { id: any }) => {
    console.log("Fetching user data for ID:", data.id);

    loading.value = true;
    try {
      const responseData = await apiRequest<any>("api/v1/web/auth/user-info", {
        method: "POST",
        body: JSON.stringify(data),
      });
      userData.value = responseData.data;
    } catch (err: any) {
      error.value = err.message || "An error occurred";
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Socket handler function
  const socketHandler = () => {
    if (authStore.userId) {
      console.log(`Received socket update for user: ${authStore.userId}`);
      fetchUserData({ id: authStore.userId });
    }
  };

  // Register and clean up socket listeners
  onMounted(() => {
    if (authStore.userId) {
      socket.on(`users:update-${authStore.userId}`, socketHandler);
    }
  });

  onUnmounted(() => {
    if (authStore.userId) {
      socket.off(`users:update-${authStore.userId}`, socketHandler);
    }
  });

  return {
    userData,
    fetchUserData,
    loading,
    error,
  };
}
