<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import Galleria from "primevue/galleria";

const props = defineProps<{
  data: {
    urlList: string[];
    groupType?: string;
    countryName?: string;
    locationName?: string;
    districtName?: string;
    autoType?: string;
    autoBranchName?: string;
    autoSubBranchName?: string;
    price?: number;
    currencySymbol?: string;
    currencyCode?: string;
    countryCode?: string;
    color?: string;
    year?: number;
    status?: string;
    bodyType?: string;
    taxType?: string;
    transmissionType?: string;
    autoCondition?: string;
    fuelType?: string;
    desc?: string;
    address?: string;
    position?: { lat: number; lng: number };
    nearBy?: any[];
  };
}>();

// Convert image URLs to Galleria format with reactive updates
const images = ref<any[]>([]);
const isLoading = ref(true);

// Watch for urlList changes
watch(
  () => props.data?.urlList,
  (newUrlList) => {
    if (newUrlList && newUrlList.length > 0) {
      images.value = newUrlList.map((url, index) => ({
        itemImageSrc: url,
        thumbnailImageSrc: url,
        alt: `Image ${index + 1}`,
        title: `Image ${index + 1}`,
      }));
    } else {
      images.value = [];
    }
    isLoading.value = false;
  },
  { immediate: true, deep: true }
);

const galleria = ref();
const activeIndex = ref(0);
const showThumbnails = ref(true);
const fullScreen = ref(false);

const fullScreenIcon = computed(
  () => `pi ${fullScreen.value ? "pi-window-minimize" : "pi-window-maximize"}`
);

const onThumbnailButtonClick = () => {
  showThumbnails.value = !showThumbnails.value;
};

const toggleFullScreen = () => {
  if (fullScreen.value) {
    closeFullScreen();
  } else {
    openFullScreen();
  }
};

const openFullScreen = () => {
  const elem = galleria.value?.$el;
  if (!elem) return;
  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
};

const closeFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen();
  } else if ((document as any).mozCancelFullScreen) {
    (document as any).mozCancelFullScreen();
  } else if ((document as any).msExitFullscreen) {
    (document as any).msExitFullscreen();
  }
};

const onFullScreenChange = () => {
  fullScreen.value = !!document.fullscreenElement;
};

const bindDocumentListeners = () => {
  document.addEventListener("fullscreenchange", onFullScreenChange);
  document.addEventListener("webkitfullscreenchange", onFullScreenChange);
  document.addEventListener("mozfullscreenchange", onFullScreenChange);
  document.addEventListener("msfullscreenchange", onFullScreenChange);
};

const unbindDocumentListeners = () => {
  document.removeEventListener("fullscreenchange", onFullScreenChange);
  document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
  document.removeEventListener("mozfullscreenchange", onFullScreenChange);
  document.removeEventListener("msfullscreenchange", onFullScreenChange);
};

// Add error handling for images
const handleImageError = (imageItem: any) => {
  console.warn(`Failed to load image: ${imageItem.itemImageSrc}`);
  imageItem.itemImageSrc =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDY0MCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2NDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMjAgMjAwQzM0MS4wNDYgMjAwIDM1OCAyMTYuOTU0IDM1OCAyMzhDMzU4IDI1OS4wNDYgMzQxLjA0NiAyNzYgMzIwIDI3NkMyOTguOTU0IDI3NiAyODIgMjU5LjA0NiAyODIgMjM4QzI4MiAyMTYuOTU0IDI5OC45NTQgMjAwIDMyMCAyMDBaIiBmaWxsPSIjOEU5MEEyIi8+CjxwYXRoIGQ9Ik0yNDAgMzIwTDI4MCAyNjBMMzIwIDMwMEwzNjAgMjYwTDQwMCAzMjBWMzYwSDI0MFYzMjBaIiBmaWxsPSIjOEU5MEEyIi8+Cjwvc3ZnPgo=";
  imageItem.thumbnailImageSrc =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAxOEMyNy43NjE0IDE4IDMwIDE1Ljc2MTQgMzAgMTNDMzAgMTAuMjM4NiAyNy43NjE0IDggMjUgOEMyMi4yMzg2IDggMjAgMTAuMjM4NiAyMCAxM0MyMCAxNS43NjE0IDIyLjIzODYgMTggMjUgMThaIiBmaWxsPSIjOEU5MEEyIi8+CjxwYXRoIGQ9Ik0xOC41IDMyTDIyIDI2TDI1IDI5TDI4IDI2TDMxLjUgMzJWMzZIMTguNVYzMloiIGZpbGw9IiM4RTlBQTIiLz4KPC9zdmc+Cg==";
};

onMounted(bindDocumentListeners);
onBeforeUnmount(unbindDocumentListeners);

const responsiveOptions = ref([
  { breakpoint: "1300px", numVisible: 4 },
  { breakpoint: "575px", numVisible: 1 },
]);

// Debugging
watch(
  images,
  (newImages) => {
    console.log("Images updated:", newImages?.length, "images");
  },
  { immediate: true }
);

watch(
  () => props.data?.urlList,
  (newUrlList) => {
    console.log("URL List updated:", newUrlList?.length, "urls");
  },
  { immediate: true }
);
</script>

