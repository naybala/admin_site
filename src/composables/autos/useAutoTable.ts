import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { AutoIndex, Auto } from "@customTypes/index";
import { Auto_INDEX_API_PATHS } from "./apiPaths";
import { useDebouncedFn } from "../common/useDebouncedFn";
import { apiRequest } from "../common/useApi";
import { useUserLocation } from "../common/useUserLocation";

export function useAutoTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo, showError } = useAppToast();
  const { autoCountryCode, fetchUserLocation } = useUserLocation();

  const searchTerm = ref("");
  const autoType = ref("");
  const autoBranch = ref("");
  const autoSubBranch = ref("");
  const searchCountry = ref("");
  const searchGroupType = ref("");

  const minPrice = ref<any>(null);
  const maxPrice = ref<any>(null);
  const countries = ref<any>([]);
  const autoTypes = ref<any>([]);
  const autoBranches = ref<any>([]);
  const autoSubBranches = ref<any>([]);
  const groupTypes = ref<any>("");

  const {
    items: items,
    loading,
    error,
    page,
    limit,
    total,
    fetchAll,
    deleteItem,
  } = useCrud<AutoIndex>({
    apiPath: Auto_INDEX_API_PATHS.Auto,
  });

  const fetchAllWithParams = async (params: any) => {
    try {
      await fetchAll(params);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };
  const debouncedFetch = useDebouncedFn(
    fetchAllWithParams,
    Number(import.meta.env.VITE_DEBOUNCE_DURATION),
    loading
  );

  const submitFilters = () => {
    fetchData(1);
  };
  const resetFilters = () => {
    autoType.value = "";
    autoBranch.value = "";
    autoSubBranch.value = "";
    minPrice.value = null;
    maxPrice.value = null;
    fetchData(1);
  };

  onMounted(async () => {
    await fetchUserLocation();

    // Set user's country code only if it's not manually selected
    if (!searchCountry.value && autoCountryCode.value) {
      searchCountry.value = autoCountryCode.value;
    }

    const [
      autoTypeResponse,
      autoBranchResponse,
      countryResponse,
      mixResponse,
    ] = await Promise.all([
      apiRequest<any>(`${Auto_INDEX_API_PATHS.AutoType}`, { method: "GET" }),
      apiRequest<any>(`${Auto_INDEX_API_PATHS.AutoBranch}`, { method: "GET" }),
      apiRequest<any>(`${Auto_INDEX_API_PATHS.Country}`, { method: "GET" }),
      apiRequest<any>(`${Auto_INDEX_API_PATHS.PrepareData}`, { method: "GET" }),
    ]);

    groupTypes.value = mixResponse.data?.groupType || [];
    countries.value = countryResponse.data || [];
    autoTypes.value = autoTypeResponse?.data || [];
    autoBranches.value = autoBranchResponse?.data || [];
    await fetchData(1);
  });

  const fetchData = async (newPage?: number, newLimit?: number) => {
    loading.value = true;
    try {
      await fetchAll({
        page: newPage ?? page.value,
        limit: newLimit ?? limit.value,
        search: searchTerm.value,
        autoType: autoType.value,
        autoBranch: autoBranch.value,
        autoSubBranch: autoSubBranch.value,
        minPrice: minPrice.value,
        maxPrice: maxPrice.value,
        phoneNumberPrefix: searchCountry.value,
        groupType: searchGroupType.value,
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

  watch(autoBranch, async (newBranch) => {
    const subBranchRes = await apiRequest<any>(
      `${Auto_INDEX_API_PATHS.AutoSubBranch}${encodeURIComponent(
        newBranch
      )}/auto-sub-branches`,
      { method: "GET" }
    );
    autoSubBranches.value = subBranchRes.data;
  });

  const openNewForm = () => {
    router.push({ name: "auto-new" });
  };

  const editItem = (item: Auto) => {
    router.push({ name: "auto-edit", params: { id: item.id } });
  };

  const viewItem = (item: Auto) => {
    router.push({ name: "auto-view", params: { id: item.id } });
  };

  const confirmDeleteItem = (item: Auto) => {
    confirm.require({
      message: t("autos.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (item.id) {
          try {
            await deleteItem(item.id);
            showSuccess(t("common.success"), t("autos.deleted"));
            await fetchData(page.value, limit.value);
          } catch (e) {
            showError(error.value || "Something went wrong");
            console.error("Delete error:", e);
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("autos.notDeleted"));
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
    autoTypes,
    autoBranches,
    autoSubBranches,
    groupTypes,
    searchGroupType,
    searchCountry,
    countries,
    autoType,
    autoBranch,
    autoSubBranch,
    minPrice,
    maxPrice,
    submitFilters,
    resetFilters,
    fetchData,
    openNewForm,
    viewItem,
    editItem,
    confirmDeleteItem,
  };
}
