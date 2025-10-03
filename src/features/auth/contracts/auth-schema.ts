import z from "zod";

export const SignInInputSchema = z.object({
  email: z.email(),
  password: z
    .string("Password cannot be empty")
    .min(6, "Password must have at least 6 characters"),
});

export const SignUpInputSchema = z.object({
  name: z
    .string("Name cannot be empty")
    .min(2, "Name must have at least 2 characters")
    .trim(),
  email: z.email(),
  password: z
    .string("Password cannot be empty")
    .min(6, "Password must have at least 6 characters"),
});
