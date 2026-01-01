import type { User } from "@customTypes/index";
import { nextTick } from "vue";
import { z } from "zod";

export function validateUserForm(
  form: User,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const userSchema = z.object({
    username: z.string().trim().min(1, { message: "usernameRequired" }),
    email: z
      .string()
      .trim()
      .email({ message: "emailRequired" })
      .or(z.literal(""))
      .or(z.null()),
    phoneNumberPrefix: z
      .string()
      .trim()
      .min(1, { message: "phoneNumberPrefixRequired" }),
    roleId: z
      .string()
      .trim()
      .min(1, { message: "roleIdRequired" })
      .or(z.null()),
    phoneNumber: z.string().trim().min(1, { message: "phoneNumberRequired" }),
    userType: z
      .string()
      .trim()
      .min(1, { message: "userTypeRequired" })
      .or(z.null()),
  });

  const result = userSchema.safeParse(form);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const errorKey = issue.message;
      errors[errorKey] = t(`users.${errorKey}`);
    });
  }

  scrollToFirstErrorField(errors);

  return errors;
}

async function scrollToFirstErrorField(errors: Record<string, string>) {
  const firstErrorKey = Object.keys(errors)[0];
  if (!firstErrorKey) return;
  const baseField = firstErrorKey.replace(/Required$/, "");
  await nextTick();
  const el = document.getElementById(baseField);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
