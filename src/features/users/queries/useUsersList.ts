import { useQuery } from "@tanstack/vue-query";
import { usersApi } from "../api/users.api";
import { userKeys } from "./user.keys";
import type { Ref } from "vue";

export function useUsersList(params: Ref<any>) {
  return useQuery({
    queryKey: userKeys.list(params.value),
    queryFn: () => usersApi.getList(params.value),
  });
}
