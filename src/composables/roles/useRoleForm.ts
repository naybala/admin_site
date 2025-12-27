import { ref, onMounted, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCrud } from "../common/useCrud";
import type { PermissionsData, Role } from "../../types";
import { useAppToast } from "../common/useAppToast";
import { validateRoleForm } from "./validateRoleForm";
import { apiRequest } from "../common/useApi";
import { ROLE_CREATE_API_PATHS } from "./apiPaths";

interface RoleFetchResponse {
  role: Role;
  hasAllPermissionStatus: Record<string, boolean>;
}

export function useRoleForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showSuccess, showError } = useAppToast();

  const state = reactive({
    saving: false,
    isEditMode: route.name === "role-edit",
    isShowMode: route.name === "role-view",
    validationErrors: {} as Record<string, string>,
  });

  const permissions = ref<PermissionsData | undefined>(); // Could be better typed later

  const {
    selectedItem: role,
    loading,
    error,
    fetchOne,
    createItem,
    updateItem,
  } = useCrud<any>({
    apiPath: ROLE_CREATE_API_PATHS.ROLES,
  });

  //  Use reactive form instead of ref
  const roleForm = reactive<Role>({
    name: "",
    description: "",
    permissions: [],
  });

  //  On mount: fetch role (if editing/viewing) and permissions
  onMounted(async () => {
    try {
      if ((state.isEditMode || state.isShowMode) && route.params.id) {
        await fetchOne(route.params.id as string);

        const fetched = role.value as RoleFetchResponse;
        if (fetched?.role) {
          Object.assign(roleForm, fetched.role);
        }
      }

      const response = await apiRequest<any>(
        ROLE_CREATE_API_PATHS.ALL_PERMISSIONS,
        {
          method: "GET",
        }
      );

      permissions.value = response.data;
      loading.value = false;
    } catch (err: any) {
      showError(
        t("common.error"),
        err.message || "An unexpected error occurred"
      );
    }
  });

  // Watch for external role changes (probably unnecessary if fetchOne is direct)
  watch(role, (newVal) => {
    if (newVal && "name" in newVal) {
      const data = (newVal as RoleFetchResponse).role || (newVal as Role);
      Object.assign(roleForm, data);
    }
  });

  //  Save role
  const saveRole = async () => {
    if (state.isShowMode) return;

    // Validate
    state.validationErrors = validateRoleForm(roleForm, t);

    if (Object.keys(state.validationErrors).length > 0) {
      showError(t("common.error"), t("common.validationError"));
      return;
    }

    state.saving = true;
    try {
      if (state.isEditMode && route.params.id) {
        await updateItem(roleForm);
        showSuccess(t("common.success"), t("roles.roleUpdated"));
      } else {
        await createItem(roleForm);
        showSuccess(t("common.success"), t("roles.roleCreated"));
      }

      router.push({ name: "roles" });
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
    router.push({ name: "roles" });
  };

  return {
    t,
    state,
    roleForm,
    saveRole,
    cancel,
    loading,
    error,
    permissions,
  };
}
