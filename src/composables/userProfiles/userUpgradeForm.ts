import { ref, onMounted, Ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { CREATE_API_PATHS } from "@/composables/userProfiles/apiPaths";
import { apiRequest } from "../common/useApi";
import { userUpgrade } from "@/types/userUpgrade";
import { useAuthStore } from "@/stores/auth";
import { useCrud } from "../common/useCrud";

export function userUpgradeForm() {
  const { t } = useI18n();
  const saving: Ref<boolean> = ref(false);
  const countries = ref<any>([]);
  const locations = ref<any>([]);
  const districts = ref<any>([]);
  const plans = ref<any>([]);
  const planInfo = ref<any>(null);
  const authStore = useAuthStore();
  const userId: any = authStore.userId || "";
  const orders: any = ref<any>([]);

  const {
    selectedItem: item,
    fetchOne,
    updateItem,
  } = useCrud<any>({
    apiPath: CREATE_API_PATHS.USER_PROFILES,
  });

  const form = ref<userUpgrade>({
    id: authStore.userId,
    phoneNumberPrefix: "",
    locationId: "",
  });

  const validationErrors = ref<Record<string, string>>({});

  const fetchPlans = async (phoneNumberPrefix: string, userType: string) => {
    const tempCountryId = countries.value.find(
      (country: any) => country.code === phoneNumberPrefix
    )?.countryCode;
    if (!tempCountryId) {
      plans.value = [];
      return;
    }

    try {
      const plansResponse = await apiRequest<any>(
        `${CREATE_API_PATHS.Plans}/${tempCountryId}/${userType}`,
        {
          method: "GET",
        }
      );
      plans.value = plansResponse.data[0]?.plans || [];
      planInfo.value = plansResponse.data[0] || null;
    } catch (error) {
      console.error("Fetch plans failed", error);
    }
  };

  const allowedKeys = [
    "email",
    "id",
    "locationId",
    "phoneNumber",
    "phoneNumberPrefix",
    "roleId",
    "userType",
    "userTypeName",
    "username",
  ];

  const cleanForm = (data: any) => {
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedKeys.includes(key))
    );
  };

  const userUpgradeAndOrderSave = async (planId: string) => {
    //remove form unnecessary keys here .
    try {
      const payload = cleanForm(form.value);
      await updateItem(payload, false);
      const orderResponse: any = await apiRequest<any>(
        `${CREATE_API_PATHS.OrderSave}`,
        {
          method: "POST",
          body: JSON.stringify({ planId: planId }),
        }
      );
      orders.value = orderResponse.data;
    } catch (err: any) {
      console.error("Save failed:", err);
    } finally {
      saving.value = false;
    }
  };

  onMounted(async () => {
    const countriesResponse = await apiRequest<any>(CREATE_API_PATHS.Country, {
      method: "GET",
    });
    countries.value = countriesResponse.data || [];
    await fetchOne(userId);
    if (item.value) {
      form.value = {
        ...item.value,
      };
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
        `${CREATE_API_PATHS.Location}${encodeURIComponent(newCountryCode)}`,
        { method: "GET" }
      );
      locations.value = res.data;
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
        { method: "GET" }
      );
      districts.value = res.data;
    },
    { immediate: true }
  );

  return {
    t,
    form,
    validationErrors,
    countries,
    locations,
    plans,
    planInfo,
    fetchPlans,
    userUpgradeAndOrderSave,
    districts,
    saving,
    orders,
  };
}
