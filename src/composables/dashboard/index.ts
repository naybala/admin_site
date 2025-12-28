import { ref } from "vue";
import { apiRequest } from "@/composables/common/useApi";

export function useDashboardData() {
  const loading = ref(false);

  // Refs for general and user-specific dashboard data
  const dashboardData = ref<any>(null);
  const myDashboardData = ref<any>(null);

  /**
   * Fetch dashboard statistics
   * @param getMyData boolean — whether to fetch user-specific data
   */
  const fetchDashboardStats = async (getMyData = false) => {
    loading.value = true;
    try {
      const url = getMyData ? "/dashboard/get-my-data" : "/dashboard/get-data";

      const response: any = await apiRequest(url, {
        method: "GET",
      });

      const data = response?.data?.data;
      if (!data) {
        console.warn("No data returned from", url);
        return;
      }

      // Stringify once for comparison and storage
      const dataString = JSON.stringify(data);

      if (getMyData) {
        myDashboardData.value = data;

        const prevData = sessionStorage.getItem("myDashboardData");
        if (prevData !== dataString) {
          sessionStorage.setItem("myDashboardData", dataString);
        }
      } else {
        dashboardData.value = data;

        const prevData = sessionStorage.getItem("dashboardData");
        if (prevData !== dataString) {
          sessionStorage.setItem("dashboardData", dataString);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Load cached data from sessionStorage if available
   */
  const loadCachedData = () => {
    const cachedGeneral = sessionStorage.getItem("dashboardData");
    const cachedMyData = sessionStorage.getItem("myDashboardData");

    if (cachedGeneral) {
      try {
        dashboardData.value = JSON.parse(cachedGeneral);
      } catch (e) {
        console.warn("Failed to parse cached general data");
      }
    }

    if (cachedMyData) {
      try {
        myDashboardData.value = JSON.parse(cachedMyData);
      } catch (e) {
        console.warn("Failed to parse cached personal data");
      }
    }

    // Optional debug: check if they’re identical
    if (cachedGeneral && cachedMyData && cachedGeneral === cachedMyData) {
      console.warn(" Cached general and personal dashboard data are identical");
    }
  };

  // Load cached data on composable init
  loadCachedData();

  return {
    loading,
    dashboardData,
    myDashboardData,
    fetchDashboardStats,
  };
}
