import type { Association } from "@customTypes/index";
import { nextTick } from "vue";
import { z } from "zod";

export function validateAssociationForm(
  form: Association,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const associationSchema = z
    .object({
      name: z.string().trim().min(1, { message: "nameRequired" }),
      shortName: z.string().trim().min(1, { message: "shortNameRequired" }),
      countryId: z.string().trim().min(1, { message: "countryIdRequired" }),
      imageFiles: z.any().optional(),
      logo: z.any().optional(),
    })
    .refine((data) => data.imageFiles || data.logo, {
      message: "logoRequired",
      path: ["logo"],
    });

  const result = associationSchema.safeParse(form);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const errorKey = issue.message;
      errors[errorKey] = t(`associations.${errorKey}`);
    });
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
