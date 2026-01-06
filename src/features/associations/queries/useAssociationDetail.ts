import { useQuery } from "@tanstack/vue-query";
import { associationsApi } from "../api/associations.api";
import { associationKeys } from "./association.keys";

export function useAssociationDetail(id: string) {
  return useQuery({
    queryKey: associationKeys.detail(id),
    queryFn: () => associationsApi.getDetail(id),
    enabled: !!id,
  });
}
