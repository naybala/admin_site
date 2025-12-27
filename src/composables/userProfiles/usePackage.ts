import { ref } from "vue";
import { apiRequest } from "../common/useApi";
import { useRouter } from "vue-router";
import { useAppToast } from "../common/useAppToast";
import { useI18n } from "vue-i18n";

export function usePackage() {
  const loading = ref(false);
  const router = useRouter();
  const error = ref<string | null>(null);
  const userData = ref<any>({});
  const { showSuccess } = useAppToast();

  const { t } = useI18n();

  // Fetch the latest user data from API
  const fetchUserData = async (id: any) => {
    loading.value = true;
    try {
      const responseData = await apiRequest<any>("api/v1/web/auth/user-info", {
        method: "POST",
        body: JSON.stringify({ id: id }),
      });
      userData.value = responseData.data;
    } catch (err: any) {
      error.value = err.message || "An error occurred";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const upgradeMemberToAgent = async (data: any) => {
    loading.value = true;
    try {
      const response = await apiRequest<any>(
        `api/v1/web/user-subscriptions/update-my-user-type`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        }
      );
      if (response?.success) {
        await Promise.all([
          router.push({ name: "buyers" }),
          showSuccess(t("common.success"), t("users.updated")),
        ]);
      }
    } catch (err: any) {
      error.value = err.message || "An error occurred";
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    userData,
    fetchUserData,
    upgradeMemberToAgent,
    loading,
    error,
  };
}
