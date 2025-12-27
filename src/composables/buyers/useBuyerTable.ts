import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { Buyer } from "@customTypes/index";
import { Buyer_INDEX_API_PATHS } from "./apiPaths";
import { useDebouncedFn } from "../common/useDebouncedFn";
import { useUserLocation } from "../common/useUserLocation";
import { apiRequest } from "../common/useApi";

export function useBuyerTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo, showError } = useAppToast();
  const { autoCountry, fetchUserLocation } = useUserLocation();

  const searchTerm = ref("");
  const searchLocation = ref("");
  const searchType = ref("");
  const searchGroupType = ref("");
  const searchCountry = ref("");
  const minPrice = ref<any>(null);
  const maxPrice = ref<any>(null);

  const locations = ref<Array<{ id: string; name: string }>>([]);
  const groupTypes = ref<any>("");
  const types = ref<any>("");
  const countries = ref<any>("");

  const {
    items: items,
    loading,
    error,
    page,
    limit,
    total,
    fetchAll,
    deleteItem,
  } = useCrud<any>({
    apiPath: Buyer_INDEX_API_PATHS.Buyer,
  });

  const fetchAllWithParams = async (params: any) => {
    try {
      await fetchAll(params);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };
  const debouncedFetch = useDebouncedFn(fetchAllWithParams, 300, loading);

  const fetchData = async (newPage?: number, newLimit?: number) => {
    loading.value = true;
    try {
      await fetchAll({
        page: newPage ?? page.value,
        limit: newLimit ?? limit.value,
        search: searchTerm.value,
        locationId: searchLocation.value,
        type: searchType.value,
        groupType: searchGroupType.value,
        minPrice: minPrice.value,
        maxPrice: maxPrice.value,
        phoneNumberPrefix: searchCountry.value,
      });
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    // Fetch user location
    await fetchUserLocation();

    // Set user's country code only if it's not manually selected
    if (!searchCountry.value && autoCountry.value) {
      searchCountry.value = autoCountry.value;
    }

    // Fetch locations, countries, and enum data
    const [locationResponse, mixResponse, countryResponse] = await Promise.all([
      apiRequest<any>(`${Buyer_INDEX_API_PATHS.Location}`, { method: "GET" }),
      apiRequest<any>(`${Buyer_INDEX_API_PATHS.EnumData}`, { method: "GET" }),
      apiRequest<any>(`${Buyer_INDEX_API_PATHS.Country}`, { method: "GET" }),
    ]);

    countries.value = countryResponse.data || [];
    groupTypes.value = mixResponse.data?.groupType || [];
    types.value = mixResponse.data?.type || [];
    locations.value = locationResponse.data;
    await fetchData(1);
  });

  //  Watch searchTerm for filtering
  watch(searchTerm, (newTerm) => {
    debouncedFetch({
      page: 1,
      limit: limit.value,
      search: newTerm,
    });
  });

  const submitFilters = () => {
    fetchData(1);
  };
  const resetFilters = () => {
    searchLocation.value = "";
    searchType.value = "";
    searchGroupType.value = "";
    minPrice.value = null;
    maxPrice.value = null;
    fetchData(1);
  };

  const openNewForm = () => {
    router.push({ name: "buyer-new" });
  };

  const editItem = (item: Buyer) => {
    router.push({ name: "buyer-edit", params: { id: item.id } });
  };

  const viewItem = (role: any) => {
    router.push({ name: "buyer-view", params: { id: role.id } });
  };

  const confirmDeleteItem = (event: Event, item: Buyer) => {
    confirm.require({
      target: event.currentTarget as HTMLElement,
      message: t("buyers.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (item.id) {
          try {
            await deleteItem(item.id);
            showSuccess(t("common.success"), t("buyers.deleted"));
            await fetchData(page.value, limit.value);
          } catch (e) {
            showError(error.value || "Something went wrong");
            console.error("Delete error:", e);
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("buyers.notDeleted"));
      },
    });
  };

  return {
    t,
    searchTerm,
    searchLocation,
    searchType,
    searchGroupType,
    searchCountry,
    items,
    loading,
    error,
    page,
    limit,
    locations,
    countries,
    groupTypes,
    types,
    minPrice,
    maxPrice,
    submitFilters,
    resetFilters,
    total,
    fetchData,
    openNewForm,
    viewItem,
    editItem,
    confirmDeleteItem,
  };
}
