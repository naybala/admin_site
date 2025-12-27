export function groupPermissions(perms: string[]) {
  const grouped: Record<string, string[]> = {};

  perms.forEach((perm) => {
    const parts = perm.split(" ");
    const entity = parts.slice(1).join(" "); // e.g. "users"

    if (!grouped[entity]) {
      grouped[entity] = [];
    }

    grouped[entity].push(perm);
  });

  return grouped;
}
