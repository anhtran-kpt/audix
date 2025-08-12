import { z } from "zod";

export const signInInput = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInInput = z.input<typeof signInInput>;
