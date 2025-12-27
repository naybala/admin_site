<template>
  <div>
    <br />
    <div v-if="loading">
      <Loader />
    </div>
    <div v-else>
      <div v-if="isExist == false">
        <div v-if="userData.phoneNumberPrefix != '+855'">
          <h5 class="text-center text-3xl mt-1 md:mt-16">Map Price Feature</h5>
          <br /><br />
          <MapPriceNotValid />
          <br /><br />
          <p class="text-red-500 text-center">
            * This Feature is available in 🇰🇭 Cambodia 🇰🇭.Currently we don't
            have data for other countries.Stay tune for update.
          </p>
          <br />
        </div>
        <div v-else>
          <h5 class="fw-bond text-2xl"></h5>
          <Packages :data="packages" :loading="pkgLoading" />
        </div>
      </div>

      <div v-else>
        <h5 class="fw-bond text-2xl">Map Price</h5>
        <div class="flex justify-center items-center gap-10">
          <p>Package Name : {{ isExist.packageName }}</p>
          <p>Start Date : {{ isExist.startDate }}</p>
          <p>End Date : {{ isExist.endDate }}</p>
        </div>
        <br />
        <MapPrice
          :initialPosition="position"
          @update:position="updatePosition"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MapPrice from "@/components/map/MapPrice.vue";
import Packages from "./Packages.vue";
import { useMapPricePackage } from "@/composables/mapPrices/useMapPricePackage";
import { useMapPriceAuth } from "@/composables/mapPrices/useMapPriceAuth";
import Loader from "@/components/common/Loader.vue";
import { useAuthStore } from "@/stores/auth";
import { useAuthUserSocket } from "@/composables/realTimeSockets/useAuthUserSocket";
import MapPriceNotValid from "@/components/copy/MapPriceNotValid.vue";

const authStore = useAuthStore();

const position = ref({ lat: 11.5564, lng: 104.9282 });
const { packages, pkgLoading, fetchMapPricePackage } = useMapPricePackage();
const { isExist, loading, fetchMapPriceAuth } = useMapPriceAuth();
const { userData, fetchUserData } = useAuthUserSocket();

const updatePosition = (coords: { lat: number; lng: number }) => {
  position.value = coords;
};

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      fetchUserData({ id: authStore.userId }),
      fetchMapPriceAuth(),
      fetchMapPricePackage(),
    ]);
  } finally {
    loading.value = false;
  }
});
</script>
