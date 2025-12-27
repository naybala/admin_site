import { ref } from "vue";
import { apiRequest } from "../common/useApi";

export function useBoostOrder() {
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const orderId = ref<any>("");

  const fetchBoostOrder = async (data: any) => {
    loading.value = true;
    error.value = null;
    try {
      const response: any = await apiRequest<any>("api/v1/web/boost-orders", {
        method: "POST",
        body: JSON.stringify(data),
      });
      orderId.value = response?.data?.id;
    } catch (err: any) {
      console.error("User Subscription Error:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    orderId,
    fetchBoostOrder,
  };
}
