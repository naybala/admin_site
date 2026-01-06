import { useQuery } from "@tanstack/vue-query";
import { rolesApi } from "../api/roles.api";
import { roleKeys } from "./role.keys";

export function useRoleDetail(id: string | null) {
  return useQuery({
    queryKey: roleKeys.detail(id!),
    queryFn: () => rolesApi.getDetail(id!),
    enabled: !!id,
  });
}
