import { useMutation } from "@tanstack/vue-query";
import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/stores/auth";
import { usePermissionStore } from "@/stores/permission";
import { useAppToast } from "@/composables/common/useAppToast";
import { useI18n } from "vue-i18n";

export function useAuthMutations() {
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();
  const { showError } = useAppToast();
  const { t } = useI18n();

  const loginMutation = useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      authApi.login(data),
    onSuccess: (response: any) => {
      const userData = response.data;
      permissionStore.clearPermissions();
      permissionStore.setPermissions(userData?.user?.permissions);

      authStore.setAuthData({
        token: userData.token,
        userId: userData.user.id,
        name: userData.user.name,
        roleId: userData.user.roleId,
      });
    },
    onError: (error: any) => {
      showError(t("common.error"), error.message || t("auth.loginFailed"));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      sessionStorage.removeItem("authData");
      sessionStorage.removeItem("myDashboardData");
      sessionStorage.removeItem("dashboardData");
      authStore.clearAuth();
      permissionStore.clearPermissions();
    },
    onError: (error: any) => {
      showError(t("common.error"), error.message || t("auth.logoutFailed"));
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: (data: any) => authApi.sendOtp(data),
    onError: (error: any) => {
      showError(t("common.error"), error.message || t("auth.otpFailed"));
    },
  });

  return {
    loginMutation,
    logoutMutation,
    sendOtpMutation,
  };
}
