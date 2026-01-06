import { useQuery } from "@tanstack/vue-query";
import { associationsApi } from "../api/associations.api";
import { associationKeys } from "./association.keys";

export function useCountries() {
  return useQuery({
    queryKey: associationKeys.countries(),
    queryFn: () => associationsApi.getCountries(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useShortNames() {
  return useQuery({
    queryKey: associationKeys.shortNames(),
    queryFn: () => associationsApi.getShortNames(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
