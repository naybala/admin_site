import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { associationsApi } from "../api/associations.api";
import { associationKeys } from "../queries/association.keys";
import { useAppToast } from "@/composables/common/useAppToast";
import { useI18n } from "vue-i18n";
import type { Association, AssociationIndex } from "@/types";

export function useAssociationMutations() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useAppToast();
  const { t } = useI18n();

  const createMutation = useMutation({
    mutationFn: (data: Partial<Association>) => associationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: associationKeys.lists() });
      showSuccess(t("common.success"), t("associations.created"));
    },
    onError: (error: any) => {
      showError(
        t("common.error"),
        error.message || "Failed to create association"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Association> }) =>
      associationsApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: associationKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: associationKeys.detail(variables.id),
      });
      showSuccess(t("common.success"), t("associations.updated"));
    },
    onError: (error: any) => {
      showError(
        t("common.error"),
        error.message || "Failed to update association"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => associationsApi.delete(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: associationKeys.lists() });

      // Snapshot the previous value
      const previousLists = queryClient.getQueriesData<AssociationIndex>({
        queryKey: associationKeys.lists(),
      });

      // Optimistically update to the new value
      queryClient.setQueriesData<AssociationIndex>(
        { queryKey: associationKeys.lists() },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((item: any) => item.id !== id),
            total: old.total - 1,
          };
        }
      );

      // Return a context object with the snapshotted value
      return { previousLists };
    },
    onError: (err, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      showError(
        t("common.error"),
        err.message || "Failed to delete association"
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: associationKeys.lists() });
    },
    onSuccess: () => {
      showSuccess(t("common.success"), t("associations.deleted"));
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
