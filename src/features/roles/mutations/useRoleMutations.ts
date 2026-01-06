import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { rolesApi } from "../api/roles.api";
import { roleKeys } from "../queries/role.keys";
import { useAppToast } from "@/composables/common/useAppToast";
import { useI18n } from "vue-i18n";

export function useRoleMutations() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAppToast();
  const { t } = useI18n();

  /* ===================== CREATE ===================== */
  const createMutation = useMutation({
    mutationFn: (data: any) => rolesApi.create(data),

    onMutate: async (newRole) => {
      await queryClient.cancelQueries({
        queryKey: roleKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<any>({
        queryKey: roleKeys.lists(),
      });

      previousLists.forEach(([queryKey, data]) => {
        if (!data?.data?.data) return;

        queryClient.setQueryData(queryKey, {
          ...data,
          data: {
            ...data.data,
            data: [
              {
                ...newRole,
                id: `temp-${Date.now()}`,
              },
              ...data.data.data,
            ],
            total: data.data.total + 1,
          },
        });
      });

      return { previousLists };
    },

    onError: (error: any, _vars, context) => {
      context?.previousLists.forEach(([queryKey, data]: [any, any]) => {
        queryClient.setQueryData(queryKey, data);
      });

      showError(t("common.error"), error.message || t("common.errorOccurred"));
    },

    onSuccess: () => {
      showSuccess(t("common.success"), t("roles.roleCreated"));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.lists(),
      });
    },
  });

  /* ===================== UPDATE ===================== */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      rolesApi.update(id, data),

    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: roleKeys.lists(),
      });
      await queryClient.cancelQueries({
        queryKey: roleKeys.detail(id),
      });

      // Snapshot previous values
      const previousLists = queryClient.getQueriesData<any>({
        queryKey: roleKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData<any>(roleKeys.detail(id));

      // Optimistically update lists
      previousLists.forEach(([queryKey, list]) => {
        if (!list?.data?.data) return;

        queryClient.setQueryData(queryKey, {
          ...list,
          data: {
            ...list.data,
            data: list.data.data.map((item: any) =>
              item.id === id ? { ...item, ...data } : item
            ),
          },
        });
      });

      // Optimistically update detail
      if (previousDetail?.data?.role) {
        queryClient.setQueryData(roleKeys.detail(id), {
          ...previousDetail,
          data: {
            ...previousDetail.data,
            role: {
              ...previousDetail.data.role,
              ...data,
            },
          },
        });
      }

      return { previousLists, previousDetail };
    },

    onError: (error: any, { id }, context) => {
      // Rollback on error
      context?.previousLists.forEach(([queryKey, data]: [any, any]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousDetail) {
        queryClient.setQueryData(roleKeys.detail(id), context.previousDetail);
      }

      showError(t("common.error"), error.message || t("common.errorOccurred"));
    },

    onSuccess: () => {
      showSuccess(t("common.success"), t("roles.roleUpdated"));
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: roleKeys.detail(variables.id),
      });
    },
  });

  /* ===================== DELETE ===================== */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: roleKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<any>({
        queryKey: roleKeys.lists(),
      });

      previousLists.forEach(([queryKey, data]) => {
        if (!data?.data?.data) return;

        queryClient.setQueryData(queryKey, {
          ...data,
          data: {
            ...data.data,
            data: data.data.data.filter((item: any) => item.id !== id),
            total: data.data.total - 1,
          },
        });
      });

      return { previousLists };
    },

    onError: (error: any, _id, context) => {
      context?.previousLists.forEach(([queryKey, data]: [any, any]) => {
        queryClient.setQueryData(queryKey, data);
      });

      showError(t("common.error"), error.message || t("common.errorOccurred"));
    },

    onSuccess: () => {
      showSuccess(t("common.success"), t("roles.roleDeleted"));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.lists(),
      });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
