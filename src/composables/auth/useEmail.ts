import { ref } from "vue";
import { apiRequest } from "@composables/common/useApi";
import { useAuthStore } from "@/stores/auth";
import { usePermissionStore } from "@/stores/permission";

export default function useOtp() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();

  const emailLogin = async (data: any) => {
    try {
      const responseData: any = await apiRequest<any>(
        "api/v1/web/auth/email-login",
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
      return responseData;
    } catch (err: any) {
      error.value = err.message || "An error occurred";
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    emailLogin,
  };
}
