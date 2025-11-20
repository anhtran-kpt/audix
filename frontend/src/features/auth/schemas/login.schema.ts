import { z } from "zod";
import { LoginDto } from "../auth.type";

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SchemaType = z.infer<typeof loginSchema>;
const _check: LoginDto = {} as SchemaType;
