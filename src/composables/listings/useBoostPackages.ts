import { ref } from "vue";
import { apiRequest } from "../common/useApi";

export function useBoostPackages() {
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const plans = ref<any>([]);

  const fetchBoostPackages = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response: any = await apiRequest<any>(
        "api/v1/web/user-subscriptions/my-buyable-plan",
        {
          method: "GET",
        }
      );
      plans.value = response?.data;
    } catch (err: any) {
      console.error("User Subscription Error:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    plans,
    fetchBoostPackages,
  };
}
