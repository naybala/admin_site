import { ref } from "vue";
import { apiRequest } from "../common/useApi";
import { useAuthStore } from "@/stores/auth";

export function useStoreMapPricePackage() {
  const error = ref<string | null>(null);
  const authStore = useAuthStore();

  const transactionData = ref<any>(null);
  const hashedData = ref<any>(null);
  const loading = ref<boolean>(false);
  const orderCancelLoading = ref<boolean>(false);
  const orderCancelData = ref<any>(null);
  const keepCalling = ref<boolean>(true);

  const fetchStoreMapPricePackage = async (packageData: any) => {
    error.value = null;
    loading.value = true;

    const payload = {
      userId: authStore.userId,
      packageId: packageData.id,
      packageName: packageData.name,
      price: packageData.price,
      currencyCode: "USD",
      duration: String(packageData.duration),
      status: "pending",
      transactionPlatform: "web",
      transactionRef: "manual",
      transactionType: "panel",
      isRenew: false,
    };

    try {
      const orderResponse: any = await apiRequest(
        `api/v1/web/map-price-orders`,
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );
      transactionData.value = orderResponse.data;
    } catch (err: any) {
      console.error("Fetch Error:", err);
      error.value = err?.message ?? "Unknown error occurred.";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getHashedData = async (
    transactionId: string,
    paymentOption: string
  ) => {
    try {
      const hashResponse: any = await apiRequest(
        `api/v1/web/payments/prepare-hash-data`,
        {
          method: "POST",
          body: JSON.stringify({
            transactionId: transactionId,
            paymentOption: paymentOption,
          }),
        }
      );
      hashedData.value = hashResponse.data;
    } catch (err: any) {
      console.error("Fetch Error:", err);
    }
  };

  const fetchCancelOrder = async (transactionId: string) => {
    orderCancelLoading.value = true;
    try {
      const cancelResponse: any = await apiRequest(
        `api/v1/web/map-price-orders/cancel/${transactionId}`,
        {
          method: "POST",
        }
      );
      orderCancelData.value = cancelResponse.data || [];
    } catch (err: any) {
      console.error("Fetch Error:", err);
    } finally {
      orderCancelLoading.value = false;
    }
  };

  const fetchExtraCalling = async (
    transactionId: string,
    transactionType: string
  ) => {
    try {
      const keepCallingResponse: any = await apiRequest(
        `api/v1/web/payments/extra-calling-aba-api`,
        {
          method: "POST",
          body: JSON.stringify({
            transactionId: transactionId,
            transactionType: transactionType,
            paymetFeature: "map-price",
          }),
        }
      );
      keepCalling.value = keepCallingResponse.data;
    } catch (err: any) {
      console.error("Fetch Error:", err);
    }
  };

  return {
    transactionData,
    hashedData,
    getHashedData,
    fetchCancelOrder,
    orderCancelData,
    orderCancelLoading,
    keepCalling,
    fetchExtraCalling,
    error,
    loading,
    fetchStoreMapPricePackage,
  };
}
