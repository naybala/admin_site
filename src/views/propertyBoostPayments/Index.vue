<script setup>
import AbaKhqr from "@/components/aba/AbaKhqr.vue";
import JCB from "@/components/aba/JCB.vue";
import MasterCard from "@/components/aba/MasterCard.vue";
import SmallMaster from "@/components/aba/SmallMaster.vue";
import UnionPay from "@/components/aba/UnionPay.vue";
import Visa from "@/components/aba/Visa.vue";
import { useBoostProperty } from "@/composables/boostPayment/useBoostProperty";
import { Card } from "primevue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import QRPayment from "@/components/aba/QRPayment.vue";
import CardPayment from "@/components/aba/CardPayment.vue";

const route = useRoute();
const router = useRouter();
const encryptedData = route.params.encrypted;
const data = JSON.parse(atob(encryptedData));
const { hashedData, keepCalling, getHashedData, fetchExtraCalling } =
  useBoostProperty();
const PAYMENT_METHODS = {
  ABA_KHQR: "abapay_khqr",
  CARD: "cards",
};

// States
const sdkLoaded = ref(false);
const isLoading = ref(false);
const paymentOption = ref("");
const merchantId = ref("");
const returnUrl = ref("");
const cancelUrl = ref("");
const continueSuccessUrl = ref("");
const returnParams = ref("");
const hash = ref("");
const tranId = ref("");
const amount = ref("");
const reqTime = ref("");
let intervalId, timeoutId;
let callCount = 0;
const maxCalls = 10;

const abaPayWayJsUrl = import.meta.env.VITE_ABA_PAYWAY_JS_URL;
const abaActionUrl = import.meta.env.VITE_ABA_ACTION_URL;

// Load ABA SDK
async function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

onMounted(async () => {
  try {
    await loadScript(abaPayWayJsUrl);
    sdkLoaded.value = true;
  } catch (error) {
    console.error("SDK failed to load", error);
    sdkLoaded.value = false;
  }
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
});

// Trigger Checkout
const triggerCheckout = async (paymentMethod) => {
  try {
    isLoading.value = true;
    await getHashedData(data.id, paymentMethod);
    if (!sdkLoaded.value || !hashedData.value) {
      throw new Error("SDK or payment data not ready");
    }
    insertData();
    setTimeout(() => {
      AbaPayway.checkout();
    }, 300);
  } catch (error) {
    alert("Failed to start payment process.");
    console.error("Payment error:", error);
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  }

  callExternalApi(data.id, paymentMethod);
  callCount++;

  // Call every 30 seconds
  intervalId = setInterval(() => {
    if (callCount >= maxCalls) {
      clearInterval(intervalId);
      return;
    }

    callExternalApi(data.id, paymentMethod);
    callCount++;
  }, 15000); // 15,000 ms = 15 seconds

  // Safety timeout: stop after 5 minutes
  timeoutId = setTimeout(() => {
    clearInterval(intervalId);
  }, 300000); // 300,000 ms = 5 minutes
};

const callExternalApi = async (transactionId, transactionType) => {
  try {
    // Fetch transaction status
    await fetchExtraCalling(transactionId, transactionType);
    if (keepCalling === true) {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      router.push("/payments/success");
    } else {
      console.log("Payment still pending...");
    }
  } catch (error) {
    console.error("Error calling external API:", error);
  }
};

function insertData() {
  const data = hashedData.value;
  hash.value = data.hash;
  merchantId.value = data.merchant_id;
  tranId.value = data.tran_id;
  amount.value = data.amount;
  reqTime.value = data.req_time;
  paymentOption.value = data.payment_option;
  returnUrl.value = data.return_url;
  cancelUrl.value = data.cancel_url;
  continueSuccessUrl.value = data.continue_success_url;
  returnParams.value = data.return_params;
}
// Generate form fields dynamically
const hiddenFields = computed(() => [
  { name: "req_time", value: reqTime.value },
  { name: "merchant_id", value: merchantId.value },
  { name: "tran_id", value: tranId.value },
  { name: "amount", value: amount.value },
  { name: "currency", value: "USD" },
  { name: "payment_option", value: paymentOption.value },
  { name: "return_url", value: returnUrl.value },
  { name: "cancel_url", value: cancelUrl.value },
  { name: "continue_success_url", value: continueSuccessUrl.value },
  { name: "return_params", value: returnParams.value },
  { name: "hash", value: hash.value },
]);

// Reusable card class
const cardClass = computed(() =>
  !sdkLoaded.value ? "pointer-events-none opacity-50" : "!border-none"
);
</script>

<template>
  <div>
    <div class="text-lg md:text-2xl text-center">
      You almost there.Please complete your payment order.
    </div>
    <br /><br />
    <div class="text-center font-semibold text-xl">
      <p>Total Price : {{ data.price }} USD</p>
    </div>
    <br /><br />
    <p class="text-center">Select Payment Method</p>
    <br />
    <div class="flex justify-center items-center flex-wrap">
      <div></div>
      <Card
        role="button"
        tabindex="0"
        @click="sdkLoaded && triggerCheckout(PAYMENT_METHODS.ABA_KHQR)"
        :class="cardClass"
        class="w-[500px] h-[130px]"
      >
        <template #content>
          <QRPayment />
        </template>
      </Card>
      <div></div>
    </div>

    <div class="flex justify-center items-center flex-wrap mt-4">
      <div></div>
      <Card
        role="button"
        tabindex="0"
        @click="sdkLoaded && triggerCheckout(PAYMENT_METHODS.CARD)"
        :class="cardClass"
        class="w-[500px] h-[130px]"
      >
        <template #content>
          <CardPayment />
        </template>
      </Card>
      <div></div>
    </div>
    <!-- Hidden Form required by ABA SDK -->
    <form
      ref="abaForm"
      method="POST"
      target="aba_webservice"
      :action="abaActionUrl"
      id="aba_merchant_request"
    >
      <input
        v-for="field in hiddenFields"
        :key="field.name"
        type="hidden"
        class="text-black"
        :name="field.name"
        :id="field.name"
        :value="field.value"
      />
    </form>

    <!-- Optional Loading Indicator -->
    <div v-if="isLoading" class="text-center mt-4 text-blue-600 font-semibold">
      Loading payment gateway...
    </div>
  </div>
</template>
