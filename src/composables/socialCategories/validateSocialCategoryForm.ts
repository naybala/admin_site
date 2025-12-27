import type { SocialCategory } from "@customTypes/index";
import { nextTick } from "vue";

export function validateSocialCategoryForm(
  form: SocialCategory,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const requiredFields: { field: keyof SocialCategory; errorKey: string }[] = [
    { field: "id", errorKey: "idRequired" },
    { field: "code", errorKey: "codeRequired" },
    { field: "name", errorKey: "nameRequired" },
    { field: "type", errorKey: "typeRequired" },
    { field: "status", errorKey: "statusRequired" },
  ];

  for (const { field, errorKey } of requiredFields) {
    const value = form[field];
    if (typeof value === "string" && (!value || value.trim() === "")) {
      errors[errorKey] = t(`socialCategories.${errorKey}`);
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
    el.focus?.();
  }
}
