import { apiRequest } from "@/composables/common/useApi";

export const authApi = {
  login: (data: { username: string; password: string }) =>
    apiRequest<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest<any>("/auth/logout", {
      method: "POST",
    }),

  sendOtp: (data: any) =>
    apiRequest<any>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
