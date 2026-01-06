import { useQuery } from "@tanstack/vue-query";
import { usersApi } from "../api/users.api";
import { userKeys } from "./user.keys";

export function useUserDetail(id: string | null) {
  return useQuery({
    queryKey: userKeys.detail(id!),
    queryFn: () => usersApi.getDetail(id!),
    enabled: !!id,
  });
}
