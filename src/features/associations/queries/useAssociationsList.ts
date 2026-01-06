import { useQuery } from "@tanstack/vue-query";
import { associationsApi } from "../api/associations.api";
import { associationKeys } from "./association.keys";
import type { Ref } from "vue";

export function useAssociationsList(
  params: Ref<{ page: number; limit: number; search?: string }>
) {
  return useQuery({
    queryKey: associationKeys.list(params),
    queryFn: () => associationsApi.getList(params.value),
  });
}
