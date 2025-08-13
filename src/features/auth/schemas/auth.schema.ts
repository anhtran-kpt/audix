import { z } from "zod";

export const signInInput = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInInput = z.infer<typeof signInInput>;

export const signUpInput = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.email().trim(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Confirm password does not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpInput>;
