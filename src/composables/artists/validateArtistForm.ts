import type { Artist } from "@customTypes/index";
import { nextTick } from "vue";

export function validateArtistForm(
  form: Artist,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const requiredFields: { field: keyof Artist; errorKey: string }[] = [
    { field: "name", errorKey: "nameRequired" },
    { field: "enName", errorKey: "enNameRequired" },
    { field: "gender", errorKey: "genderRequired" },
    { field: "type", errorKey: "typeRequired" },
    { field: "countryId", errorKey: "countryIdRequired" },
    { field: "status", errorKey: "statusRequired" },
  ];

  for (const { field, errorKey } of requiredFields) {
    const value = form[field];
    if (typeof value === "string" && (!value || value.trim() === "")) {
      errors[errorKey] = t(`artists.${errorKey}`);
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
