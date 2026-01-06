import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { usersApi } from "../api/users.api";
import { userKeys } from "../queries/user.keys";
import { useAppToast } from "@/composables/common/useAppToast";
import { useI18n } from "vue-i18n";

export function useUserMutations() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAppToast();
  const { t } = useI18n();

  /* ===================== CREATE ===================== */
  const createMutation = useMutation({
    mutationFn: (data: any) => usersApi.create(data),

    onMutate: async (newUser) => {
      await queryClient.cancelQueries({
        queryKey: userKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<any>({
        queryKey: userKeys.lists(),
      });

      previousLists.forEach(([queryKey, data]) => {
        if (!data?.data?.data) return;

        queryClient.setQueryData(queryKey, {
          ...data,
          data: {
            ...data.data,
            data: [
              {
                ...newUser,
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
      showSuccess(t("common.success"), t("users.created"));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });

  /* ===================== UPDATE ===================== */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      usersApi.update(id, data),

    onMutate: async ({ id, data }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: userKeys.lists(),
      });
      await queryClient.cancelQueries({
        queryKey: userKeys.detail(id),
      });

      // Snapshot previous values
      const previousLists = queryClient.getQueriesData<any>({
        queryKey: userKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData<any>(userKeys.detail(id));

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
      if (previousDetail?.data?.user) {
        queryClient.setQueryData(userKeys.detail(id), {
          ...previousDetail,
          data: {
            ...previousDetail.data,
            user: {
              ...previousDetail.data.user,
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
        queryClient.setQueryData(userKeys.detail(id), context.previousDetail);
      }

      showError(t("common.error"), error.message || t("common.errorOccurred"));
    },

    onSuccess: () => {
      showSuccess(t("common.success"), t("users.updated"));
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
    },
  });

  /* ===================== DELETE ===================== */
  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: userKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<any>({
        queryKey: userKeys.lists(),
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
      showSuccess(t("common.success"), t("users.deleted"));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
