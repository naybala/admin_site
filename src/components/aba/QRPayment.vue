<template>
  <div
    class="flex items-center gap-1 md:gap-2 p-1 md:p-2 ps-2 md:ps-6 hover:rounded-lg cursor-pointer"
  >
    <AbaKhqr :width="70" :height="70" />
    <div class="ms-3">
      <p class="text-start text-xl font-semibold">ABA KHQR</p>
      <p class="text-start text-[0.75rem] md:text-normal">
        Scan to pay with any banking app
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import AbaKhqr from "./AbaKhqr.vue";
</script>
