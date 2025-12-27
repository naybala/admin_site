import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import { useDebouncedFn } from "../common/useDebouncedFn";
import { LISTING_INDEX_API_PATHS } from "./apiPaths";

export function useListingBoostOrderTable() {
  const { t } = useI18n();
  const searchTerm = ref<string>("");
  const { items, loading, error, page, limit, total, fetchAll } = useCrud<any>({
    apiPath: `${LISTING_INDEX_API_PATHS.ListingBoostOrder}`,
  });

  const fetchData = async (newPage = page.value, newLimit = limit.value) => {
    loading.value = true;
    try {
      await fetchAll({
        page: newPage,
        limit: newLimit,
        search: searchTerm.value,
      });
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    fetchData(1);
  });

  const debouncedFetch = useDebouncedFn(
    () => fetchData(1),
    Number(import.meta.env.VITE_DEBOUNCE_DURATION),
    loading
  );

  watch(searchTerm, () => {
    debouncedFetch();
  });

  return {
    t,
    items,
    searchTerm,
    loading,
    error,
    page,
    limit,
    total,
    fetchData,
  };
}
