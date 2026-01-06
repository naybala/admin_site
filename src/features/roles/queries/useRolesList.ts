import { useQuery } from "@tanstack/vue-query";
import { rolesApi } from "../api/roles.api";
import { roleKeys } from "./role.keys";
import type { Ref } from "vue";

export function useRolesList(
  params: Ref<{ page: number; limit: number; search?: string }>
) {
  return useQuery({
    queryKey: roleKeys.list(params.value),
    queryFn: () => rolesApi.getList(params.value),
  });
}
