import type { Agent } from "@customTypes/index";
import { nextTick } from "vue";

export function validateAgentForm(
  form: Agent,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const requiredFields: { field: keyof Agent; errorKey: string }[] = [
    { field: "id", errorKey: "idRequired" },
    { field: "username", errorKey: "usernameRequired" },
    { field: "email", errorKey: "emailRequired" },
    { field: "roleId", errorKey: "roleIdRequired" },
    { field: "phoneNumberPrefix", errorKey: "phoneNumberPrefixRequired" },
    { field: "phoneNumber", errorKey: "phoneNumberRequired" },
  ];

  for (const { field, errorKey } of requiredFields) {
    const value = form[field];
    if (typeof value === "string" && (!value || value.trim() === "")) {
      errors[errorKey] = t(`agents.${errorKey}`);
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
