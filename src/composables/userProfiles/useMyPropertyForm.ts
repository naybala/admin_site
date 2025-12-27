import { ref, onMounted, watch, Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { Listing } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateListingForm } from "./../listings/validateListingForm";
import { apiRequest } from "../common/useApi";
import { useAuthStore } from "@stores/auth";
import { useImageUpload } from "@/composables/common/useImageUpload";
import { CREATE_API_PATHS } from "./apiPaths";

export function useMyPropertyForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const saving: Ref<boolean> = ref(false);
  const authStore = useAuthStore();

  const itemId = route.params.id;
  const isEditMode = ref(route.name === "my-listing-edit");
  const isShowMode = ref(route.name === "my-listing-view");
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
  } = useCrud<Listing>({ apiPath: CREATE_API_PATHS.Listing });

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

  //  User search function with debounce
  const onUserSearch = async (searchTerm: string) => {
    // Always clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Prevent search if district or country is missing
    if (!form.value.districtId || !form.value.phoneNumberPrefix) return;

    // Debounce API call
    //currently not used
    debounceTimer = setTimeout(async () => {
      try {
        const userResponse = await apiRequest<any>(
          `${CREATE_API_PATHS.User}${encodeURIComponent(
            form.value.phoneNumberPrefix
          )}&search=${encodeURIComponent(searchTerm ?? " ")}`,
          {
            method: "GET",
          }
        );
        users.value = userResponse.data?.data || [];
      } catch (error) {
        console.error("User search failed", error);
      }
    }, 300);
  };

  onMounted(async () => {
    try {
      if ((isEditMode.value || isShowMode.value) && itemId) {
        await fetchOne(itemId);
        if (item.value) {
          form.value = { ...item.value };
          const CDN_PREFIX = import.meta.env.VITE_CDN_PREFIX;

          // Normalize URLs for display
          const tempUrlList = (item.value.urlList || []).map((url) => {
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
          });

          form.value.urlList = tempUrlList;
        }
      }
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    } finally {
      loading.value = false;
    }

    const response = await apiRequest<any>(`${CREATE_API_PATHS.Country}`, {
      method: "GET",
    });
    countries.value = response.data;

    watch(
      () => form.value.phoneNumberPrefix,
      async (newCountryCode) => {
        if (!newCountryCode) {
          locations.value = [];
          return;
        }
        const res = await apiRequest<any>(
          `${CREATE_API_PATHS.Location}${encodeURIComponent(newCountryCode)}`,
          {
            method: "GET",
          }
        );

        locations.value = res.data;
        if (!isEditMode) {
          form.value.locationId = "";
        }
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
          `${CREATE_API_PATHS.District}${encodeURIComponent(newLocationCode)}`,
          {
            method: "GET",
          }
        );
        districts.value = res.data;
        if (!isEditMode) {
          form.value.districtId = "";
        }
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
            `${CREATE_API_PATHS.EnumData}`,
            {
              method: "GET",
            }
          );
          types.value = prepareDataResponse.data?.type || [];
          status.value = prepareDataResponse.data?.status || [];
          propertyStatus.value = prepareDataResponse.data?.propertyStatus || [];
          groupTypes.value = prepareDataResponse.data?.groupType || [];
          currencies.value = prepareDataResponse.data?.currencySymbol || [];
          titleTypes.value = prepareDataResponse.data?.titleType || [];
          dimensions.value = prepareDataResponse.data?.dimension || [];
        } catch (error) {
          console.error("Initial user fetch failed", error);
        }
      },
      { immediate: true }
    );

    setTimeout(() => {
      loading.value = false;
    }, 300);
  });

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const save = async () => {
    if (isShowMode.value) return;

    // Validation of form fields
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
      // Image validation and upload
      if (form.value.imageFiles?.length) {
        let keys;
        try {
          keys = await uploadImages(
            form,
            "api/v1/web/properties/check-validation-for-property",
            true,
            FIELDS_FOR_UPLOAD // Pass only necessary fields
          );
        } catch {
          showError(
            t("common.error"),
            uploadError.value || t("common.uploadFailed")
          );
          return;
        }

        const CDN_PREFIX = import.meta.env.VITE_CDN_PREFIX;
        form.value.urlList = [
          ...(form.value.urlList || []),
          ...keys.map((k) =>
            k.startsWith(CDN_PREFIX) ? k.replace(CDN_PREFIX, "") : k
          ),
        ];
      }

      form.value.price = Number(form.value.price);
      form.value.lastPrice = Number(form.value.lastPrice);

      // Continue with save
      if (isEditMode.value && itemId) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("listings.updated"));
      } else {
        console.log(form.value);

        await createItem(form.value);
        showSuccess(t("common.success"), t("listings.created"));
      }
      router.push({ name: "my-listings" });
    } catch (err: any) {
      console.error("Save failed:", err);
      showError(t("common.error"), err.message || t("common.unexpectedError"));
    } finally {
      saving.value = false;
    }
  };

  const cancel = () => {
    router.push({ name: "my-listings" });
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
