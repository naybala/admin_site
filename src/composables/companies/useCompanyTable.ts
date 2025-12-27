import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { CompanyIndex, Company } from "@customTypes/index";
import { Company_INDEX_API_PATHS } from "./apiPaths";
import { useDebouncedFn } from "../common/useDebouncedFn";
import { useUserLocation } from "../common/useUserLocation";
import { apiRequest } from "../common/useApi";

export function useCompanyTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo, showError } = useAppToast();
  const locations = ref<Array<{ id: string; name: string }>>([]);
  const filteredLocations = ref<Array<{ id: string; name: string }>>([]);
  const countries = ref<any>("");

  const searchCountry = ref("");
  const searchLocation = ref("");
  const searchTerm = ref("");

  const {
    items: items,
    loading,
    error,
    page,
    limit,
    total,
    fetchAll,
    deleteItem,
  } = useCrud<CompanyIndex>({
    apiPath: Company_INDEX_API_PATHS.Company,
  });

  const { autoCountryCode, fetchUserLocation } = useUserLocation();

  const fetchAllWithParams = async (params: any) => {
    try {
      await fetchAll(params);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };
  const debouncedFetch = useDebouncedFn(
    fetchAllWithParams,
    import.meta.env.VITE_DEBOUNCE_DURATION,
    loading
  );

  const fetchData = async (newPage?: number, newLimit?: number) => {
    loading.value = true;
    try {
      await fetchAll({
        page: newPage ?? page.value,
        limit: newLimit ?? limit.value,
        search: searchTerm.value,
        locationId: searchLocation.value,
        phoneNumberPrefix: searchCountry.value,
      });
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      loading.value = false;
    }
  };

  //  Watch searchTerm for filtering
  watch(searchTerm, (newTerm) => {
    debouncedFetch({
      page: 1,
      limit: limit.value,
      search: newTerm,
    });
  });

  onMounted(async () => {
    // Fetch user location
    await fetchUserLocation();

    // Set user's country code only if it's not manually selected
    if (!searchCountry.value && autoCountryCode.value) {
      searchCountry.value = autoCountryCode.value;
    }

    // Fetch locations, countries, and enum data
    const [locationResponse, countryResponse] = await Promise.all([
      apiRequest<any>(`${Company_INDEX_API_PATHS.Location}`, { method: "GET" }),
      apiRequest<any>(`${Company_INDEX_API_PATHS.Country}`, { method: "GET" }),
    ]);

    countries.value = countryResponse.data || [];
    locations.value = locationResponse.data;
    await fetchData(1);
  });

  watch(searchCountry, async (newCountryCode) => {
    if (newCountryCode) {
      filteredLocations.value = locations.value.filter((location: any) =>
        location.countryId.includes(newCountryCode)
      );
    } else {
      filteredLocations.value = locations.value;
    }
  });

  const submitFilters = () => {
    fetchData(1);
  };
  const resetFilters = () => {
    searchLocation.value = "";
    fetchData(1);
  };

  const openNewForm = () => {
    router.push({ name: "company-new" });
  };

  const editItem = (item: Company) => {
    router.push({ name: "company-edit", params: { id: item.id } });
  };

  const viewItem = (item: Company) => {
    console.log(item);

    router.push({ name: "company-view", params: { id: item.id } });
  };

  const confirmDeleteItem = (item: Company) => {
    confirm.require({
      message: t("companies.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (item.id) {
          try {
            await deleteItem(item.id);
            showSuccess(t("common.success"), t("companies.deleted"));
            await fetchData(page.value, limit.value);
          } catch (e) {
            showError(error.value || "Something went wrong");
            console.error("Delete error:", e);
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("companies.notDeleted"));
      },
    });
  };

  return {
    t,
    searchTerm,
    items,
    loading,
    error,
    page,
    limit,
    total,
    searchCountry,
    searchLocation,
    locations,
    filteredLocations,
    countries,
    submitFilters,
    resetFilters,
    fetchData,
    openNewForm,
    viewItem,
    editItem,
    confirmDeleteItem,
  };
}
