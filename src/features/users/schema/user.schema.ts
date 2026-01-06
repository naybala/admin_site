import { z } from "zod";

export const userSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required" }),
  email: z.string().email().nullable().optional(),
  phoneNumberPrefix: z.string().min(1, { message: "Phone prefix is required" }),
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
  roleId: z.string().nullable().optional(),
  companyId: z.string().nullable().optional(),
  userType: z.string().nullable().optional(),
  fullName: z.string().min(1, { message: "Full name is required" }),
  facebook: z.string().nullable().optional(),
  telegram: z.string().nullable().optional(),
  logo: z.any().optional(),
  imageFiles: z.any().optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;

export interface UserItem {
  id: string;
  username: string;
  email: string | null;
  phoneNumberPrefix: string;
  phoneNumber: string;
  roleId: string | null;
  companyId: string | null;
  userType: string | null;
  fullName: string;
  facebook: string | null;
  telegram: string | null;
  logo: any;
}
