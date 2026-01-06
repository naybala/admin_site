import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { io } from "socket.io-client";
import { useDashboardStats } from "../queries/useDashboardStats";
import { useCountUp } from "@/composables/common/numberAnimation";
import { useDebounceFn, useIntersectionObserver } from "@vueuse/core";

export function useDashboard(getMyData = false) {
  const { t } = useI18n();

  const socketUrl =
    import.meta.env.VITE_SOCKET_LOCAL_URL ?? "http://localhost:3000";
  const socket = io(socketUrl);

  const { data, isLoading } = useDashboardStats(getMyData);

  const totalUsers = ref(0);
  const totalProperties = ref(0);
  const totalAutos = ref(0);

  const animatedUsers = useCountUp(totalUsers, 800);
  const animatedProperties = useCountUp(totalProperties, 800);
  const animatedAutos = useCountUp(totalAutos, 800);

  const autoTypeChartDataRef = ref();
  const autoTypeChartOptionsRef = ref();
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

  const userChartVisible = ref(false);
  const propertyChartVisible = ref(false);
  const autoChartVisible = ref(false);
  const userChartRef = ref();
  const propertyChartRef = ref();
  const autoChartRef = ref();

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

  const updateDashboardStats = (dashboardData: any) => {
    totalUsers.value = dashboardData.totalUsers ?? 0;
    totalProperties.value = dashboardData.totalProperties ?? 0;
    totalAutos.value = dashboardData.totalAutos ?? 0;

    // Use structuredClone to create non-reactive copies for charts
    userTypeChartDataRef.value = structuredClone(
      generatePieChartData(dashboardData.variousDataForUserType, "User Types")
    );
    userTypeChartOptionsRef.value = generatePieChartOptions();

    propertyTypeChartDataRef.value = structuredClone(
      generatePieChartData(
        dashboardData.variousDataForPropertyType,
        "Property Types"
      )
    );
    propertyTypeChartOptionsRef.value = generatePieChartOptions();

    autoTypeChartDataRef.value = structuredClone(
      generatePieChartData(dashboardData.variousDataForAutoType, "Auto Types")
    );
    autoTypeChartOptionsRef.value = generatePieChartOptions();

    salesChartData.value = structuredClone({
      labels: dashboardData.currentMonth ?? [],
      datasets: [
        {
          label: "Users",
          data: dashboardData.monthlyUserCounts ?? [],
          fill: false,
          borderColor: "#42A5F5",
          tension: 0.4,
        },
        {
          label: "Properties",
          data: dashboardData.monthlyPropertyCounts ?? [],
          fill: false,
          borderColor: "#F24236",
          tension: 0.4,
        },
        {
          label: "Autos",
          data: dashboardData.monthlyAutoCounts ?? [],
          fill: false,
          borderColor: "#66BB6A",
          tension: 0.4,
        },
      ],
    });
  };

  const debouncedUpdate = useDebounceFn((socketData: any) => {
    updateDashboardStats(socketData.data);
    sessionStorage.setItem("dashboardData", JSON.stringify(socketData.data));
  }, 500);

  const initialize = () => {
    const cached = sessionStorage.getItem("dashboardData");
    if (cached) {
      const cachedData = JSON.parse(cached);
      updateDashboardStats(cachedData);
    } else if (data.value?.data?.data) {
      updateDashboardStats(data.value.data.data);
      sessionStorage.setItem(
        "dashboardData",
        JSON.stringify(data.value.data.data)
      );
    }

    socket.on("dashboard:update", debouncedUpdate);
  };

  const cleanup = () => {
    socket.off("dashboard:update", debouncedUpdate);
  };

  watch(data, (newData) => {
    if (newData?.data?.data) {
      updateDashboardStats(newData.data.data);
      sessionStorage.setItem(
        "dashboardData",
        JSON.stringify(newData.data.data)
      );
    }
  });

  useIntersectionObserver(userChartRef, ([entry]) => {
    if (entry.isIntersecting) userChartVisible.value = true;
  });
  useIntersectionObserver(propertyChartRef, ([entry]) => {
    if (entry.isIntersecting) propertyChartVisible.value = true;
  });
  useIntersectionObserver(autoChartRef, ([entry]) => {
    if (entry.isIntersecting) autoChartVisible.value = true;
  });

  return {
    t,
    isLoading,
    totalUsers,
    totalProperties,
    totalAutos,
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
  };
}
