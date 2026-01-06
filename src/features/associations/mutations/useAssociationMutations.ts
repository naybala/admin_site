import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { associationsApi } from "../api/associations.api";
import { associationKeys } from "../queries/association.keys";
import { useAppToast } from "@/composables/common/useAppToast";
import { useI18n } from "vue-i18n";
import type { AssociationIndex, Association } from "@/types";

export function useAssociationMutations() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAppToast();
  const { t } = useI18n();

  /* ---------- CREATE ---------- */
  const createMutation = useMutation({
    mutationFn: associationsApi.create,

    onMutate: async (newAssoc) => {
      await queryClient.cancelQueries({
        queryKey: associationKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<AssociationIndex>({
        queryKey: associationKeys.lists(),
      });

      previousLists.forEach(([key, data]) => {
        if (!data) return;

        queryClient.setQueryData<AssociationIndex>(key, {
          ...data,
          data: [
            {
              ...(newAssoc as Association),
              id: `temp-${Date.now()}`,
              __optimistic: true,
            },
            ...data.data,
          ],
          total: data.total + 1,
        });
      });

      return { previousLists };
    },

    onError: (err: any, _v, ctx) => {
      ctx?.previousLists.forEach(([k, d]) => queryClient.setQueryData(k, d));
      showError(t("common.error"), err.message);
    },

    onSuccess: () => {
      showSuccess(t("common.success"), t("associations.created"));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: associationKeys.lists(),
      });
    },
  });

  /* ---------- UPDATE ---------- */
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => associationsApi.update(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: associationKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<AssociationIndex>({
        queryKey: associationKeys.lists(),
      });

      previousLists.forEach(([key, list]) => {
        if (!list) return;

        queryClient.setQueryData<AssociationIndex>(key, {
          ...list,
          data: list.data.map((i) => (i.id === id ? { ...i, ...data } : i)),
        });
      });

      return { previousLists };
    },

    onError: (err: any, _v, ctx) => {
      ctx?.previousLists.forEach(([k, d]) => queryClient.setQueryData(k, d));
      showError(t("common.error"), err.message);
    },

    onSuccess: (_d, vars) => {
      showSuccess(t("common.success"), t("associations.updated"));
      queryClient.invalidateQueries({
        queryKey: associationKeys.detail(vars.id),
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: associationKeys.lists(),
      });
    },
  });

  /* ---------- DELETE ---------- */
  const deleteMutation = useMutation({
    mutationFn: associationsApi.delete,

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: associationKeys.lists(),
      });

      const previousLists = queryClient.getQueriesData<AssociationIndex>({
        queryKey: associationKeys.lists(),
      });

      previousLists.forEach(([key, data]) => {
        if (!data) return;

        queryClient.setQueryData<AssociationIndex>(key, {
          ...data,
          data: data.data.filter((i) => i.id !== id),
          total: data.total - 1,
        });
      });

      return { previousLists };
    },

    onError: (err: any, _id, ctx) => {
      ctx?.previousLists.forEach(([k, d]) => queryClient.setQueryData(k, d));
      showError(t("common.error"), err.message);
    },

    onSuccess: () => {
      showSuccess(t("common.success"), t("associations.deleted"));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: associationKeys.lists(),
      });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
