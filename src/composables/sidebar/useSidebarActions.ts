import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useConfirm } from "primevue/useconfirm";
import { useAppToast } from "@/composables/common/useAppToast";
import useAuthData from "@/composables/auth";

export function useSidebarActions() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const authStore = useAuthStore();
  const confirm = useConfirm();
  const { showSuccess } = useAppToast();
  const { callToLogoutApi } = useAuthData();

  const changeLocale = () => {
    locale.value = locale.value === "en" ? "mm" : "en";
  };

  const handleLogoutConfirm = () => {
    confirm.require({
      message: "Are you sure you want to log out?",
      header: "Logout Confirmation",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: t("common.cancel"),
      acceptLabel: t("common.confirm"),
      acceptClass: "p-button-danger",
      accept: async () => {
        await callToLogoutApi();
        authStore.clearAuthData();
        router.push("/login");
      },
      reject: () => {
        showSuccess(t("common.success"), t("users.logoutCancel"));
      },
    });
  };

  return {
    locale,
    t,
    changeLocale,
    handleLogoutConfirm,
  };
}
