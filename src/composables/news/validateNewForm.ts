import type { New } from "@customTypes/index";
import { nextTick } from "vue";

export function validateNewForm(
  form: New,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const requiredFields: { field: keyof New; errorKey: string }[] = [
    { field: "title", errorKey: "titleRequired" },
    { field: "countryCode", errorKey: "countryIdRequired" },
    { field: "type", errorKey: "newsTypeIdRequired" },
    { field: "category", errorKey: "newsCategoryIdRequired" },
  ];

  for (const { field, errorKey } of requiredFields) {
    const value = form[field];
    if (typeof value === "string" && (!value || value.trim() === "")) {
      errors[errorKey] = t(`news.${errorKey}`);
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
