<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { userUpgradeForm } from "@composables/userProfiles/userUpgradeForm";
import SelectItem from "@/components/common/SelectItem.vue";
import { ref, watch } from "vue";
import { Button } from "primevue";
import Aba from "@/components/aba/Aba.vue";
import Khqr from "@/components/aba/Khqr.vue";
import VisaWhite from "@/components/aba/VisaWhite.vue";
import UnionPay from "@/components/aba/UnionPay.vue";
import MasterCardWhite from "@/components/aba/MasterCardWhite.vue";
import JCB from "@/components/aba/JCB.vue";

const {
  t,
  form,
  countries,
  locations,
  fetchPlans,
  plans,
  planInfo,
  userUpgradeAndOrderSave,
  orders,
} = userUpgradeForm();
const route = useRoute();
const router = useRouter();
const encryptedData: any = route.params.encrypted;
const data = JSON.parse(atob(encryptedData));
const choosePlanId = ref<string>("");

const choose = (id: any) => {
  choosePlanId.value = id;
};

const processPayment = async () => {
  if (choosePlanId.value) {
    await userUpgradeAndOrderSave(choosePlanId.value);
    if (orders) {
      const payload = {
        id: orders.value.id,
        price: orders.value.plan.finalPrice,
      };

      const encrypted = btoa(JSON.stringify(payload));

      router.push(`/payments/user-upgrade/prepare-hash-data/${encrypted}`);
    }
  }
};

watch(
  countries,
  (val) => {
    if (val.length > 0) {
      fetchPlans(data.phoneNumberPrefix, data.userType);
    }
  },
  { immediate: false }
);
</script>

<template>
  <div>
    <h5 class="text-center text-brand-primary font-semibold text-xl">
      You almost there!Please complete your order.
    </h5>
    <br /><br /><br />
    <div>
      <p class="text-lg text-center">
        Please describe where you are to be an agent
      </p>
      <br />
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg p-2 md:p-8 border border-gray-300"
      >
        <!-- Country -->
        <SelectItem
          id="phoneNumberPrefix"
          v-model="form.phoneNumberPrefix"
          :label="t('users.country')"
          :options="countries"
          :placeholder="t('users.selectCountry')"
          optionLabel="name"
          optionValue="code"
          :showFlag="true"
          :showClear="true"
        />

        <!-- Location  -->
        <SelectItem
          v-if="form.phoneNumberPrefix"
          id="locationId"
          v-model="form.locationId"
          :label="t('listings.location')"
          :options="locations"
          :placeholder="t('listings.selectLocation')"
          optionLabel="name"
          optionValue="id"
          :showFlag="false"
          :showClear="true"
        />
      </div>
      <br /><br />
      <div class="shadow-xl rounded-xl p-12">
        <div class="text-center">
          <p>Plan Name: {{ planInfo?.name }}</p>
          <p>Currency: {{ planInfo?.currency }}</p>
        </div>

        <div
          class="p-3 mt-3 flex flex-wrap justify-center lg:justify-between items-center gap-5 mx-auto lg:mx-28"
        >
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="shadow-lg border border-gray-800 rounded-lg p-5 cursor-pointer hover:bg-slate-300 dark:bg-slate-900"
            :class="
              choosePlanId == plan.id
                ? 'bg-slate-300 border border-green-500'
                : ''
            "
            @click="choose(plan.id)"
          >
            <p><strong>Duration:</strong> {{ plan.duration }} month(s)</p>
            <p><strong>Discount:</strong> {{ plan.discountPercent }}%</p>
            <p><strong>VAT:</strong> {{ plan.vatPercent }}%</p>
            <br />
            <p>
              <strong>Final Price:</strong> {{ plan.finalPrice }}
              {{ planInfo?.currency }}
            </p>
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
