<script setup lang="ts">
import Aba from "@/components/aba/Aba.vue";
import JCB from "@/components/aba/JCB.vue";
import Khqr from "@/components/aba/Khqr.vue";
import UnionPay from "@/components/aba/UnionPay.vue";
import { Button } from "primevue";
import { usePackage } from "@/composables/userProfiles/usePackage";
import { onMounted } from "vue";
import Loader from "@/components/common/Loader.vue";
import { useAuthStore } from "@/stores/auth";
import VisaWhite from "@/components/aba/VisaWhite.vue";
import MasterCardWhite from "@/components/aba/MasterCardWhite.vue";
import { useRouter } from "vue-router";
import { useUserSubscription } from "@/composables/userSubScriptions/myCurrentSubscription";

const authStore = useAuthStore();
const router = useRouter();

const { fetchUserData, loading, userData } = usePackage();
const { startDate, endDate, fetchUserSubscription } = useUserSubscription();

onMounted(async () => {
  await fetchUserData(authStore?.userId);
  if (userData.value.userType != "Member") {
    await fetchUserSubscription();
  }
});

const clickUpgradeToAgent = () => {
  const payload = {
    userType: "Agent",
    phoneNumberPrefix: userData.value.phoneNumberPrefix,
  };
  const encrypted = btoa(JSON.stringify(payload));
  router.push(`/payments/user-upgrade/${encrypted}`);
};

const clickUpgradeToAgency = () => {
  const payload = {
    userType: "Agency",
    phoneNumberPrefix: userData.value.phoneNumberPrefix,
  };
  const encrypted = btoa(JSON.stringify(payload));
  router.push(`/payments/user-upgrade/${encrypted}`);
};
</script>

<template>
  <div>
    <div v-if="loading" class="">
      <Loader />
    </div>

    <div v-else>
      <div>
        <h1 class="text-center text-3xl mt-1 md:mt-16">Package Plans</h1>
        <br /><br /><br />
        <div class="flex flex-wrap justify-center items-center gap-5">
          <!-- Card One -->
          <div
            class="shadow-lg rounded-xl border border-gray-200"
            v-if="userData.userType == 'Member'"
          >
            <div class="p-4 md:w-52 md:h-64 lg:w-80 lg:h-96">
              <div class="md:text-md lg:text-2xl">Free Member</div>
              <br />
              <ul class="list-disc pl-4">
                <li class="m-0 text-sm mb-2">Post 3 Listings</li>
                <li class="m-0 text-sm mb-2">Find Buyers</li>
                <li class="m-0 text-sm mb-2">
                  Unlimited login count Dashboard
                </li>
                <li class="m-0 text-sm">GPS Measurement</li>
              </ul>
            </div>
            <p class="m-0 text-center md:text-md lg:text-2xl md:mb-1 lg:mb-4">
              Free
            </p>
            <br />
            <div class="flex justify-center">
              <Button
                v-if="userData.userType == 'Member'"
                label="Current Plan"
                class="bg-green-400 text-white md:px-4 cursor-default md:py-1 lg:px-10 lg:py-3 hover:scale-110 hover:bg-brand-primary transition-all duration-500"
              />

              <Button
                v-else
                label="Upgrade"
                class="bg-green-400 text-white md:px-4 md:py-1 lg:px-10 lg:py-3 hover:scale-110 hover:bg-brand-primary transition-all duration-500"
              />
            </div>
            <br />
          </div>
          <!-- Card Two -->
          <div class="shadow-lg rounded-xl border border-gray-200">
            <div
              v-if="userData?.userType == 'Agent'"
              class="flex justify-between flex-wrap p-2 bg-brand-primary rounded-t-xl"
            >
              <p class="m-0 text-sm text-white">Start date ({{ startDate }})</p>
              <p class="m-0 text-sm text-white ms-2">
                End date ({{ endDate }})
              </p>
            </div>
            <div class="p-4 md:w-52 md:h-64 lg:w-80 lg:h-96">
              <div class="md:text-md lg:text-2xl">Estate Agent</div>
              <br />
              <ul class="list-disc pl-4">
                <li class="m-0 text-sm mb-2">Unlimited Post Listings</li>
                <li class="m-0 text-sm mb-2">
                  Unlimited auto Telegram posting
                </li>
                <li class="m-0 text-sm mb-2">
                  Unlimited auto Facebook posting
                </li>
                <li class="m-0 text-sm mb-2">Personal Profile Page</li>
                <li class="m-0 text-sm mb-2">Find Buyers</li>
                <li class="m-0 text-sm mb-2">GPS Measurement</li>
                <li class="m-0 text-sm mb-2">Reports</li>
                <li class="m-0 text-sm mb-2">Matching</li>
              </ul>
            </div>
            <p class="m-0 text-center md:text-md lg:text-2xl mb-4">
              $10/Monthly
            </p>
            <br />
            <div class="flex justify-center">
              <Button
                :disabled="userData?.userType == 'Agent'"
                @click="clickUpgradeToAgent"
                :label="
                  userData?.userType == 'Agent' ? 'Current Plan' : 'Upgrade'
                "
                class="bg-green-400 text-white md:px-4 md:py-1 lg:px-10 lg:py-3"
                :class="
                  userData?.userType !== 'Member'
                    ? 'bg-gray-400 cursor-not-allowed '
                    : 'hover:scale-110 hover:bg-brand-primary transition-all duration-500'
                "
              />
            </div>

            <br />
          </div>

          <!-- Card Three -->
          <div class="shadow-lg rounded-xl border border-gray-200">
            <div class="p-4 md:w-52 md:h-64 lg:w-80 lg:h-96">
              <div class="md:text-md lg:text-2xl">Estate Company</div>
              <br />
              <ul class="list-disc pl-4">
                <li class="m-0 text-sm mb-2">Unlimited Post Listings</li>
                <li class="m-0 text-sm mb-2">
                  Unlimited auto Telegram posting
                </li>
                <li class="m-0 text-sm mb-2">
                  Unlimited auto Facebook posting
                </li>
                <li class="m-0 text-sm mb-2">Personal Profile Page</li>
                <li class="m-0 text-sm mb-2">Manage Own Agents</li>
                <li class="m-0 text-sm mb-2">Find Buyers</li>
                <li class="m-0 text-sm mb-2">GPS Measurement</li>
                <li class="m-0 text-sm mb-2">Reports</li>
                <li class="m-0 text-sm mb-2">Matching</li>
              </ul>
            </div>
            <p class="m-0 text-center md:text-md lg:text-2xl mb-4">
              $50/Monthly
            </p>
            <br />
            <div class="flex justify-center">
              <Button
                :disabled="userData?.userType == 'Agency'"
                @click="clickUpgradeToAgency"
                :label="
                  userData?.userType == 'Agency' ? 'Current Plan' : 'Upgrade'
                "
                class="bg-green-400 text-white md:px-4 md:py-1 lg:px-10 lg:py-3"
              />
            </div>
            <br />
          </div>
        </div>

        <p class="mt-5 md:mt-10 text-center text-md">
          We accept payment methods below.Your subscription can cancel anytime!
        </p>
        <div class="flex flex-nowrap justify-center items-center gap-2 mt-2">
          <span class="text-xs">We Accept : </span>
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
