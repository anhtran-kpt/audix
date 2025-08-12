import { ZodError } from "zod";

export type FormResult<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; fieldErrors?: Record<string, string>; formError?: string };

export function zodToFieldErrors(err: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of err.issues) {
    const key = typeof i.path[0] === "string" ? (i.path[0] as string) : "_form";
    if (!out[key]) out[key] = i.message;
  }
  return out;
}
