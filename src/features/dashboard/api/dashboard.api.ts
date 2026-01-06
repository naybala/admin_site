import { apiRequest } from "@/composables/common/useApi";

export const dashboardApi = {
  getData: () =>
    apiRequest<any>("/dashboard/get-data", {
      method: "GET",
    }),

  getMyData: () =>
    apiRequest<any>("/dashboard/get-my-data", {
      method: "GET",
    }),
};
