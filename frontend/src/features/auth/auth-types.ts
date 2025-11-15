import z from "zod";
import { SignInInputSchema, SignUpInputSchema } from "./auth-schemas";
import { AwaitedReturnType } from "@/utils/type";
import { signUp } from "./auth-actions";

export type SignInInput = z.infer<typeof SignInInputSchema>;
export type SignUpInput = z.infer<typeof SignUpInputSchema>;

export type SignUpOutput = AwaitedReturnType<typeof signUp>;
