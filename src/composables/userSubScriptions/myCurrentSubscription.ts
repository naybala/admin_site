import { ref } from "vue";
import { apiRequest } from "../common/useApi";

export function useUserSubscription() {
  const startDate = ref<any>("");
  const endDate = ref<any>("");
  const loading = ref<boolean>(false);
  const freshUser = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchUserSubscription = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await apiRequest<any>(
        "api/v1/web/user-subscriptions/my-current-subscription",
        {
          method: "GET",
        }
      );

      if (response) {
        startDate.value = response?.data?.startDate;
        endDate.value = response?.data?.endDate;
      }
    } catch (err: any) {
      freshUser.value = true;
    } finally {
      loading.value = false;
    }
  };

  return {
    startDate,
    endDate,
    freshUser,
    loading,
    error,
    fetchUserSubscription,
  };
}
