import type { User } from "@customTypes/index";
import { nextTick } from "vue";

export function validateUserForm(
  form: User,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const requiredFields: { field: keyof User; errorKey: string }[] = [
    { field: "username", errorKey: "usernameRequired" },
    { field: "email", errorKey: "emailRequired" },
    { field: "phoneNumberPrefix", errorKey: "phoneNumberPrefixRequired" },
    { field: "roleId", errorKey: "roleIdRequired" },
    { field: "phoneNumber", errorKey: "phoneNumberRequired" },
    { field: "userType", errorKey: "userTypeRequired" },
  ];

  for (const { field, errorKey } of requiredFields) {
    const value = form[field];
    if (typeof value === "string" && (!value || value.trim() === "")) {
      errors[errorKey] = t(`users.${errorKey}`);
    }
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
