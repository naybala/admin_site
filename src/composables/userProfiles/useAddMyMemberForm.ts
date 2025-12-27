import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import { useDebouncedFn } from "../common/useDebouncedFn";
import { INDEX_API_PATHS } from "@/composables/users/apiPaths";
import { apiRequest } from "../common/useApi";
import { EXTRA_API_PATHS } from "./apiPaths";
import { useAppToast } from "../common/useAppToast";

export function useAddMyMemberForm() {
  const { t } = useI18n();
  const searchTerm = ref("");
  const success = ref(false);
  const { showSuccess, showError } = useAppToast();

  const { items, loading, error, page, limit, total, fetchAll } = useCrud<any>({
    apiPath: INDEX_API_PATHS.USERS,
  });

  // Debounced fetch
  const fetchAllWithParams = async (params: any) => {
    try {
      await fetchAll(params);
      console.log(items.value);
    } catch (e) {
      console.error("Error in fetchAllWithParams:", e);
    }
  };

  const debouncedFetch = useDebouncedFn(
    fetchAllWithParams,
    Number(import.meta.env.VITE_DEBOUNCE_DURATION),
    loading
  );

  // Debounced search watcher
  watch([searchTerm], ([newTerm]) => {
    debouncedFetch({
      page: 1,
      limit: 20,
      search: newTerm,
    });
  });

  const fetchUserAddMember = async (userId: string) => {
    try {
      const response: any = await apiRequest(
        EXTRA_API_PATHS.MY_AGENT_ADD_MEMBER,
        {
          method: "POST",
          body: JSON.stringify({
            userId: userId,
          }),
        }
      );
      if (response.success) {
        showSuccess(t("common.success"), t("users.updated"));
        success.value = true;
      }
    } catch (e) {
      showError(t("common.error"), t("users.addUserFailed"));
      console.error("Fetch error:", e);
    }
  };

  return {
    t,
    items,
    loading,
    error,
    searchTerm,
    fetchUserAddMember,
    page,
    limit,
    total,
    success,
  };
}
