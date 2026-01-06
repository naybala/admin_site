export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: any) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  prepareData: () => ["users", "prepareData"] as const,
  roles: () => ["users", "roles"] as const,
  associations: () => ["users", "associations"] as const,
};
