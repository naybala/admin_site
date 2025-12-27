<script setup lang="ts">
import Aba from "@/components/aba/Aba.vue";
import JCB from "@/components/aba/JCB.vue";
import Khqr from "@/components/aba/Khqr.vue";
import VisaWhite from "@/components/aba/VisaWhite.vue";
import MasterCardWhite from "@/components/aba/MasterCardWhite.vue";
import UnionPay from "@/components/aba/UnionPay.vue";
import Loader from "@/components/common/Loader.vue";
import Button from "primevue/button";
import { ref } from "vue";
import { useStoreMapPricePackage } from "@/composables/mapPrices/useStoreMapPricePackage";
import { useRouter } from "vue-router";

defineProps<{
  data: Array<{
    id: number;
    name: string;
    price: number;
    currency: string;
    duration: number;
    savings: string;
    features: string;
    popular: boolean;
  }>;
  loading: boolean;
}>();

const router = useRouter();
const { transactionData, fetchStoreMapPricePackage } =
  useStoreMapPricePackage();
const isPurchasing = ref(false);

const handlePurchase = async (pkg: any) => {
  try {
    isPurchasing.value = true;

    await fetchStoreMapPricePackage(pkg);

    const payload = {
      id: transactionData.value.id,
      price: transactionData.value.price,
    };

    const encrypted = btoa(JSON.stringify(payload));

    router.push(`/payments/prepare-hash-data/${encrypted}`);
  } catch (err) {
    console.error("Purchase failed:", err);
    alert("Something went wrong while processing your purchase.");
  } finally {
    isPurchasing.value = false;
  }
};
</script>

<template>
  <div>
    <div v-if="loading">
      <Loader />
    </div>
    <div v-else>
      <h1 class="text-center text-3xl mt-1 md:mt-16">
        Map Price Package Plans
      </h1>
      <br /><br /><br />

      <!--  Loop through packages -->
      <div class="flex flex-wrap justify-center items-center gap-5">
        <div
          v-for="pkg in data"
          :key="pkg.id"
          class="shadow-lg rounded-xl border border-gray-200 relative overflow-hidden transition-transform duration-300 hover:scale-105"
        >
          <!--  Most Popular Badge -->
          <div
            v-if="pkg.popular"
            class="absolute top-0 right-0 bg-brand-primary text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow-md"
          >
            ⭐ Most Popular
          </div>

          <div
            class="p-4 w-52 md:h-64 lg:w-80 lg:h-96 flex flex-col justify-between mt-5 md:mt-2"
          >
            <!-- Package Name -->
            <div>
              <div
                class="md:text-md lg:text-2xl font-semibold capitalize text-center"
              >
                {{ pkg.name }}
              </div>

              <!--  Price & Savings -->
              <div class="text-center mt-2">
                <div class="text-lg font-bold text-green-600">
                  {{ pkg.price }} {{ pkg.currency }}
                </div>
                <div class="text-xs text-red-500 font-semibold mt-1">
                  {{ pkg.savings == null ? "Save 0%" : pkg.savings }}
                </div>
              </div>

              <br />

              <!--  Features -->
              <ul class="list-disc pl-4 text-sm">
                <li class="mb-1">
                  Duration: {{ pkg.duration }} month<span
                    v-if="pkg.duration > 1"
                    >s</span
                  >
                </li>
                <li class="mb-1">{{ pkg.features }}</li>
                <li class="mb-1">Unlimited map price checking</li>
                <li class="mb-1">24/7 customer support</li>
              </ul>
            </div>

            <!--  Purchase Button -->
            <div class="flex justify-center mt-4">
              <Button
                :label="`Purchase ${pkg.price} $`"
                class="bg-brand-primary text-white text-sm px-6 py-2 rounded-md hover:bg-green-600 hover:scale-105 transition-all duration-300"
                @click="handlePurchase(pkg)"
              />
            </div>
          </div>
        </div>
      </div>

      <p class="mt-5 md:mt-10 text-center text-md">
        We accept payment methods below. Your subscription can cancel anytime!
      </p>

      <div class="flex flex-nowrap justify-center items-center gap-2 mt-2">
        <span class="text-xs">We Accept:</span>
        <Aba :width="50" :height="45" />
        <Khqr :width="45" :height="40" />
        <VisaWhite :width="45" :height="40" />
        <UnionPay :width="40" :height="35" />
        <MasterCardWhite :width="40" :height="35" />
        <JCB :width="40" :height="35" />
      </div>
    </div>
  </div>
</template>
