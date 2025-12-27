import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useConfirm } from "primevue/useconfirm";
import { useAppToast } from "../common/useAppToast";
import type { Plan, PlanIndex } from "@customTypes/index";
import { apiRequest } from "../common/useApi";

export function usePlanTable() {
  const router = useRouter();
  const { t } = useI18n();
  const confirm = useConfirm();
  const { showSuccess, showInfo, showError } = useAppToast();

  const items = ref<PlanIndex[]>([]);
  const countries = ref<any[]>([]);
  const defaultCountry = ref("KH");
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchAllData = async () => {
    try {
      loading.value = true;
      const response = await apiRequest<any>(
        `api/v1/web/plans/?countryCode=${defaultCountry.value}`,
        { method: "GET" }
      );
      items.value = response.data || [];
    } catch (err: any) {
      console.error("Fetch error:", err);
      error.value = err.message || "Something went wrong";
    } finally {
      loading.value = false;
    }
  };

  onMounted(async () => {
    const countryResponse = await apiRequest<any>(
      "api/v1/web/countries/prepare",
      {
        method: "GET",
      }
    );
    countries.value = countryResponse.data || [];
    await fetchAllData();
  });

  watch(defaultCountry, async (newVal) => {
    defaultCountry.value = newVal;
    await fetchAllData();
  });

  const openNewForm = () => {
    router.push({ name: "plan-new" });
  };

  const editItem = (item: Plan) => {
    router.push({
      name: "plan-edit",
      params: { countryCode: item.countryCode, userType: item.userType },
    });
  };

  const viewItem = (item: Plan) => {
    router.push({
      name: "plan-view",
      params: { countryCode: item.countryCode, userType: item.userType },
    });
  };

  const confirmDeleteItem = (item: Plan) => {
    confirm.require({
      message: t("plans.confirmDelete"),
      icon: "pi pi-exclamation-triangle",
      acceptClass: "p-button-danger",
      accept: async () => {
        try {
          await apiRequest(`api/v1/web/plans/${item.id}`, { method: "DELETE" });
          showSuccess(t("common.success"), t("plans.deleted"));
          await fetchAllData();
        } catch (err: any) {
          showError(err.message || "Delete failed");
        }
      },
      reject: () => {
        showInfo(t("common.info"), t("plans.notDeleted"));
      },
    });
  };

  return {
    t,
    items,
    loading,
    error,
    countries,
    defaultCountry,
    fetchAllData,
    openNewForm,
    viewItem,
    editItem,
    confirmDeleteItem,
  };
}
