import { ref } from "vue";
import { apiRequest } from "../common/useApi";
import { useAuthStore } from "@/stores/auth";

export function useMapPriceAuth() {
  const isExist = ref<any>(false);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();

  const fetchMapPriceAuth = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response: any = await apiRequest(
        `api/v1/web/map-price-packages/user-auth-check`,
        {
          method: "POST",
          body: JSON.stringify({ userId: authStore.userId }),
        }
      );
      if (response) {
        isExist.value = response.data;
      }
    } catch (err: any) {
      error.value = err.message || "Unknown error occurred.";
      console.error("IP Location Error:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    isExist,
    loading,
    error,
    fetchMapPriceAuth,
  };
}
