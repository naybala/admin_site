import { ref } from "vue";
import { apiRequest } from "./useApi";

export function useCountry() {
  const countryList = ref<any>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const fetchCountry = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response: any = await apiRequest("/countries/prepare", {
        method: "GET",
      });
      countryList.value = response?.data || [];
    } catch (err: any) {
      error.value = err.message || "Unknown error occurred.";
      console.error("Country Error:", err);
    } finally {
      loading.value = false;
    }
  };

  return {
    countryList,
    loading,
    error,
    fetchCountry,
  };
}
