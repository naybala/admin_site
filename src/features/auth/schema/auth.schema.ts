import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const otpSchema = z.object({
  phoneNumber: z.string().min(1, { message: "Phone number is required" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
