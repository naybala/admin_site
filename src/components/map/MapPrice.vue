<template>
  <div class="map-wrapper">
    <div
      ref="mapContainer"
      class="map-container w-full h-[500px] md:h-[600px] lg:h-[700px]"
    ></div>
    <button class="locate-btn" @click="showUserLocation">📍</button>
  </div>
</template>

<script setup lang="ts">
import { useMapPriceData } from "@/composables/mapPrices/useMapPriceData";

const props = defineProps<{
  initialPosition?: { lat: number; lng: number } | null;
}>();
const emit = defineEmits<{
  (e: "update:position", position: { lat: number; lng: number }): void;
}>();

const { mapContainer, showUserLocation } = useMapPriceData(props, emit);
</script>

<style scoped>
.map-wrapper {
  position: relative;
}
.map-container {
  border: 1px solid #ccc;
  border-radius: 4px;
}
.locate-btn {
  position: absolute;
  bottom: 150px;
  right: 14px;
  background-color: white;
  border: none;
  border-radius: 0.6rem;
  padding: 8px;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  font-weight: 500;
}
.locate-btn:hover {
  background-color: #f0f0f0;
}
</style>
