import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { usersApi } from "../api/users.api";
import { userKeys } from "../queries/user.keys";
import { useAppToast } from "@/composables/common/useAppToast";
import { useI18n } from "vue-i18n";

export function useUserMutations() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAppToast();
  const { t } = useI18n();

  const createMutation = useMutation({
    mutationFn: (data: any) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      showSuccess(t("common.success"), t("users.created"));
    },
    onError: (error: any) => {
      showError(t("common.error"), error.message || t("common.errorOccurred"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      usersApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      showSuccess(t("common.success"), t("users.updated"));
    },
    onError: (error: any) => {
      showError(t("common.error"), error.message || t("common.errorOccurred"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: userKeys.lists() });
      const previousData = queryClient.getQueriesData({
        queryKey: userKeys.lists(),
      });

      queryClient.setQueriesData({ queryKey: userKeys.lists() }, (old: any) => {
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
      showSuccess(t("common.success"), t("users.deleted"));
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
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
