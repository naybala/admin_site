import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useRoleDetail } from "../queries/useRoleDetail";
import { usePermissions } from "../queries/usePermissions";
import { useRoleMutations } from "../mutations/useRoleMutations";
import { roleSchema, type RoleFormValues } from "../schema/role.schema";
import { useAppToast } from "@/composables/common/useAppToast";

export function useRoleForm() {
  const router = useRouter();
  const route = useRoute();
  const { t } = useI18n();
  const { showError } = useAppToast();

  const id = route.params.id as string;
  const isEditMode = route.name === "role-edit";
  const isShowMode = route.name === "role-view";

  const { data: detail, isLoading: isLoadingDetail } = useRoleDetail(id);
  const { data: permissionsRes } = usePermissions();
  const { createMutation, updateMutation } = useRoleMutations();

  const permissions = computed(() => permissionsRes.value?.data);

  const form = ref<RoleFormValues>({
    name: "",
    description: null,
    permissions: [],
  });

  const validationErrors = ref<Record<string, string>>({});

  watch(
    detail,
    (newVal: any) => {
      if (newVal?.data?.role) {
        form.value = {
          ...form.value,
          ...newVal.data.role,
        };
      }
    },
    { immediate: true }
  );

  const validate = () => {
    const result = roleSchema.safeParse(form.value);
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

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({ id, data: form.value });
      } else {
        await createMutation.mutateAsync(form.value);
      }

      router.push({ name: "roles" });
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleCancel = () => router.push({ name: "roles" });

  const saving = computed(
    () => createMutation.isPending.value || updateMutation.isPending.value
  );
  const loading = computed(() => id && isLoadingDetail.value);

  return {
    t,
    isShowMode,
    isEditMode,
    form,
    permissions,
    validationErrors,
    handleSave,
    handleCancel,
    loading,
    saving,
  };
}
