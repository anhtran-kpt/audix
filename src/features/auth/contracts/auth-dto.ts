import z from "zod";
import { SignInInputSchema, SignUpInputSchema } from "./auth-schema";

export type SignInInput = z.infer<typeof SignInInputSchema>;
export type SignUpInput = z.infer<typeof SignUpInputSchema>;
