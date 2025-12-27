import { ref } from "vue";
import { apiRequest } from "@composables/common/useApi";
import { useAuthStore } from "@/stores/auth";
import { usePermissionStore } from "@/stores/permission";

export default function useOtp() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const smsCode = ref<any>("");
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();

  const otpRequest = async (data: any) => {
    try {
      const response: any = await apiRequest<any>("api/v1/web/auth/send-otp", {
        method: "POST",
        body: JSON.stringify(data),
      });
      smsCode.value = response.data || "";
    } catch (err: any) {
      error.value = err.message || "An error occurred";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const login = async (data: any) => {
    try {
      const responseData: any = await apiRequest<any>(
        "api/v1/web/auth/phone-no-login",
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
    } catch (err: any) {
      error.value = err.message || "An error occurred";
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    smsCode,
    loading,
    login,
    error,
    otpRequest,
  };
}
