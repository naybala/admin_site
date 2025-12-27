import type { Role } from "@customTypes/index";

export function validateRoleForm(
  role: Role,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!role.name || role.name.trim() === "") {
    errors.name = t("roles.nameRequired");
  }

  return errors;
}
