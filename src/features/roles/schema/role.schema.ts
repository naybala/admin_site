import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  description: z.string().nullable().optional(),
  permissions: z.array(z.any()).optional(),
});

export type RoleFormValues = z.infer<typeof roleSchema>;

export interface Permission {
  id: string;
  name: string;
  group?: string;
}

export interface RoleItem {
  id: string;
  name: string;
  description: string | null;
  permissions: any[];
}
