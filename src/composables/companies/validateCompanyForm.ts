import type { Company } from "@customTypes/index";
import { nextTick } from "vue";

export function validateCompanyForm(
  form: Company,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const requiredFields: { field: keyof Company; errorKey: string }[] = [
    { field: "name", errorKey: "companyNameRequired" },
    { field: "email", errorKey: "emailRequired" },
    { field: "phoneNumber", errorKey: "phoneNumberRequired" },
    { field: "associationId", errorKey: "associationIdRequired" },

    { field: "countryId", errorKey: "countryIdRequired" },
    { field: "locationId", errorKey: "locationIdRequired" },
  ];

  for (const { field, errorKey } of requiredFields) {
    const value = form[field];
    if (typeof value === "string" && (!value || value.trim() === "")) {
      errors[errorKey] = t(`companies.${errorKey}`);
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
