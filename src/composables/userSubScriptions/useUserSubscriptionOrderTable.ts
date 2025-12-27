import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import { UserSubScription_INDEX_API_PATHS } from "./apiPaths";
import { apiRequest } from "../common/useApi";
import { useDebouncedFn } from "../common/useDebouncedFn";

export function useUserSubScriptionOrderTable() {
  const { t } = useI18n();

  const searchOrderType = ref<string>("");
  const searchUserType = ref<string>("");
  const searchTerm = ref<string>("");

  const orderTypes = ref<any[]>([]);
  const userTypes = ref<any[]>([]);

  const { items, loading, error, page, limit, total, fetchAll } = useCrud<any>({
    apiPath: `${UserSubScription_INDEX_API_PATHS.UserSubScription}/orders`,
  });

  const fetchData = async (newPage = page.value, newLimit = limit.value) => {
    loading.value = true;
    try {
      await fetchAll({
        page: newPage,
        limit: newLimit,
        status: searchOrderType.value,
        userType: searchUserType.value,
        search: searchTerm.value,
      });
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    try {
      const prepareDataResponse = await apiRequest<any>(
        `${UserSubScription_INDEX_API_PATHS.UserSubScription}/prepare-data-for-orders`,
        { method: "GET" }
      );

      orderTypes.value = prepareDataResponse.data?.orderType ?? [];
      userTypes.value = prepareDataResponse.data?.userType ?? [];

      fetchData(1);
    } catch (e) {
      console.error("Prepare data error:", e);
    }
  });

  const debouncedFetch = useDebouncedFn(
    () => fetchData(1),
    Number(import.meta.env.VITE_DEBOUNCE_DURATION),
    loading
  );

  watch(searchTerm, () => {
    debouncedFetch();
  });

  const submitFilters = () => {
    fetchData(1);
  };

  const resetFilters = () => {
    searchOrderType.value = "";
    searchUserType.value = "";
    searchTerm.value = "";
    fetchData(1);
  };

  return {
    t,
    items,
    orderTypes,
    userTypes,
    searchOrderType,
    searchUserType,
    searchTerm,
    loading,
    error,
    page,
    limit,
    total,
    fetchData,
    submitFilters,
    resetFilters,
  };
}
