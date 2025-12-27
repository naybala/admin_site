<template>
  <div
    class="flex items-center gap-1 md:gap-2 p-1 md:p-2 ps-2 md:ps-6 hover:rounded-lg cursor-pointer"
  >
    <MasterCard :width="70" :height="70" />
    <div class="ms-3">
      <p class="text-start text-xl font-semibold">Credit/Debit Card</p>
      <p class="flex justify-start gap-2">
        <Visa />
        <SmallMaster />
        <JCB />
        <UnionPay />
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import MasterCard from "./MasterCard.vue";
import Visa from "./Visa.vue";
import SmallMaster from "./SmallMaster.vue";
import JCB from "./JCB.vue";
import UnionPay from "./UnionPay.vue";
</script>
