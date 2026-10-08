import { z } from "zod";
const password = z.string().min(8, "Use at least 8 characters.");
export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name."),
    email: z.email("Enter a valid email address."),
    password,
    confirm: z.string(),
    terms: z
      .boolean()
      .refine(Boolean, "Accept the terms and privacy notice to continue."),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });
export type SignupForm = z.infer<typeof signupSchema>;
export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});
export type LoginForm = z.infer<typeof loginSchema>;
export const recoverySchema = z.object({
  email: z.email("Enter a valid email address."),
});
export type RecoveryForm = z.infer<typeof recoverySchema>;
export const resetSchema = z
  .object({ password, confirm: z.string() })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });
export type ResetForm = z.infer<typeof resetSchema>;
export const verificationSchema = z.object({
  code: z
    .string()
    .refine(
      (code) => code === "" || /^\d{6}$/.test(code),
      "Enter six digits or leave the field empty for verification.",
    ),
});
export type VerificationForm = z.infer<typeof verificationSchema>;
export const demoSessionSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  verified: z.boolean(),
  demo: z.literal(true),
  invited: z.boolean(),
});
export type DemoSession = z.infer<typeof demoSessionSchema>;
