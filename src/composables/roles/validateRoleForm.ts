import type { Role } from "@customTypes/index";
import { z } from "zod";

export function validateRoleForm(
  role: Role,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const roleSchema = z.object({
    name: z.string().trim().min(1, { message: "nameRequired" }),
  });

  const result = roleSchema.safeParse(role);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const errorKey = issue.message;
      errors.name = t(`roles.${errorKey}`);
    });
  }

  return errors;
}
