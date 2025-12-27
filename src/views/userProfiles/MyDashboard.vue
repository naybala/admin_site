<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { io } from "socket.io-client";
import Card from "primevue/card";
import Chart from "primevue/chart";
import Skeleton from "primevue/skeleton";
import { useCountUp } from "@/composables/common/numberAnimation";
import { useDashboardData } from "@/composables/dashboard";
import { useDebounceFn, useIntersectionObserver } from "@vueuse/core";

// I18n
const { t } = useI18n();

// Socket
const socketUrl =
  import.meta.env.VITE_SOCKET_LOCAL_URL ?? "http://localhost:3000";
const socket = io(socketUrl);

// Dashboard state
const totalUsers = ref(0);
const totalProperties = ref(0);

// Count-up animation
const animatedUsers = useCountUp(totalUsers, 800);
const animatedProperties = useCountUp(totalProperties, 800);

// Chart state
const userTypeChartDataRef = ref();
const userTypeChartOptionsRef = ref();
const propertyTypeChartDataRef = ref();
const propertyTypeChartOptionsRef = ref();
const salesChartData = ref<any>({ labels: [], datasets: [] });
const salesChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 200,
};

// Loading state
const isLoading = ref(true);

// Data composable
const { loading, myDashboardData, fetchDashboardStats } = useDashboardData();

// Helper: Generate chart colors
const getChartColors = (count: number, colorPrefix = "--p") => {
  const style = getComputedStyle(document.documentElement);
  const colorVars = [
    "pink",
    "gray",
    "orange",
    "purple",
    "cyan",
    "red",
    "green",
    "yellow",
    "blue",
    "indigo",
    "violet",
    "brown",
    "teal",
  ];
  return Array.from({ length: count }).map((_, i) =>
    style.getPropertyValue(
      `${colorPrefix}-${colorVars[i % colorVars.length]}-400`
    )
  );
};

// Pie chart data generator
const generatePieChartData = (
  dataMap: Record<string, number>,
  label: string
) => {
  const labels = Object.keys(dataMap);
  const values = Object.values(dataMap);
  return {
    labels,
    datasets: [
      {
        label,
        data: values,
        backgroundColor: getChartColors(labels.length),
        hoverBackgroundColor: getChartColors(labels.length),
      },
    ],
  };
};

