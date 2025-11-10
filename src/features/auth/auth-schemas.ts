import z from "zod";

export const SignInInputSchema = z.object({
  email: z.email(),
  password: z
    .string("Password cannot be empty")
    .min(6, "Password must have at least 6 characters"),
});

export const SignUpInputSchema = z
  .object({
    name: z.string().min(1, "Name is required").trim(),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
