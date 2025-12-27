import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { Buyer } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateBuyerForm } from "./validateBuyerForm";
import { Buyer_CREATE_API_PATHS } from "./apiPaths";
import { apiRequest } from "../common/useApi";

export function useBuyerForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const indexRouteName = "buyers";

  const propertyType = ref<any[]>([]);
  const propertyGroupType = ref<any[]>([]);
  const countries = ref<any[]>([]);
  const locations = ref<any[]>([]);
  const districts = ref<any[]>([]);

  const state = reactive({
    saving: false,
    isEditMode: route.name === "buyer-edit",
    isShowMode: route.name === "buyer-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({ apiPath: Buyer_CREATE_API_PATHS.Buyer });

  const form = ref<Buyer>({
    contactNumber: "",
    type: "",
    groupType: "",
    minPrice: 0,
    maxPrice: 0,
    countryId: "",
    locationId: "",
    districtId: "",
    status: true,
    description: "",
  });

  onMounted(async () => {
    try {
      if ((state.isEditMode || state.isShowMode) && route.params.id) {
        await fetchOne(route.params.id as string);
        if (item.value) {
          form.value = { ...item.value };
        }
      }
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    }
    const response = await apiRequest<any>(Buyer_CREATE_API_PATHS.PrepareData, {
      method: "GET",
    });
    propertyType.value = response.data.typeList || [];
    propertyGroupType.value = response.data.groupTypeList || [];
    countries.value = response.data.countryList || [];
    loading.value = false;
  });

  watch(
    () => form.value.countryId,
    async (newVal: any) => {
      if (newVal) {
        const tempCountryId = countries.value.find(
          (country) => country.countryCode === newVal
        )?.code;
        const locationResponse = await apiRequest<any>(
          `${Buyer_CREATE_API_PATHS.Location}${encodeURIComponent(
            tempCountryId
          )}`,
          { method: "GET" }
        );
        locations.value = locationResponse.data || [];
      }
    }
  );

  watch(
    () => form.value.locationId,
    async (newVal: any) => {
      if (newVal) {
        const districtResponse = await apiRequest<any>(
          `${Buyer_CREATE_API_PATHS.District}${encodeURIComponent(newVal)}`,
          { method: "GET" }
        );
        districts.value = districtResponse.data || [];
      }
    }
  );

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const save = async () => {
    if (state.isShowMode) return;

    state.validationErrors = validateBuyerForm(form.value, t);
    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    //  Convert prices to integers before sending
    const sanitizedForm = {
      ...form.value,
      minPrice: parseInt(form.value.minPrice as any, 10) || 0,
      maxPrice: parseInt(form.value.maxPrice as any, 10) || 0,
    };

    state.saving = true;
    try {
      if (state.isEditMode && route.params.id) {
        await updateItem(sanitizedForm);
        showSuccess(t("common.success"), t("buyers.updated"));
      } else {
        console.log(sanitizedForm);
        await createItem(sanitizedForm);
        showSuccess(t("common.success"), t("buyers.created"));
      }
      router.push({ name: indexRouteName });
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
    router.push({ name: indexRouteName });
  };

  return {
    t,
    state,
    form,
    propertyType,
    propertyGroupType,
    countries,
    locations,
    districts,
    save,
    cancel,
    loading,
    error,
  };
}