const generatePieChartOptions = () => {
  const style = getComputedStyle(document.documentElement);
  return {
    plugins: {
      legend: {
        labels: {
          color: style.getPropertyValue("--p-text-color"),
          usePointStyle: true,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };
};

// Update dashboard data (API or socket)
const updateDashboardStats = (data: any) => {
  totalUsers.value = data.totalUsers ?? 0;
  totalProperties.value = data.totalProperties ?? 0;

  userTypeChartDataRef.value = generatePieChartData(
    data.variousDataForUserType,
    "User Types"
  );
  userTypeChartOptionsRef.value = generatePieChartOptions();

  propertyTypeChartDataRef.value = generatePieChartData(
    data.variousDataForPropertyType,
    "Property Types"
  );
  propertyTypeChartOptionsRef.value = generatePieChartOptions();

  salesChartData.value = {
    labels: data.currentMonth ?? [],
    datasets: [
      {
        label: "Users",
        data: data.monthlyUserCounts ?? [],
        fill: false,
        borderColor: "#42A5F5",
        tension: 0.4,
      },
      {
        label: "Properties",
        data: data.monthlyPropertyCounts ?? [],
        fill: false,
        borderColor: "#F24236",
        tension: 0.4,
      },
    ],
  };
};

// Debounce socket updates
const debouncedUpdate = useDebounceFn((data: any) => {
  updateDashboardStats(data.data);
  sessionStorage.setItem("myDashboardData", JSON.stringify(data.data));
}, 500);

// On mount
onMounted(async () => {
  const cached = sessionStorage.getItem("myDashboardData");
  if (cached) {
    const cachedData = JSON.parse(cached);
    myDashboardData.value = cachedData;
    updateDashboardStats(cachedData);
    isLoading.value = false;
  } else {
    await fetchDashboardStats(true);
    if (myDashboardData.value) {
      updateDashboardStats(myDashboardData.value);
      sessionStorage.setItem(
        "myDashboardData",
        JSON.stringify(myDashboardData.value)
      );
    }
  }

  socket.on("dashboard:update", debouncedUpdate);
});

onUnmounted(() => {
  socket.off("dashboard:update", debouncedUpdate);
});

// Watch for loading
watch(
  () => loading.value,
  (val) => (isLoading.value = val)
);

// Lazy loading charts (optional performance boost)
const userChartVisible = ref(false);
const propertyChartVisible = ref(false);
const autoChartVisible = ref(false);
const userChartRef = ref();
const propertyChartRef = ref();
const autoChartRef = ref();

useIntersectionObserver(userChartRef, ([entry]) => {
  if (entry.isIntersecting) userChartVisible.value = true;
});
useIntersectionObserver(propertyChartRef, ([entry]) => {
  if (entry.isIntersecting) propertyChartVisible.value = true;
});
useIntersectionObserver(autoChartRef, ([entry]) => {
  if (entry.isIntersecting) autoChartVisible.value = true;
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">{{ t("sidebar.myDashboard") }}</h1>

    <!-- Loading state -->
    <div v-if="isLoading">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton height="120px" />
        <Skeleton height="120px" />
        <Skeleton height="120px" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Skeleton height="300px" />
        <Skeleton height="300px" />
        <Skeleton height="300px" />
      </div>
    </div>

    <!-- Dashboard content -->
    <template v-else>
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div
          class="flex items-center justify-between dark:bg-gray-800 dark:text-gray-100 shadow-md px-10 py-5"
        >
          <div class="bg-gray-200 dark:bg-inherit shadow-lg rounded-lg p-2">
            <i class="pi pi-user" style="font-size: 2.5rem"></i>
          </div>
          <div>
            <p>Total Users</p>
            <p class="text-4xl">
              {{ animatedUsers.toLocaleString() }}
            </p>
          </div>
        </div>

        <div
          class="flex items-center justify-between dark:bg-gray-800 dark:text-gray-100 shadow-md px-10 py-5"
        >
          <div class="bg-gray-200 dark:bg-inherit shadow-lg rounded-lg p-2">
            <i class="pi pi-home" style="font-size: 2.5rem"></i>
          </div>
          <div>
            <p>Total Properties</p>
            <p class="text-4xl">
              {{ animatedProperties.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <br />

      <!-- Pie Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div
          ref="userChartRef"
          class="card flex justify-center border p-1 rounded-lg shadow-xl"
        >
          <Chart
            v-if="userChartVisible && userTypeChartDataRef"
            type="pie"
            :data="userTypeChartDataRef"
            :options="userTypeChartOptionsRef"
            class="w-full lg:w-[20rem]"
          />
        </div>

        <div
          ref="propertyChartRef"
          class="card flex justify-center border p-1 rounded-lg shadow-xl"
        >
          <Chart
            v-if="propertyChartVisible && propertyTypeChartDataRef"
            type="doughnut"
            :data="propertyTypeChartDataRef"
            :options="propertyTypeChartOptionsRef"
            class="w-full lg:w-[20rem]"
          />
        </div>
      </div>

      <!-- Line Chart -->
      <div class="mt-8">
        <Card class="dark:bg-gray-800 dark:text-gray-100 shadow-md">
          <template #title>
            Total Users, Properties, and Autos by months
          </template>
          <template #content>
            <Chart
              type="line"
              :data="salesChartData"
              :options="salesChartOptions"
              class="h-80"
            />
          </template>
        </Card>
      </div>
    </template>
  </div>
</template>

<style scoped>
.card {
  min-height: 300px;
}
</style>
