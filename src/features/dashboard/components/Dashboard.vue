<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import Card from "primevue/card";
import Chart from "primevue/chart";
import Skeleton from "primevue/skeleton";
import { useDashboard } from "../hooks/useDashboard";

const {
  t,
  isLoading,
  animatedUsers,
  animatedProperties,
  animatedAutos,
  userTypeChartDataRef,
  userTypeChartOptionsRef,
  propertyTypeChartDataRef,
  propertyTypeChartOptionsRef,
  autoTypeChartDataRef,
  autoTypeChartOptionsRef,
  salesChartData,
  salesChartOptions,
  userChartVisible,
  propertyChartVisible,
  autoChartVisible,
  userChartRef,
  propertyChartRef,
  autoChartRef,
  initialize,
  cleanup,
} = useDashboard();

onMounted(() => {
  initialize();
});

onUnmounted(() => {
  cleanup();
});
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">{{ t("sidebar.dashboard") }}</h1>

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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <div
          class="flex items-center justify-between dark:bg-gray-800 dark:text-gray-100 shadow-md px-10 py-5"
        >
          <div class="bg-gray-200 dark:bg-inherit shadow-lg rounded-lg p-2">
            <i class="pi pi-car" style="font-size: 2.5rem"></i>
          </div>
          <div>
            <p>Total Autos</p>
            <p class="text-4xl">
              {{ animatedAutos.toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <br />

      <!-- Pie Charts -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        <div
          ref="autoChartRef"
          class="card flex justify-center border p-1 rounded-lg shadow-xl"
        >
          <Chart
            v-if="autoChartVisible && autoTypeChartDataRef"
            type="pie"
            :data="autoTypeChartDataRef"
            :options="autoTypeChartOptionsRef"
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
