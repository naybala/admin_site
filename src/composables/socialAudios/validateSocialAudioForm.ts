import type { SocialAudio } from "@customTypes/index";
import { nextTick } from "vue";

export function validateSocialAudioForm(
  form: SocialAudio,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const requiredFields: { field: keyof SocialAudio; errorKey: string }[] = [
    { field: "title", errorKey: "titleRequired" },
    { field: "category", errorKey: "categoryRequired" },
    { field: "audioLink", errorKey: "audioLinkRequired" },
    { field: "status", errorKey: "statusRequired" },
    { field: "artistId", errorKey: "artistIdRequired" },
    { field: "countryId", errorKey: "countryIdRequired" },
    { field: "typeId", errorKey: "typeIdRequired" },
  ];

  for (const { field, errorKey } of requiredFields) {
    const value = form[field];
    if (typeof value === "string" && (!value || value.trim() === "")) {
      errors[errorKey] = t(`socialAudios.${errorKey}`);
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
