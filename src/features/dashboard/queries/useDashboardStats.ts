import { useQuery } from "@tanstack/vue-query";
import { dashboardApi } from "../api/dashboard.api";

export function useDashboardStats(getMyData = false) {
  return useQuery({
    queryKey: ["dashboard", getMyData ? "my-data" : "data"],
    queryFn: () =>
      getMyData ? dashboardApi.getMyData() : dashboardApi.getData(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
