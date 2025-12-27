<template>
  <div
    ref="scrollContainer"
    class="border border-gray-300 rounded overflow-y-auto"
    :style="{
      height: '500px',
      position: 'relative',
    }"
  >
    <div :style="{ height: totalHeight + 'px', position: 'relative' }">
      <BaseTable
        :columns="columns"
        :items="visibleItems"
        :actions="actions"
        :userTypes="userTypes"
        :countries="countries"
        :ownLicenses="ownLicenses"
        :style="{
          position: 'absolute',
          top: startOffset + 'px',
          left: 0,
          right: 0,
          width: '100%',
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import BaseTable from "@/components/common/BaseTable.vue";

const props = defineProps<{
  items: any[];
  columns: Array<{ label: string; field: string; isImage?: boolean }>;
  actions?: Array<any>;
  userTypes?: Array<any>;
  countries?: Array<any>;
  ownLicenses?: Array<any>;
}>();

// Virtual scroll setup
const scrollContainer = ref<HTMLElement | null>(null);
const rowHeight = 48;
const buffer = 5;
const scrollTop = ref(0);
const containerHeight = 480;

const totalHeight = computed(() => props.items.length * rowHeight);
const visibleCount = computed(() => Math.ceil(containerHeight / rowHeight));

const startIndex = computed(() =>
  Math.min(
    Math.floor(scrollTop.value / rowHeight),
    Math.max(0, props.items.length - visibleCount.value)
  )
);

const visibleItems = computed(() =>
  props.items.slice(
    startIndex.value,
    startIndex.value + visibleCount.value + buffer
  )
);

const startOffset = computed(() => startIndex.value * rowHeight);

function onScroll() {
  if (scrollContainer.value) {
    scrollTop.value = scrollContainer.value.scrollTop;
  }
}

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", onScroll);
  }
});

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", onScroll);
  }
});
</script>

<style scoped>
table tr {
  height: 50px;
  box-sizing: border-box;
}
</style>
