import type { Listing } from "@customTypes/index";
import { nextTick } from "vue";

export function validateListingForm(
  form: Listing,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};
  const requiredFields: { field: keyof Listing; errorKey: string }[] = [
    { field: "phoneNumberPrefix", errorKey: "phoneNumberPrefixRequired" },
    { field: "locationId", errorKey: "locationIdRequired" },
    { field: "districtId", errorKey: "districtIdRequired" },
    { field: "type", errorKey: "typeRequired" },
    { field: "groupType", errorKey: "groupTypeRequired" },
    { field: "titleType", errorKey: "titleTypeRequired" },
    { field: "currencySymbol", errorKey: "currencySymbolRequired" },
    { field: "dimension", errorKey: "dimensionRequired" },
    { field: "price", errorKey: "priceRequired" },
    { field: "lastPrice", errorKey: "lastPriceRequired" },
  ];

  for (const { field, errorKey } of requiredFields) {
    const value = form[field];
    if (typeof value === "string" && (!value || value.trim() === "")) {
      errors[errorKey] = t(`listings.${errorKey}`);
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
