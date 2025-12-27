<script lang="ts" setup>
import { Button } from "primevue";
import Aba from "@/components/aba/Aba.vue";
import Khqr from "@/components/aba/Khqr.vue";
import VisaWhite from "@/components/aba/VisaWhite.vue";
import UnionPay from "@/components/aba/UnionPay.vue";
import MasterCardWhite from "@/components/aba/MasterCardWhite.vue";
import JCB from "@/components/aba/JCB.vue";
import { useBoostPackages } from "@/composables/listings/useBoostPackages";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useBoostOrder } from "@/composables/listings/useBoostOrder";
import { useRouter } from "vue-router";

const router = useRouter();
const { plans, fetchBoostPackages } = useBoostPackages();
const { fetchBoostOrder, orderId } = useBoostOrder();
const choosePlanId = ref<number | null>(null);
const choosePlanPrice = ref<number | null>(null);
const route = useRoute();
const contentId = route.params.id;
const propertyType = route.params.type;

onMounted(() => {
  fetchBoostPackages();
});

const choose = (id: number, price: number) => {
  choosePlanId.value = id;
  choosePlanPrice.value = price;
  console.log(choosePlanId.value + " || " + choosePlanPrice.value);
};

const processPayment = async () => {
  const prepareData = {
    contentId: contentId,
    planId: choosePlanId.value,
    type: propertyType,
    transactionType: "Bank",
    isRenew: false,
    status: "pending",
  };
  await fetchBoostOrder(prepareData);
  await routeToPage(orderId.value, choosePlanPrice.value);
};

const routeToPage = async (orderId: any, price: any) => {
  const payload = {
    id: orderId,
    price: price,
  };
  const encrypted = btoa(JSON.stringify(payload));
  await router.push(`/payments/boost-property/${encrypted}`);
};
</script>

<template>
  <div>
    <h5 class="text-center text-brand-primary font-semibold text-xl">
      You almost there!Please complete your order.
    </h5>
    <br /><br />
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div></div>
      <div class="rounded-lg shadow-md p-5">
        <ul>
          <li>✅ Your property stick on top</li>
          <li>✅ Your property highligh on listing</li>
          <li>✅ Your property share to our telegram group</li>
          <li>✅ Your property share to our telegram channel</li>
          <li>✅ Your property share to our facebook page</li>
          <li>✅ Your property notification alert to app users</li>
          <li>✅ Your property show on our website</li>
        </ul>
      </div>
      <div></div>
    </div>
    <br />
    <div>
      <div class="shadow-xl rounded-xl p-12">
        <div
          class="p-3 mt-3 flex flex-wrap items-center gap-5 mx-auto lg:mx-28"
          :class="
            plans.length == 1
              ? 'justify-center'
              : 'justify-center md:justify-between'
          "
        >
          <div v-if="plans.length == 0" class="text-center">
            <p class="text-red-500">
              No plans available for your user's type and user's country. Please
              contact to Admin for more details.
            </p>
          </div>
          <div v-else v-for="plan in plans" :key="plan.id">
            <div
              v-if="plan.price != 0"
              class="shadow-lg border border-gray-800 rounded-lg p-5 cursor-pointer hover:bg-slate-300 dark:bg-slate-900"
              :class="
                choosePlanId == plan.id
                  ? 'bg-slate-300 border border-green-500  border-r-[10px] duration-300 ease-in-out'
                  : ''
              "
              @click="choose(plan.id, plan.price)"
            >
              <p><strong>Duration:</strong> {{ plan.duration }} month(s)</p>
              <p>
                <strong>Final Price:</strong> {{ plan.price }}
                {{ plan.currency }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-5 md:mt-7">
        <Button
          :disabled="choosePlanId ? false : true"
          label="Continue The Payment"
          @click="processPayment()"
          class="bg-green-400 text-white px-2 md:px-4 md:py-1 lg:px-10 lg:py-3 hover:scale-110 hover:bg-brand-primary transition-all duration-500"
        />
      </div>

      <div>
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
  </div>
</template>
