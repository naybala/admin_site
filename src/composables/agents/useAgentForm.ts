import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { Agent } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateAgentForm } from "./validateAgentForm";
import { Agent_CREATE_API_PATHS } from "./apiPaths";
import { apiRequest } from "../common/useApi";

export function useAgentForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const userTypes = ref<any[]>([]);
  const roles = ref<any[]>([]);
  const countries = ref<any[]>([]);
  const indexRouteName = "agents";
  const userType = "Agent";

  const state = reactive({
    saving: false,
    isEditMode: route.name === "agent-edit",
    isShowMode: route.name === "agent-view",
    validationErrors: {} as Record<string, string>,
  });

  const {
    selectedItem: item,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({ apiPath: Agent_CREATE_API_PATHS.Agent });

  const form = ref<Agent>({
    username: "",
    email: "",
    phoneNumberPrefix: "",
    phoneNumber: "",
    roleId: "",
    imageFiles: "",
    userType: userType,
    facebook: "",
    telegram: "",
  });

  onMounted(async () => {
    try {
      const fetchItemPromise = (async () => {
        if ((state.isEditMode || state.isShowMode) && route.params.id) {
          await fetchOne(route.params.id as string);
          if (item.value) {
            form.value = { ...item.value };
          }
        }
      })();

      const [countryAndUserTypeResponse, roleResponse] = await Promise.all([
        apiRequest<any>(Agent_CREATE_API_PATHS.COUNTRIES_AND_USER_TYPES, {
          method: "GET",
        }),
        apiRequest<any>(Agent_CREATE_API_PATHS.ROLES, {
          method: "GET",
        }),
        fetchItemPromise,
      ]);

      countries.value = countryAndUserTypeResponse.data.countryList;
      roles.value = roleResponse.data;
      userTypes.value = countryAndUserTypeResponse.data.userType;
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    }
    loading.value = false;
  });

  watch(item, (newVal) => {
    if (newVal) {
      form.value = { ...newVal };
    }
  });

  const save = async () => {
    if (state.isShowMode) return;

    state.validationErrors = validateAgentForm(form.value, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    state.saving = true;
    try {
      let rawPhone = form.value.phoneNumber?.trim() || "";
      const cleanedPrefix =
        form.value.phoneNumberPrefix?.replace(/\+/g, "") || "";

      // Remove leading 0
      if (rawPhone.startsWith("0")) {
        rawPhone = rawPhone.substring(1);
      }

      // Remove all prefix occurrences to avoid duplication
      const fullPrefixRegex = new RegExp(`^\\+?${cleanedPrefix}`);
      rawPhone = rawPhone.replace(fullPrefixRegex, "");

      // Final normalized phone number
      form.value.phoneNumber = `+${cleanedPrefix}${rawPhone}`;
      if (state.isEditMode && route.params.id) {
        await updateItem(form.value);
        showSuccess(t("common.success"), t("agent.updated"));
      } else {
        await createItem(form.value);
        showSuccess(t("common.success"), t("agent.created"));
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
    save,
    cancel,
    roles,
    userTypes,
    countries,
    loading,
    error,
  };
}
