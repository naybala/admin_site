import type { AuthResponse } from "@customTypes/auth";
import { ref } from "vue";
import { useAuthStore } from "@stores/auth";
import { apiRequest } from "@composables/common/useApi";
import { usePermissionStore } from "@stores/permission";

export default function useAuthData() {
  const success = ref(false);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();

  const fetchAuthData = async (data: {
    username: string;
    password: string;
  }): Promise<AuthResponse | null> => {
    loading.value = true;
    error.value = null;
    success.value = false;

    try {
      const responseData = await apiRequest<AuthResponse>(
        "api/v1/web/auth/login",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      const userData = responseData.data;
      permissionStore.clearPermissions();
      permissionStore.setPermissions(userData?.user?.permissions);

      // Use the updated `setAuthData` method
      authStore.setAuthData({
        token: userData.token,
        userId: userData.user.id,
        name: userData.user.name,
        roleId: userData.user.roleId,
      });

      success.value = true;
      return responseData;
    } catch (err: any) {
      error.value = err.message || "An error occurred";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const callToLogoutApi = async () => {
    try {
      await apiRequest<any>("api/v1/web/auth/logout", {
        method: "POST",
      });
      sessionStorage.removeItem("authData");
      sessionStorage.removeItem("myDashboardData");
      sessionStorage.removeItem("dashboardData");
    } catch (err: any) {
      error.value = err.message || "An error occurred";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const otpRequest = async (data: any) => {
    try {
      await apiRequest<any>("api/v1/web/auth/send-otp", {
        method: "POST",
        body: JSON.stringify(data),
      });
      sessionStorage.removeItem("authData");
      sessionStorage.removeItem("myDashboardData");
      sessionStorage.removeItem("dashboardData");
    } catch (err: any) {
      error.value = err.message || "An error occurred";
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    success,
    loading,
    error,
    fetchAuthData,
    callToLogoutApi,
    otpRequest,
  };
}
