import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { Auto } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateAutoForm } from "./validateAutoForm";
import { Auto_CREATE_API_PATHS } from "./apiPaths";
import { useImageUpload } from "../common/useImageUpload";
import { apiRequest } from "../common/useApi";

export function useAutoForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const countries = ref<any>([]);
  const autoTypes = ref<any>([]);
  const autoBranches = ref<any[]>([]);
  const autoSubBranches = ref<any>([]);
  const autoConditions = ref<any>([]);
  const transmissionType = ref<any>([]);
  const fuelTypes = ref<any>([]);
  const bodyTypes = ref<any>([]);
  const groupTypes = ref<any>([]);
  const taxTypes = ref<any>([]);
  const status = ref<any>([]);
  const locations = ref<any>([]);
  const districts = ref<any>([]);
  const selected = ref<any>([]);

  const state = reactive({
    saving: false,
    isEditMode: route.name === "auto-edit",
    isShowMode: route.name === "auto-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({ apiPath: Auto_CREATE_API_PATHS.Auto });

  const form = ref<Auto>({
    // Required fields
    title: "",
    phoneNumberPrefix: "",
    countryCode: "",
    currencySymbol: "",
    currencyCode: "",

    autoType: "",
    autoCondition: "",
    groupType: "",
    price: 0,
    status: "",
    locationId: "",
    position: undefined,

    // Optional fields from validator
    address: "",
    desc: "",
    color: "",
    year: undefined,
    urlList: [],
    bodyType: "",
    taxType: "",
    transmissionType: "",
    fuelType: "",
    districtId: "",
    autoBranch: "",
    autoBranchName: "",
    autoSubBranch: "",
    autoSubBranchName: "",

    // Existing (non-validator) fields – keep as is
    autoBranchDoc: "",
    autoSubBranchDoc: "",
    branchId: "",
    code: "",
    geoLocation: "",
    imageFiles: [],
    nearBy: [],
  });

  onMounted(async () => {
    try {
      // Fetch necessary data first
      const [
        countryResponse,
        autoTypeResponse,
        prepareDataForStore,
        autoBranchResponse,
      ] = await Promise.all([
        apiRequest<any>(Auto_CREATE_API_PATHS.Country, { method: "GET" }),
        apiRequest<any>(Auto_CREATE_API_PATHS.AutoType, { method: "GET" }),
        apiRequest<any>(Auto_CREATE_API_PATHS.PrepareData, { method: "GET" }),
        apiRequest<any>(Auto_CREATE_API_PATHS.AutoBranch, { method: "GET" }),
      ]);

      // Set lists before anything else
      countries.value = countryResponse.data;
      autoTypes.value = autoTypeResponse.data;
      autoBranches.value = autoBranchResponse.data;
      autoConditions.value = prepareDataForStore.data.autoCondition;
      transmissionType.value = prepareDataForStore.data.transmissionType;
      fuelTypes.value = prepareDataForStore.data.fuelType;
      bodyTypes.value = prepareDataForStore.data.bodyType;
      groupTypes.value = prepareDataForStore.data.groupType;
      taxTypes.value = prepareDataForStore.data.taxType;
      status.value = prepareDataForStore.data.status;

      // Now fetch and set form data
      if ((state.isEditMode || state.isShowMode) && route.params.id) {
        await fetchOne(route.params.id as string);
        if (item.value) {
          form.value = { ...item.value };

          // Manually set countryCode and currencyCode based on existing currencySymbol
          const foundCountry = countries.value.find(
            (c: any) => c.currencySymbol === form.value.currencySymbol
          );
          if (foundCountry) {
            form.value.countryCode = foundCountry.countryCode;
            form.value.currencyCode = foundCountry.currencyCode;
          }

          // Load locations and districts as needed
          if (form.value.phoneNumberPrefix) {
            const locRes = await apiRequest<any>(
              `${Auto_CREATE_API_PATHS.Location}${encodeURIComponent(
                form.value.phoneNumberPrefix
              )}`,
              { method: "GET" }
            );
            locations.value = locRes.data;
          }

          if (form.value.locationId) {
            const distRes = await apiRequest<any>(
              `${Auto_CREATE_API_PATHS.District}${encodeURIComponent(
                form.value.locationId
              )}`,
              { method: "GET" }
            );
            districts.value = distRes.data;
          }

          if (form.value.autoBranch) {
            const subBranchRes = await apiRequest<any>(
              `${Auto_CREATE_API_PATHS.AutoSubBranch}${encodeURIComponent(
                form.value.autoBranch
              )}/auto-sub-branches`,
              { method: "GET" }
            );
            autoSubBranches.value = subBranchRes.data;
          }
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
  });

  watch(
    () => form.value.phoneNumberPrefix,
    async (newCountryCode) => {
      if (!newCountryCode) {
        locations.value = [];
        return;
      }
      const res = await apiRequest<any>(
        `${Auto_CREATE_API_PATHS.Location}${encodeURIComponent(
          newCountryCode
        )}`,
        {
          method: "GET",
        }
      );

      locations.value = res.data;
      if (!state.isEditMode && !state.isShowMode) {
        form.value.locationId = "";
        form.value.districtId = "";
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
        `${Auto_CREATE_API_PATHS.District}${encodeURIComponent(
          newLocationCode
        )}`,
        {
          method: "GET",
        }
      );
      districts.value = res.data;
      if (!state.isEditMode && !state.isShowMode) {
        form.value.districtId = "";
      }
    },
    { immediate: true }
  );

  watch(
    () => form.value.currencySymbol,
    async (newCurrencySymbol) => {
      selected.value = await countries.value.find(
        (c: any) => c.currencySymbol === newCurrencySymbol
      );
      if (selected.value) {
        form.value.countryCode = selected.value.countryCode;
        form.value.currencyCode = selected.value.currencyCode;
      }
    }
  );

  watch(
    () => form.value.autoBranch,
    async (newAutoBranchCode) => {
      if (!newAutoBranchCode) {
        autoSubBranches.value = [];
        return;
      }
      const res = await apiRequest<any>(
        `${Auto_CREATE_API_PATHS.AutoSubBranch}${encodeURIComponent(
          newAutoBranchCode
        )}/auto-sub-branches`,
        {
          method: "GET",
        }
      );
      autoSubBranches.value = res.data;
    },
    { immediate: true }
  );

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const save = async () => {
    if (state.isShowMode) return;

    state.validationErrors = validateAutoForm(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    const { uploadImages, error: uploadError } = useImageUpload();
    const FIELDS_FOR_UPLOAD = [
      "phoneNumberPrefix",
      "locationId",
      "createdUser",
      "districtId",
      "status",
      "groupType",
      "currencySymbol",
      "desc",
      "position",
      "price",
      "title",
      "autoType",
      "autoCondition",
      "countryCode",
      "currencyCode",
      "bodyType",
      "taxType",
      "transmissionType",
      "fuelType",
      "autoBranch",
      "autoSubBranch",
      "address",
      "color",
      "year",
      "urlList",
    ];

    state.saving = true;

    try {
      const CDN_PREFIX = import.meta.env.VITE_CDN_PREFIX;
      let uploadedUrls: string[] = [];

      //  Upload new files if any
      if (form.value.imageFiles?.length) {
        try {
          const keys = await uploadImages(
            form,
            Auto_CREATE_API_PATHS.Validate,
            true,
            FIELDS_FOR_UPLOAD
          );

          // Strip CDN prefix from newly uploaded URLs
          uploadedUrls = keys.map((k) =>
            k.startsWith(CDN_PREFIX) ? k.replace(CDN_PREFIX, "") : k
          );
        } catch {
          showError(
            t("common.error"),
            uploadError.value || t("common.uploadFailed")
          );
          return;
        }
      }

      //  Normalize existing URLs to ensure no CDN prefix is stored
      const existingUrls = (form.value.urlList || []).map((url) =>
        url.startsWith(CDN_PREFIX) ? url.replace(CDN_PREFIX, "") : url
      );

      //  Merge unique URLs
      form.value.urlList = [...new Set([...existingUrls, ...uploadedUrls])];

      // Ensure numeric fields
      form.value.price = Number(form.value.price);

      // Save
      if (state.isEditMode && route.params.id) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("autos.updated"));
      } else {
        await createItem(form.value);
        showSuccess(t("common.success"), t("autos.created"));
      }

      router.push({ name: "autos" });
    } catch (err: any) {
      console.error("Save failed:", err);
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    } finally {
      state.saving = false;
    }
  };

  const cancel = () => {
    router.push({ name: "autos" });
  };

  return {
    t,
    state,
    form,
    save,
    cancel,
    autoTypes,
    autoBranches,
    autoSubBranches,
    countries,
    locations,
    districts,
    autoConditions,
    transmissionType,
    fuelTypes,
    bodyTypes,
    groupTypes,
    taxTypes,
    status,
    loading,
    error,
  };
}
