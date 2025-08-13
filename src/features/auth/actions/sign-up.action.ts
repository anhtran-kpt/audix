"use server";

import { signUpService } from "../services/sign-up.service";

export async function signUpAction(input: unknown) {
  const res = await signUpService(input);

  if (!res.ok) return res;

  return { ok: true };
}
