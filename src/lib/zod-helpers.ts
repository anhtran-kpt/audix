import { z } from "zod";
import { badRequest } from "./http";

export async function parseJson<T extends z.ZodTypeAny>(
  req: Request,
  schema: T
) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    throw badRequest("Invalid JSON body");
  }
  const res = schema.safeParse(json);
  if (!res.success) throw badRequest("Invalid JSON body", res.error.flatten());
  return res.data as z.infer<T>;
}

export function parseQuery<T extends z.ZodTypeAny>(req: Request, schema: T) {
  const url = new URL(req.url);
  const obj = Object.fromEntries(url.searchParams.entries());
  const res = schema.safeParse(obj);
  if (!res.success) throw badRequest("Invalid query", res.error.flatten());
  return res.data as z.infer<T>;
}

export function parseParams<T extends z.ZodTypeAny>(
  params: unknown,
  schema: T
) {
  const res = schema.safeParse(params);
  if (!res.success) throw badRequest("Invalid params", res.error.flatten());
  return res.data as z.infer<T>;
}
