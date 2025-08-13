import { zodToFieldErrors } from "@/features/_shared/schemas/error";
import { authRepo } from "../repos/auth.repo";
import { signUpInput } from "../schemas/auth.schema";
import { hash } from "bcryptjs";
import { PrismaClientKnownRequestError } from "@/app/generated/prisma/runtime/library";

type SignUpResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: string };

export async function signUpService(raw: unknown): Promise<SignUpResult> {
  const parsed = signUpInput.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, fieldErrors: zodToFieldErrors(parsed.error) };
  }

  const name = parsed.data.name.trim();
  const email = parsed.data.email.trim().toLowerCase();
  const password = parsed.data.password;

  if (await authRepo.existsByEmail(email)) {
    return { ok: false, fieldErrors: { email: "Email already in use" } };
  }

  const passwordHash = await hash(password, 12);

  try {
    await authRepo.create({ email, name, passwordHash });
    return { ok: true };
  } catch (e: any) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2002") {
      return { ok: false, fieldErrors: { email: "Email already in use" } };
    }

    console.error("signUpService error:", e);
    return { ok: false, formError: "Something went wrong. Please try again." };
  }
}