<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <i class="pi pi-spin pi-spinner text-2xl mb-2"></i>
        <p>Loading images...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!images || images.length === 0"
      class="flex justify-center items-center h-64 bg-gray-100 rounded-lg"
    >
      <div class="text-center text-gray-500">
        <i class="pi pi-image text-3xl mb-2"></i>
        <p>No images available</p>
      </div>
    </div>

    <!-- Galleria -->
    <div v-else class="flex justify-center">
      <Galleria
        ref="galleria"
        v-model:activeIndex="activeIndex"
        :value="images"
        :numVisible="10"
        containerStyle="max-width: 640px"
        :showThumbnails="showThumbnails"
        :circular="true"
        :responsiveOptions="responsiveOptions"
        :pt="{
          root: {
            class: [{ 'flex flex-col': fullScreen }],
          },
          content: {
            class: ['relative', { 'flex-1 justify-center': fullScreen }],
          },
          thumbnails: 'absolute w-full left-0 bottom-0',
        }"
      >
        <template #item="slotProps">
          <img
            :src="slotProps.item.itemImageSrc"
            :alt="slotProps.item.alt"
            :style="[
              {
                width: !fullScreen ? '100%' : '',
                display: !fullScreen ? 'block' : '',
              },
            ]"
            style="height: 400px; object-fit: cover"
            @error="handleImageError(slotProps.item)"
          />
        </template>
        <template #thumbnail="slotProps">
          <div class="grid gap-4 justify-center">
            <img
              :src="slotProps.item.thumbnailImageSrc"
              :alt="slotProps.item.alt"
              style="
                display: block;
                height: 50px;
                width: 50px;
                object-fit: cover;
              "
              @error="handleImageError(slotProps.item)"
            />
          </div>
        </template>
        <template #footer>
          <div class="flex items-stretch bg-gray-900 text-white h-10">
            <button
              type="button"
              @click="onThumbnailButtonClick"
              class="bg-transparent border-none hover:bg-white/10 px-3"
            >
              <i class="pi pi-th-large"></i>
            </button>

            <span v-if="images?.length" class="flex items-center gap-4 ml-3">
              <span class="text-sm">
                {{ activeIndex + 1 }}/{{ images.length }}
              </span>
            </span>
            <button
              type="button"
              @click="toggleFullScreen"
              class="bg-transparent border-none hover:bg-white/10 px-3 ml-auto"
            >
              <i :class="fullScreenIcon"></i>
            </button>
          </div>
        </template>
      </Galleria>
    </div>

    <!-- Info Grid -->
    <p class="text-lg border-b border-gray-200" v-if="props.data.groupType">
      This auto is for - {{ props.data.groupType || "-" }}
    </p>
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 shadow-lg rounded-lg p-5"
    >
      <p class="text-sm text-gray-500">Country</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.countryName || "-" }}
      </p>
      <p class="text-sm text-gray-500">Location</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.locationName || "-" }}
      </p>
      <p class="text-sm text-gray-500">District</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.districtName || "-" }}
      </p>
      <p class="text-sm text-gray-500">Auto Type</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.autoType || "-" }}
      </p>
      <p class="text-sm text-gray-500">Auto Branch</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.autoBranchName || "-" }}
      </p>
      <p class="text-sm text-gray-500">Auto Sub Branch</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.autoSubBranchName || "-" }}
      </p>
      <p class="text-sm text-gray-500">Price</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{
          props.data.price
            ? `${props.data.price} ${props.data.currencySymbol} ( ${props.data.currencyCode} )`
            : "-"
        }}
      </p>

      <p class="text-sm text-gray-500">Color</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.color || "-" }}
      </p>
      <p class="text-sm text-gray-500">Year</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.year || "-" }}
      </p>
      <p class="text-sm text-gray-500">Status</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.status || "-" }}
      </p>
      <p class="text-sm text-gray-500">Body Type</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.bodyType || "-" }}
      </p>
      <p class="text-sm text-gray-500">Tax Type</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.taxType || "-" }}
      </p>
      <p class="text-sm text-gray-500">Transmission</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.transmissionType || "-" }}
      </p>
      <p class="text-sm text-gray-500">Condition</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.autoCondition || "-" }}
      </p>
      <p class="text-sm text-gray-500">Fuel Type</p>
      <p class="text-base font-medium text-gray-900 dark:text-gray-100">
        {{ props.data.fuelType || "-" }}
      </p>
    </div>

    <!-- Description -->
    <div v-if="props.data.desc" class="mt-4 shadow-lg rounded-lg p-2 md:p-5">
      <h3 class="font-semibold text-lg">Description</h3>
      <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line">
        {{ props.data.desc }}
      </p>
    </div>

    <!-- Address -->
    <div v-if="props.data.address" class="mt-4 shadow-lg rounded-lg p-2 md:p-5">
      <h3 class="font-semibold text-lg">Address</h3>
      <p class="text-gray-700 dark:text-gray-300">{{ props.data.address }}</p>
    </div>
  </div>
  <br />
</template>
