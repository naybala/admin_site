import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import { validatePlanForm } from "./validatePlanForm";
import { apiRequest } from "../common/useApi";

import type { Plan } from "../../types";

export function usePlanForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();

  // State refs
  const saving = ref(false);
  const loading = ref(false);
  const validationErrors = ref<Record<string, string>>({});
  const hasDuplicateDuration = ref(false);
  const deletedPlans = ref<any[]>([]);

  const countries = ref<any[]>([]);
  const userTypes = ref<any[]>([]);
  const editShowItems = ref<any[]>([]);

  // Route params
  const countryCode = route.params.countryCode ?? null;
  const userType = route.params.userType ?? null;

  const isEditMode = ref(route.name === "plan-edit");
  const isShowMode = ref(route.name === "plan-view");

  // API paths
  const getUserTypesApi = "api/v1/web/users/prepare-data-for-store";
  const getCountriesApi = "api/v1/web/countries/prepare";
  const indexPreApi = "api/v1/web/plans/get-by-country-and-usertype";
  const updatePreApi = "api/v1/web/plans/update-by-country-usertype";
  const createPreApi = "api/v1/web/plans";

  const {
    selectedItem: item,
    customizeApi,
    error,
  } = useCrud<Plan>({
    apiPath: `${updatePreApi}/${countryCode}/${userType}`,
  });

  const form = ref<Plan>({
    name: "",
    userType: "",
    deletedPlans: [],
    countryCode: "",
    price: 0,
    currency: "",
    plans: [
      {
        id: null,
        duration: 1,
        discountPercent: 0,
        vatPercent: 0,
        numAgent: 0,
        numProperty: 0,
        numAuto: 0,
        numDocument: 0,
        numMeasurement: 0,
        pricePerAdvertise: 0,
        pricePerValuation: 0,
      },
    ],
  });

  const initializeFormData = async () => {
    loading.value = true;
    try {
      const [userTypesRes, countriesRes] = await Promise.all([
        apiRequest<any>(getUserTypesApi, { method: "GET" }),
        apiRequest<any>(getCountriesApi, { method: "GET" }),
      ]);

      userTypes.value = userTypesRes.data.userType || [];
      countries.value = countriesRes.data || [];

      if ((isEditMode.value || isShowMode.value) && countryCode && userType) {
        const planRes = await apiRequest<any>(
          `${indexPreApi}/${countryCode}/${userType}`,
          { method: "GET" }
        );

        editShowItems.value = planRes.data || [];
        if (editShowItems.value.length > 0) {
          form.value = { ...editShowItems.value[0] };
        }
      }
    } catch (err: any) {
      console.error("Initialization failed:", err);
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    } finally {
      loading.value = false;
    }
  };

  onMounted(initializeFormData);

  watch(item, (newItem) => {
    if (newItem) {
      form.value = { ...newItem };
    }
  });

  const sanitizeForm = (form: Plan, includeDeleted = false): Plan => {
    const sanitizedPlans = form.plans.map((plan) => {
      const result: any = {
        duration: Number(plan.duration),
        discountPercent: Number(plan.discountPercent),
        vatPercent: Number(plan.vatPercent),
        numAgent: Number(plan.numAgent),
        numProperty: Number(plan.numProperty),
        numAuto: Number(plan.numAuto),
        numDocument: Number(plan.numDocument),
        numMeasurement: Number(plan.numMeasurement),
        pricePerAdvertise: Number(plan.pricePerAdvertise),
        pricePerValuation: Number(plan.pricePerValuation),
      };

      if (plan.id != null) {
        result.id = plan.id;
      }

      return result;
    });

    return {
      ...form,
      price: Number(form.price),
      deletedPlans: includeDeleted ? deletedPlans.value : [],
      plans: sanitizedPlans,
    };
  };

  const save = async () => {
    if (isShowMode.value) return;

    const { errors, hasDuplicateDuration: duplicate } = validatePlanForm(
      form.value,
      t
    );
    validationErrors.value = errors;
    hasDuplicateDuration.value = duplicate;

    if (duplicate) {
      showError(t("common.error"), t("plans.duplicateDuration"));
      return;
    }

    if (Object.keys(errors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    saving.value = true;

    try {
      if (isEditMode.value && countryCode && userType) {
        const sanitized = sanitizeForm(form.value, true);
        await customizeApi(
          sanitized,
          "PUT",
          `${updatePreApi}/${countryCode}/${userType}`
        );
        showSuccess(t("common.success"), t("plans.updated"));
      } else {
        const sanitized = sanitizeForm(form.value);
        await customizeApi(sanitized, "POST", createPreApi);
        showSuccess(t("common.success"), t("plans.created"));
      }

      router.push({ name: "plans" });
    } catch (err: any) {
      console.error("Save failed:", err);
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    } finally {
      saving.value = false;
    }
  };

  const cancel = () => {
    router.push({ name: "plans" });
  };

  return {
    t,
    isShowMode,
    isEditMode,
    form,
    countries,
    userTypes,
    validationErrors,
    save,
    cancel,
    deletedPlans,
    loading,
    error,
    saving,
  };
}
