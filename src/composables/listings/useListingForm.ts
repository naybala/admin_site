import { ref, onMounted, watch, Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { Listing } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateListingForm } from "./validateListingForm";
import { apiRequest } from "../common/useApi";
import { useAuthStore } from "@stores/auth";
import { useImageUpload } from "@/composables/common/useImageUpload";
import { LISTING_CREATE_API_PATHS } from "./apiPaths";

export function useListingForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const saving: Ref<boolean> = ref(false);
  const authStore = useAuthStore();

  const itemId = route.params.id;
  const isEditMode = ref(route.name === "listing-edit");
  const isShowMode = ref(route.name === "listing-view");
  const countries = ref<any[]>([]);
  const locations = ref<Array<{ id: string; name: string }>>([]);
  const districts = ref<Array<{ id: string; name: string }>>([]);
  const users = ref<any[]>([]);
  const types = ref<any[]>([]);
  const status = ref<any[]>([]);
  const propertyStatus = ref<any[]>([]);
  const groupTypes = ref<any[]>([]);
  const currencies = ref<any[]>([]);
  const titleTypes = ref<any[]>([]);
  const dimensions = ref<any[]>([]);

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<Listing>({ apiPath: LISTING_CREATE_API_PATHS.Listing });

  const form = ref<Listing>({
    urlList: [],
    imageFiles: [],
    phoneNumberPrefix: "",
    locationId: "",
    createdUser: authStore.userId,
    districtId: "",
    type: "",
    status: "",
    propertyStatus: "Ready",
    groupType: "",
    currencySymbol: "$",
    titleType: "",
    additional: [],
    desc: "",
    position: "",
    price: 0,
    lastPrice: 0,
    size: 0,
    dimension: "m²",
    linkYoutube: "",
    numBed: 0,
    numBathroom: 0,
    nearBy: "",
    is_private: false,
  });

  const validationErrors = ref<Record<string, string>>({});

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // ========== Helper functions ==========
  const normalizeForDisplay = (url: string, CDN_PREFIX: string) => {
    // Handle Cloudflare delivery URLs
    if (
      url.startsWith("https://imagedelivery.net") &&
      !url.endsWith("/public")
    ) {
      return `${url}/public`;
    }

    // Handle DigitalOcean CDN URLs (if missing prefix)
    if (!url.startsWith("http") && CDN_PREFIX) {
      return `${CDN_PREFIX}/${url}`;
    }

    return url;
  };

  const normalizeForSave = (url: string, CDN_PREFIX: string) => {
    let cleanUrl = url;

    // Remove CDN prefix if exists
    if (CDN_PREFIX && cleanUrl.startsWith(CDN_PREFIX)) {
      cleanUrl = cleanUrl.replace(CDN_PREFIX, "");
    }

    // Remove trailing "/public" for saving
    if (cleanUrl.endsWith("/public")) {
      cleanUrl = cleanUrl.replace("/public", "");
    }

    return cleanUrl;
  };

  // ========== User Search (Debounced) ==========
  const onUserSearch = async (searchTerm: string) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    if (!form.value.districtId || !form.value.phoneNumberPrefix) return;

    debounceTimer = setTimeout(async () => {
      try {
        const userResponse = await apiRequest<any>(
          `${LISTING_CREATE_API_PATHS.User}${encodeURIComponent(
            form.value.phoneNumberPrefix
          )}&search=${encodeURIComponent(searchTerm ?? " ")}`,
          { method: "GET" }
        );
        users.value = userResponse.data?.data || [];
      } catch (error) {
        console.error("User search failed", error);
      }
    }, 300);
  };

  // ========== Lifecycle: onMounted ==========
  onMounted(async () => {
    try {
      if ((isEditMode.value || isShowMode.value) && itemId) {
        await fetchOne(itemId);
        if (item.value) {
          const CDN_PREFIX = import.meta.env.VITE_CDN_PREFIX;
          form.value = { ...item.value };

          // Normalize URLs for display
          form.value.urlList = (item.value.urlList || []).map((url) =>
            normalizeForDisplay(url, CDN_PREFIX)
          );
        }
      }

      // Load countries
      const response = await apiRequest<any>(
        `${LISTING_CREATE_API_PATHS.Country}`,
        {
          method: "GET",
        }
      );
      countries.value = response.data;

      // Watchers for dynamic dropdowns
      watch(
        () => form.value.phoneNumberPrefix,
        async (newCountryCode) => {
          if (!newCountryCode) {
            locations.value = [];
            return;
          }
          const res = await apiRequest<any>(
            `${LISTING_CREATE_API_PATHS.Location}${encodeURIComponent(
              newCountryCode
            )}`,
            { method: "GET" }
          );
          locations.value = res.data;
          if (!isEditMode) form.value.locationId = "";
        },
        { immediate: true }
      );

      watch(
        () => form.value.locationId,
        async (newLocationCode) => {
          if (!newLocationCode) {
            districts.value = [];
            return;
          }
          const res = await apiRequest<any>(
            `${LISTING_CREATE_API_PATHS.District}${encodeURIComponent(
              newLocationCode
            )}`,
            { method: "GET" }
          );
          districts.value = res.data;
          if (!isEditMode) form.value.districtId = "";
        },
        { immediate: true }
      );

      watch(
        () => form.value.type,
        async (newType) => {
          if (!newType) {
            users.value = [];
            return;
          }
          if (!isEditMode) {
            form.value.additional = [];
            form.value.numBed = 0;
            form.value.numBathroom = 0;
            form.value.price = 0;
            form.value.lastPrice = 0;
          }
        }
      );

      watch(
        () => form.value.districtId,
        async (newDistrict) => {
          if (!newDistrict) {
            types.value = [];
            return;
          }

          try {
            const prepareDataResponse = await apiRequest<any>(
              `${LISTING_CREATE_API_PATHS.EnumData}`,
              { method: "GET" }
            );
            types.value = prepareDataResponse.data?.type || [];
            status.value = prepareDataResponse.data?.status || [];
            propertyStatus.value =
              prepareDataResponse.data?.propertyStatus || [];
            groupTypes.value = prepareDataResponse.data?.groupType || [];
            currencies.value = prepareDataResponse.data?.currencySymbol || [];
            titleTypes.value = prepareDataResponse.data?.titleType || [];
            dimensions.value = prepareDataResponse.data?.dimension || [];
          } catch (error) {
            console.error("Enum data fetch failed", error);
          }
        },
        { immediate: true }
      );
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    } finally {
      loading.value = false;
    }
  });

  // Watch for fetched item
  watch(item, (newVal) => {
    if (newVal) form.value = { ...newVal };
  });

  // ========== Save (Create or Update) ==========
  const save = async () => {
    if (isShowMode.value) return;

    validationErrors.value = validateListingForm(form.value, t);
    if (Object.keys(validationErrors.value).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    saving.value = true;

    const { uploadImages, error: uploadError } = useImageUpload();
    const FIELDS_FOR_UPLOAD = [
      "phoneNumberPrefix",
      "locationId",
      "createdUser",
      "districtId",
      "type",
      "status",
      "propertyStatus",
      "groupType",
      "currencySymbol",
      "titleType",
      "additional",
      "desc",
      "position",
      "price",
      "lastPrice",
      "size",
      "dimension",
      "linkYoutube",
      "numBed",
      "numBathroom",
      "nearBy",
      "is_private",
    ];

    try {
      const CDN_PREFIX = import.meta.env.VITE_CDN_PREFIX;
      let uploadedUrls: string[] = [];

      // Upload new files
      if (form.value.imageFiles?.length) {
        try {
          const keys = await uploadImages(
            form,
            "api/v1/web/properties/check-validation-for-property",
            true,
            FIELDS_FOR_UPLOAD
          );
          uploadedUrls = keys.map((k) => normalizeForSave(k, CDN_PREFIX));
        } catch {
          showError(
            t("common.error"),
            uploadError.value || t("common.uploadFailed")
          );
          return;
        }
      }

      // Normalize existing URLs before save
      const existingUrls = (form.value.urlList || []).map((url) =>
        normalizeForSave(url, CDN_PREFIX)
      );

      // Merge and deduplicate
      form.value.urlList = [...new Set([...existingUrls, ...uploadedUrls])];

      // Ensure numbers
      form.value.price = Number(form.value.price);
      form.value.lastPrice = Number(form.value.lastPrice);

      console.log("Final form before save:", form.value);

      // Save
      if (isEditMode.value && itemId) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("listings.updated"));
      } else {
        await createItem(form.value);
        showSuccess(t("common.success"), t("listings.created"));
      }
      router.push({ name: "listings" });
    } catch (err: any) {
      console.error("Save failed:", err);
      showError(t("common.error"), err.message || t("common.unexpectedError"));
    } finally {
      saving.value = false;
    }
  };

  // ========== Cancel ==========
  const cancel = () => {
    router.push({ name: "listings" });
  };

  return {
    t,
    isEditMode,
    isShowMode,
    form,
    countries,
    locations,
    districts,
    users,
    types,
    status,
    propertyStatus,
    groupTypes,
    titleTypes,
    currencies,
    dimensions,
    validationErrors,
    save,
    cancel,
    loading,
    error,
    saving,
    onUserSearch,
  };
}
