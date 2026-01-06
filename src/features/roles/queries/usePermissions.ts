import { useQuery } from "@tanstack/vue-query";
import { rolesApi } from "../api/roles.api";
import { roleKeys } from "./role.keys";

export function usePermissions() {
  return useQuery({
    queryKey: roleKeys.permissions(),
    queryFn: () => rolesApi.getAllPermissions(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
