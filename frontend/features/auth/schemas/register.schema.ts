import z from "zod";
import { RegisterDto } from "../auth.type";

export const registerSchema = z
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

export type RegisterSchemaType = z.infer<typeof registerSchema>;
const _check: RegisterDto = {} as RegisterSchemaType;
