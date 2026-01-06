import { z } from "zod";

export const associationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  shortName: z.string().min(1, "Short name is required"),
  countryId: z.string().min(1, "Country is required"),
  logo: z.any().optional(),
  description: z.string().optional(),
  imageFiles: z.any().nullable().optional(),
});

export type AssociationFormValues = z.infer<typeof associationSchema>;

export interface Country {
  id: string;
  name: string;
}

export interface AssociationItem {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  description: string;
  country: Country;
}
