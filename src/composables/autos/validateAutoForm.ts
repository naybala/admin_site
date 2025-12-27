import type { Auto } from "@customTypes/index";
import { nextTick } from "vue";

export function validateAutoForm(
  form: Auto,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};
  const requiredFields: { field: keyof Auto; errorKey: string }[] = [
    { field: "title", errorKey: "titleRequired" },
    { field: "autoType", errorKey: "autoTypeRequired" },
    { field: "autoCondition", errorKey: "autoConditionRequired" },
    { field: "groupType", errorKey: "groupTypeRequired" },
    { field: "price", errorKey: "priceRequired" },
    { field: "countryCode", errorKey: "countryCodeRequired" },
    { field: "currencyCode", errorKey: "currencyCodeRequired" },
    { field: "currencySymbol", errorKey: "currencySymbolRequired" },
    { field: "phoneNumberPrefix", errorKey: "phoneNumberPrefixRequired" },
    { field: "status", errorKey: "statusRequired" },
    { field: "locationId", errorKey: "locationIdRequired" },
    { field: "position", errorKey: "positionRequired" },
  ];

  for (const { field, errorKey } of requiredFields) {
    const value = form[field];
    if (typeof value === "string" && (!value || value.trim() === "")) {
      errors[errorKey] = t(`autos.${errorKey}`);
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
