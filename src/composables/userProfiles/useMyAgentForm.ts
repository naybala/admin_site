import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import { useAppToast } from "../common/useAppToast";
import { validateUserForm } from "@/composables/users/validateUserForm";
import { apiRequest } from "../common/useApi";

import type { User } from "../../types";
import { INDEX_API_PATHS } from "./apiPaths";
import { useAuthUserSocket } from "../realTimeSockets/useAuthUserSocket";
import { useAuthStore } from "@/stores/auth";

export function useMyAgentForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();
  const { userData, fetchUserData } = useAuthUserSocket();
  const authStore = useAuthStore();

  const saving = ref(false);
  const loading = ref(false);

  const countries = ref<any[]>([]);
  const associations = ref<any[]>([]);
  const roles = ref<any[]>([]);
  const userTypes = ref<any[]>([]);
  const validationErrors = ref<Record<string, string>>({});
  console.log(route.name);

  const itemId = route.params.id ?? null;
  const isEditMode = ref(route.name === "my-association-members-edit");
  const isShowMode = ref(route.name === "my-association-members-view");
  const indexRouteName = ref("normal-view");
  const currentUserType = ref<any>("");
  const getAgentRole = ref<any>("");

  const {
    selectedItem: item,
    fetchOne,
    createItem,
    updateItem,
    error,
  } = useCrud<User>({ apiPath: INDEX_API_PATHS.USERS });
  const form = ref<User>({
    username: "",
    email: "",
    phoneNumberPrefix: "",
    phoneNumber: "",
    roleId: "",
    companyId: "",
    userType: "Member",
    imageFiles: null,
    logo: "",
    facebook: "",
    telegram: "",
    fullName: "",
  });

  const fetchFormDependencies = async () => {
    try {
      const [countryAndUserTypeRes, roleRes, associationRes] =
        await Promise.all([
          apiRequest<any>(INDEX_API_PATHS.COUNTRIES_AND_USER_TYPES, {
            method: "GET",
          }),
          apiRequest<any>(INDEX_API_PATHS.ROLES, { method: "GET" }),
          apiRequest<any>(INDEX_API_PATHS.ASSOCIATIONS, { method: "GET" }),
        ]);

      countries.value = countryAndUserTypeRes.data.countryList || [];
      userTypes.value = countryAndUserTypeRes.data.userType || [];
      associations.value = associationRes.data || [];
      roles.value = roleRes.data || [];
      getAgentRole.value = roles.value.find(
        (role: any) => role.name === "Agent"
      );
    } catch (err: any) {
      showError(t("common.error"), err.message || "Failed to load form data");
    }
  };

  const prepareEditOrShowMode = async () => {
    if ((isEditMode.value || isShowMode.value) && itemId) {
      await fetchOne(itemId);

      if (item.value) {
        const { phoneNumber = "", phoneNumberPrefix = "" } = item.value;
        let rawPhone = phoneNumber.startsWith(phoneNumberPrefix)
          ? phoneNumber.slice(phoneNumberPrefix.length)
          : phoneNumber;

        if (rawPhone.startsWith("0")) {
          rawPhone = rawPhone.slice(1);
        }

        form.value = {
          ...item.value,
          phoneNumber: rawPhone,
        };
      }
    }
  };

  const normalizePhoneNumber = () => {
    let rawPhone = form.value.phoneNumber.trim();
    const cleanedPrefix = form.value.phoneNumberPrefix.replace(/\+/g, "");

    // Remove prefix if user entered it manually
    const fullPrefixRegex = new RegExp(`^\\+?${cleanedPrefix}`);
    rawPhone = rawPhone.replace(fullPrefixRegex, "");

    // Remove leading 0 if any
    if (rawPhone.startsWith("0")) {
      rawPhone = rawPhone.slice(1);
    }

    // Return just the cleaned number (no prefix)
    return rawPhone;
  };

  const save = async () => {
    console.log(route.name);

    if (isShowMode.value) return;

    validationErrors.value = validateUserForm(form.value, t);

    if (Object.keys(validationErrors.value).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    saving.value = true;

    try {
      form.value.phoneNumber = normalizePhoneNumber();

      if (isEditMode.value && itemId) {
        console.log(form.value);

        await updateItem(form.value);
        showSuccess(t("common.success"), t("users.updated"));
      } else {
        await createItem(form.value);
        showSuccess(t("common.success"), t("users.created"));
      }

      if (
        currentUserType.value == "Association" ||
        currentUserType.value == "Agency"
      ) {
        router.push({ name: "my-association-members" });
      } else {
        router.push({ name: indexRouteName.value });
      }
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
    if (
      currentUserType.value == "Association" ||
      currentUserType.value == "Agency"
    ) {
      router.push({ name: "my-association-members" });
    } else {
      router.push({ name: indexRouteName.value });
    }
  };

  onMounted(async () => {
    loading.value = true;
    await Promise.all([fetchFormDependencies(), prepareEditOrShowMode()]);
    await fetchUserData({ id: authStore.userId || "" });
    currentUserType.value = userData.value.userType;
    loading.value = false;
  });

  return {
    t,
    isShowMode,
    isEditMode,
    form,
    validationErrors,
    countries,
    associations,
    roles,
    userTypes,
    currentUserType,
    getAgentRole,
    save,
    cancel,
    loading,
    error,
    saving,
  };
}
