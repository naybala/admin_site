import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useUserDetail } from "../queries/useUserDetail";
import { useUserFilters } from "../queries/useUserFilters";
import { useUserMutations } from "../mutations/useUserMutations";
import { userSchema, type UserFormValues } from "../schema/user.schema";
import { useAppToast } from "@/composables/common/useAppToast";
import { useAuthUserSocket } from "@/composables/realTimeSockets/useAuthUserSocket";
import { useAuthStore } from "@/stores/auth";

export function useUserForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showError } = useAppToast();
  const { userData, fetchUserData } = useAuthUserSocket();
  const authStore = useAuthStore();

  const id = route.params.id as string;
  const isEditMode = route.name === "user-edit";
  const isShowMode = route.name === "user-view";

  const { data: detail, isLoading: isLoadingDetail } = useUserDetail(id);
  const { prepareData, roles, associations } = useUserFilters();
  const { createMutation, updateMutation } = useUserMutations();

  const countries = computed(
    () => prepareData.data.value?.data?.countryList || []
  );
  const userTypes = computed(
    () => prepareData.data.value?.data?.userType || []
  );
  const rolesOptions = computed(() => roles.data.value?.data || []);
  const associationsOptions = computed(
    () => associations.data.value?.data || []
  );
  const currentUserType = computed(() => userData.value?.userType || "");
  const getAgentRole = computed(() =>
    rolesOptions.value.find((role: any) => role.name === "Agent")
  );

  const form = ref<UserFormValues>({
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

  const validationErrors = ref<Record<string, string>>({});

  // Watch for detail data and populate form
  const watchDetail = () => {
    if (detail.value?.data) {
      const userData = detail.value.data;
      let rawPhone = userData.phoneNumber || "";
      const prefix = userData.phoneNumberPrefix || "";

      if (rawPhone.startsWith(prefix)) {
        rawPhone = rawPhone.slice(prefix.length);
      }
      if (rawPhone.startsWith("0")) {
        rawPhone = rawPhone.slice(1);
      }

      form.value = {
        ...form.value,
        ...userData,
        phoneNumber: rawPhone,
      };
    }
  };

  // Initialize user data
  const initialize = async () => {
    await fetchUserData({ id: authStore.userId || "" });
    if (detail.value) {
      watchDetail();
    }
  };

  const normalizePhoneNumber = () => {
    let rawPhone = form.value.phoneNumber.trim();
    const cleanedPrefix = form.value.phoneNumberPrefix.replace(/\+/g, "");
    const fullPrefixRegex = new RegExp(`^\\+?${cleanedPrefix}`);
    rawPhone = rawPhone.replace(fullPrefixRegex, "");
    if (rawPhone.startsWith("0")) {
      rawPhone = rawPhone.slice(1);
    }
    return rawPhone;
  };

  const validate = () => {
    const result = userSchema.safeParse(form.value);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      validationErrors.value = errors;
      return false;
    }
    validationErrors.value = {};
    return true;
  };

  const handleSave = async () => {
    if (!validate()) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    const preparedForm = {
      ...form.value,
      phoneNumber: normalizePhoneNumber(),
    };

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: preparedForm });
      } else {
        await createMutation.mutateAsync(preparedForm);
      }

      if (
        currentUserType.value === "Association" ||
        currentUserType.value === "Agency"
      ) {
        router.push({ name: "my-association-members" });
      } else {
        router.push({ name: "users" });
      }
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleCancel = () => {
    if (
      currentUserType.value === "Association" ||
      currentUserType.value === "Agency"
    ) {
      router.push({ name: "my-association-members" });
    } else {
      router.push({ name: "users" });
    }
  };

  const saving = computed(
    () => createMutation.isPending.value || updateMutation.isPending.value
  );
  const loading = computed(
    () => (id && isLoadingDetail.value) || prepareData.isLoading.value
  );

  return {
    t,
    isShowMode,
    isEditMode,
    form,
    countries,
    userTypes,
    rolesOptions,
    associationsOptions,
    currentUserType,
    getAgentRole,
    validationErrors,
    handleSave,
    handleCancel,
    loading,
    saving,
    initialize,
  };
}
