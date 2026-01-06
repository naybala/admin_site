export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  list: (params: { page: number; limit: number; search?: string }) =>
    [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, "detail"] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
  permissions: () => ["permissions"] as const,
};
