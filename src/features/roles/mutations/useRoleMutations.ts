import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { rolesApi } from "../api/roles.api";
import { roleKeys } from "../queries/role.keys";
import { useAppToast } from "@/composables/common/useAppToast";
import { useI18n } from "vue-i18n";

export function useRoleMutations() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAppToast();
  const { t } = useI18n();

  const createMutation = useMutation({
    mutationFn: (data: any) => rolesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      showSuccess(t("common.success"), t("roles.roleCreated"));
    },
    onError: (error: any) => {
      showError(t("common.error"), error.message || t("common.errorOccurred"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      rolesApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: roleKeys.detail(variables.id),
      });
      showSuccess(t("common.success"), t("roles.roleUpdated"));
    },
    onError: (error: any) => {
      showError(t("common.error"), error.message || t("common.errorOccurred"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: roleKeys.lists() });
      const previousData = queryClient.getQueriesData({
        queryKey: roleKeys.lists(),
      });

      queryClient.setQueriesData({ queryKey: roleKeys.lists() }, (old: any) => {
        if (!old?.data?.data) return old;
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.filter((item: any) => item.id !== id),
            total: old.data.total - 1,
          },
        };
      });

      return { previousData };
    },
    onSuccess: () => {
      showSuccess(t("common.success"), t("roles.roleDeleted"));
    },
    onError: (_error, _id, context: any) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      showError(t("common.error"), t("common.errorOccurred"));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
