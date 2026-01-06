import { useQuery } from "@tanstack/vue-query";
import { usersApi } from "../api/users.api";
import { userKeys } from "./user.keys";

export function useUserFilters() {
  const prepareData = useQuery({
    queryKey: userKeys.prepareData(),
    queryFn: () => usersApi.getPrepareData(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const roles = useQuery({
    queryKey: userKeys.roles(),
    queryFn: () => usersApi.getRoles(),
    staleTime: 1000 * 60 * 60,
  });

  const associations = useQuery({
    queryKey: userKeys.associations(),
    queryFn: () => usersApi.getAssociations(),
    staleTime: 1000 * 60 * 60,
  });

  return {
    prepareData,
    roles,
    associations,
  };
}
