import type { Plan } from "@customTypes/index";
import { nextTick } from "vue";

export function validatePlanForm(
  form: Plan,
  t: (key: string) => string
): { errors: Record<string, string>; hasDuplicateDuration: boolean } {
  const errors: Record<string, string> = {};
  const durationSet = new Set<number>();
  let hasDuplicateDuration = false;

  if (!form.countryCode || form.countryCode.trim() === "") {
    errors.countryCode = t("plans.countryCodeRequired");
  }

  if (!form.userType || form.userType.trim() === "") {
    errors.userType = t("plans.userTypeRequired");
  }

  if (!form.price || form.price.toString().trim() === "") {
    errors.price = t("plans.priceRequired");
  }

  form.plans.forEach((p, index) => {
    if (!p.duration || p.duration < 1 || p.duration > 12) {
      errors[`plans[${index}].duration`] = t("plans.durationRequired");
    } else if (durationSet.has(p.duration)) {
      hasDuplicateDuration = true;
    } else {
      durationSet.add(p.duration);
    }
  });
  scrollToFirstErrorField(errors);
  return { errors, hasDuplicateDuration };
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
