import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { MapPriceOrder } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateMapPriceOrderForm } from "./validateMapPriceOrderForm";
import { MapPriceOrder_CREATE_API_PATHS } from "./apiPaths";
import { apiRequest } from "../common/useApi";

export function useMapPriceOrderForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const orderList = ref<any[]>([]);
  const isUpdate = ref(false);

  const state = reactive({
    saving: false,
    isEditMode: route.name === "mapPriceOrder-edit",
    isShowMode: route.name === "mapPriceOrder-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    updateItem,
  } = useCrud<any>({ apiPath: MapPriceOrder_CREATE_API_PATHS.MapPriceOrder });

  const form = ref<MapPriceOrder>({
    userId: "",
    packageId: "",
    packageName: "",
    transactionPlatform: "",
    transactionRef: "",
    transactionType: "",
    price: 0,
    currencyCode: "",
    duration: "",
    isRenew: false,
    status: "",
    userName: "",
    createdAt: "",
  });

  onMounted(async () => {
    try {
      if ((state.isEditMode || state.isShowMode) && route.params.id) {
        await fetchOne(route.params.id as string);
        if (item.value) {
          form.value = { ...item.value };
          isUpdate.value = form.value.status == "completed" ? true : false;
        }
      }
      const prepareDataResponse = await apiRequest<any>(
        MapPriceOrder_CREATE_API_PATHS.PrepareData,
        {
          method: "POST",
        }
      );
      orderList.value = prepareDataResponse.data.orderTypeList || [];
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    }
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
    state.validationErrors = validateMapPriceOrderForm(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    state.saving = true;
    try {
      if (route.params.id) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("mapPriceOrder.updated"));
      }
      //router.push({ name: "mapPriceOrders" });
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
    router.push({ name: "mapPriceOrders" });
  };

  return {
    t,
    state,
    form,
    save,
    cancel,
    orderList,
    isUpdate,
    loading,
    error,
  };
}
