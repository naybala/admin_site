export const associationKeys = {
  all: ["associations"] as const,
  lists: () => [...associationKeys.all, "list"] as const,
  list: (params: Record<string, any>) =>
    [...associationKeys.lists(), { ...params }] as const,
  detail: (id: string) => [...associationKeys.all, "detail", id] as const,
  countries: () => ["countries"] as const,
  shortNames: () => ["short-names"] as const,
};
