import { ZodType } from "zod";
import { ApiError } from "@/lib/http";

type ParseSchema<R> = ZodType<R> | undefined;

async function handle<R>(res: Response, schema?: ParseSchema<R>): Promise<R> {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok || payload?.ok === false) {
    const code = payload?.error?.code ?? "UNKNOWN";
    const message = payload?.error?.message ?? `HTTP ${res.status}`;
    const issues = payload?.error?.issues;
    throw new ApiError(res.status, code, message, issues);
  }
  const data = payload?.data ?? payload;
  return schema ? schema.parse(data) : (data as R);
}

export async function getApi<R>(
  url: string,
  schema?: ParseSchema<R>
): Promise<R> {
  const res = await fetch(url, { credentials: "include" });
  return handle<R>(res, schema);
}

export async function postApi<I, R>(
  url: string,
  input: I,
  schema?: ParseSchema<R>
): Promise<R> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });
  return handle<R>(res, schema);
}
