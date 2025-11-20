import z from "zod";
import { SignInInputSchema, SignUpInputSchema } from "./auth-schemas";
import { AwaitedReturnType } from "@/utils/type";
import { signUp } from "./auth-actions";
import { components } from "@/types/api-schema";

export type SignInInput = z.infer<typeof SignInInputSchema>;
export type SignUpInput = z.infer<typeof SignUpInputSchema>;

export type SignUpOutput = AwaitedReturnType<typeof signUp>;

export type LoginResponse = components["schemas"]["LoginResponseDto"];
export type LoginDto = components["schemas"]["LoginDto"];
