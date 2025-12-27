import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import type { Listing } from "@customTypes/index";
import { apiRequest } from "../common/useApi";
import { useDebouncedFn } from "../common/useDebouncedFn";
import { CREATE_API_PATHS, INDEX_API_PATHS } from "./apiPaths";

export function useMyPropertyTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo, showError } = useAppToast();

  const searchTerm = ref("");
  const searchLocation = ref("");
  const searchType = ref("");
  const searchGroupType = ref("");
  const searchCountry = ref("");
  const minPrice = ref<any>(null);
  const maxPrice = ref<any>(null);

  const locations = ref<Array<{ id: string; name: string }>>([]);
  const filteredLocations = ref<Array<{ id: string; name: string }>>([]);
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
  } = useCrud<any>({
    apiPath: INDEX_API_PATHS.Listing,
  });

  const fetchAllWithParams = async (params: any) => {
    try {
      await fetchAll(params);
    } catch (e) {
      console.error("Fetch error:", e);
    }
  };

  onMounted(async () => {
    // Fetch locations, countries, and enum data
    const [locationResponse, mixResponse, countryResponse] = await Promise.all([
      apiRequest<any>(`${INDEX_API_PATHS.Location}`, { method: "GET" }),
      apiRequest<any>(`${INDEX_API_PATHS.EnumData}`, { method: "GET" }),
      apiRequest<any>(`${INDEX_API_PATHS.Country}`, { method: "GET" }),
    ]);

    countries.value = countryResponse.data || [];
    groupTypes.value = mixResponse.data?.groupType || [];
    types.value = mixResponse.data?.type || [];
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

  const debouncedFetch = useDebouncedFn(
    fetchAllWithParams,
    Number(import.meta.env.VITE_DEBOUNCE_DURATION),
    loading
  );

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

  const fetchData = async (newPage?: number, newLimit?: number) => {
    loading.value = true;
    try {
      await fetchAll(
        {
          page: newPage ?? page.value,
          limit: newLimit ?? limit.value,
          search: searchTerm.value,
          locationId: searchLocation.value,
          type: searchType.value,
          groupType: searchGroupType.value,
          minPrice: minPrice.value,
          maxPrice: maxPrice.value,
          phoneNumberPrefix: searchCountry.value,
        },
        "POST"
      );
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

  const checkAvailability = async (): Promise<any> => {
    try {
      const res = await apiRequest<any>(
        `${CREATE_API_PATHS.Listing}/check-availability`,
        { method: "POST" }
      );
      return res.data;
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "Failed to check availability"
      );
      return false;
    }
  };

  const openNewForm = async () => {
    const availabilityCheck = await checkAvailability();
    if (!availabilityCheck) {
      confirm.require({
        message:
          "Your account reach limitation, Please upgrade for unlimited posting.",
        icon: "pi pi-exclamation-triangle",
        acceptClass: "p-button-danger",
        acceptLabel: "Upgrade Now",
        rejectLabel: " ",
        accept: async () => {
          router.push({ name: "my-packages" });
        },
        reject: () => {
          showInfo(
            t("common.info"),
            "If you want to list more properties, please upgrade to agent."
          );
        },
      });
      return;
    }
    await router.push({ name: "my-listing-new" });
  };

  const editItem = (item: Listing) => {
    router.push({ name: "my-listing-edit", params: { id: item.id } });
  };

  const viewItem = (item: any) => {
    router.push({ name: "my-listing-view", params: { id: item.id } });
  };

  const confirmDeleteItem = (item: Listing) => {
    confirm.require({
      message: t("listings.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        if (item.id) {
          try {
            await apiRequest<any>(
              `${INDEX_API_PATHS.ListingDelete}/${item.id}`,
              { method: "DELETE" }
            );
            showSuccess(t("common.success"), t("listings.deleted"));
            await fetchData(page.value, limit.value);
          } catch (e) {
            showError(error.value || "Something went wrong");
            console.error("Delete error:", e);
          }
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("listings.notDeleted"));
      },
    });
  };

  const sentItemToTelegram = async (id: number) => {
    loading.value = true;

    try {
      const response: any = await apiRequest(
        `${INDEX_API_PATHS.Telegram_Sent_Api}${id}`,
        {
          method: "POST",
        }
      );
      if (response.success) {
        showSuccess(t("common.success"), t("listings.sentToTelegram"));
      } else {
        showError(t("common.error"), t("listings.notSentToTelegram"));
      }
    } catch (e) {
      showError(t("common.error"), t("listings.notSentToTelegram"));
      console.error("Send to Telegram error:", e);
    } finally {
      loading.value = false;
    }
  };

  const sentItemToFacebook = async (id: string) => {
    loading.value = true;
    try {
      const response: any = await apiRequest(`api/v1/web/post-to-facebook`, {
        method: "POST",
        body: JSON.stringify({ propertyId: id }),
      });
      if (response.success) {
        showSuccess(t("common.success"), t("listings.sentToFacebook"));
      } else {
        showError(t("common.error"), t("listings.notSentToFacebook"));
      }
    } catch (e) {
      showError(t("common.error"), t("listings.notSentToFacebook"));
      console.error("Send to Facebook error:", e);
    } finally {
      loading.value = false;
    }
  };

  const sentNotification = async (id: string) => {
    loading.value = true;
    try {
      const response: any = await apiRequest(
        `${INDEX_API_PATHS.OneSignal_Sent_Api}${id}`,
        {
          method: "POST",
        }
      );
      if (response.success) {
        showSuccess(t("common.success"), t("listings.sentToNotification"));
      } else {
        showError(t("common.error"), t("listings.notSentToNotification"));
      }
    } catch (e) {
      showError(t("common.error"), t("listings.notSentToNotification"));
      console.error("Send to Notification error:", e);
    } finally {
      loading.value = false;
    }
  };

  const goToBoostPackagePage = async (id: string) => {
    router.push({
      name: "boost-packages",
      params: { id: id, type: "property" },
    });
  };

  return {
    t,
    items,
    loading,
    error,
    searchTerm,
    searchLocation,
    searchType,
    searchGroupType,
    searchCountry,
    page,
    limit,
    locations,
    filteredLocations,
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
    sentItemToTelegram,
    sentNotification,
    editItem,
    confirmDeleteItem,
    sentItemToFacebook,
    goToBoostPackagePage,
  };
}
