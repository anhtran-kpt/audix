import { ZodType } from "zod";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(
  input: RequestInfo,
  init?: RequestInit & { schema?: ZodType<T> }
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers as any) },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, (data?.message as string) || res.statusText);
  }

  return init?.schema ? init.schema.parse(data) : (data as T);
}
