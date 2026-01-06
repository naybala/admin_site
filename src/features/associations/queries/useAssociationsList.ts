import { computed, Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { associationsApi } from "../api/associations.api";
import { associationKeys } from "./association.keys";
import { AssociationListParams } from "@/types";

export function useAssociationsList(params: Ref<AssociationListParams>) {
  const queryKey = computed(() => associationKeys.list(params.value));

  return useQuery({
    queryKey,
    queryFn: () => associationsApi.getList(params.value),
    placeholderData: (previousData) => previousData,
  });
}
