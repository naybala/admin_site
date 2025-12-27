<template>
  <div class="text-center bg-gray-300 pt-5 pb-2 px-2 rounded-lg mt-5 md:mt-10">
    <div v-if="orderCancelLoading">
      <Loader />
    </div>
    <div v-else>
      <img :src="OrderSvg" alt="" class="mx-auto" />
      <div class="">This is order cancellation page</div>
      <div>Order Id : xxxxxxxxxxx</div>
      <br /><br />
      <div class="flex justify-center align-middle gap-2">
        <button
          class="bg-brand-primary text-white p-1 rounded-lg px-4 border border-white"
          @click="cancelOrder"
        >
          <span class="rounded-lg">Go to dashboard</span>
        </button>
      </div>
      <br /><br />
    </div>
  </div>
</template>

<script setup lang="ts">
import OrderSvg from "../../../src/assets/order.svg";
import { useRoute, useRouter } from "vue-router";
import Loader from "@/components/common/Loader.vue";
import { useStoreUserUpgrade } from "@/composables/userUpgrade/useStoreUserUpgrade";

const router = useRouter();
const route = useRoute();
const decryptOrderId: any = route?.params?.id;
const transactionId: string = JSON.parse(atob(decryptOrderId));
const { fetchOrderCancel, orderCancelData, orderCancelLoading } =
  useStoreUserUpgrade();
const cancelOrder = async () => {
  await fetchOrderCancel(transactionId);
  if (orderCancelData) {
    router.push("/dashboard");
  }
};
</script>
