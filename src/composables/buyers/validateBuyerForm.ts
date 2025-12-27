import type { Buyer } from "@customTypes/index";
import { nextTick } from "vue";

export function validateBuyerForm(
  form: Buyer,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const requiredFields: { field: keyof Buyer; errorKey: string }[] = [
    { field: "id", errorKey: "idRequired" },
    { field: "contactNumber", errorKey: "contactNumberRequired" },
    { field: "type", errorKey: "typeRequired" },
    { field: "groupType", errorKey: "groupTypeRequired" },
    { field: "minPrice", errorKey: "minPriceRequired" },
    { field: "maxPrice", errorKey: "maxPriceRequired" },
    { field: "countryId", errorKey: "countryIdRequired" },
    { field: "districtId", errorKey: "districtIdRequired" },
    { field: "locationId", errorKey: "locationIdRequired" },
  ];

  for (const { field, errorKey } of requiredFields) {
    const value = form[field];
    if (typeof value === "string" && (!value || value.trim() === "")) {
      errors[errorKey] = t(`buyers.${errorKey}`);
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
