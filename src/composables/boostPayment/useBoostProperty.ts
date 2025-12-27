import { ref } from "vue";
import { apiRequest } from "../common/useApi";

interface HashData {
  hash: string;
  merchant_id: string;
  tran_id: string;
  amount: string;
  req_time: string;
  payment_option: string;
  return_url: string;
  cancel_url: string;
  continue_success_url: string;
  return_params: string;
  id?: string;
  price?: string;
}

interface HashResponse {
  data: HashData;
}

interface KeepCallingResponse {
  data: boolean;
}

export function useBoostProperty() {
  const error = ref<string | null>(null);
  const hashedData = ref<HashData | null>(null);
  const keepCalling = ref<boolean>(true);
  const orderCancelLoading = ref<boolean>(false);
  const orderCancelData = ref<any>([]);

  const getHashedData = async (
    transactionId: string,
    paymentOption: string
  ) => {
    error.value = null;
    try {
      const hashResponse = await apiRequest<HashResponse>(
        `api/v1/web/payments/boost-order-prepare-hash-data`,
        {
          method: "POST",
          body: JSON.stringify({
            transactionId: transactionId,
            paymentOption: paymentOption,
          }),
        }
      );
      hashedData.value = hashResponse.data;
      console.log(hashedData.value);
      console.log("Boost Property for Hash Data");
    } catch (err: any) {
      console.error("Fetch Error:", err);
      error.value = err.message || "Failed to fetch hash data";
    }
  };

  const fetchExtraCalling = async (
    transactionId: string,
    transactionType: string
  ) => {
    try {
      const keepCallingResponse = await apiRequest<KeepCallingResponse>(
        `api/v1/web/payments/extra-calling-aba-api`,
        {
          method: "POST",
          body: JSON.stringify({
            transactionId: transactionId,
            transactionType: transactionType,
            paymetFeature: "boost-order",
          }),
        }
      );
      keepCalling.value = keepCallingResponse.data;
    } catch (err: any) {
      console.error("Fetch Error:", err);
    }
  };

  const fetchOrderCancel = async (transactionId: string) => {
    orderCancelLoading.value = true;
    try {
      const cancelResponse: any = await apiRequest(
        `api/v1/web/boost-orders/cancel/${transactionId}`,
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

  return {
    hashedData,
    getHashedData,
    keepCalling,
    fetchExtraCalling,
    error,
    orderCancelLoading,
    orderCancelData,
    fetchOrderCancel,
  };
}
