import { ApiMeta } from "@/types/api";

export class ApiError extends Error {
  status: number;
  code: string;
  issues?: unknown;
  constructor(status: number, code: string, message: string, issues?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.issues = issues;
  }
}

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
} as const;

export function ok<T>(data: T, meta?: ApiMeta, init?: ResponseInit) {
  return new Response(JSON.stringify({ ok: true, data, meta }), {
    status: 200,
    headers: { ...JSON_HEADERS, ...(init?.headers ?? {}) },
  });
}

export function created<T>(data: T, init?: ResponseInit) {
  return new Response(JSON.stringify({ ok: true, data }), {
    status: 201,
    headers: { ...JSON_HEADERS, ...(init?.headers ?? {}) },
  });
}

export function fail(
  status: number,
  code: string,
  message: string,
  issues?: unknown
) {
  return new Response(
    JSON.stringify({ ok: false, error: { code, message, issues } }),
    {
      status,
      headers: JSON_HEADERS,
    }
  );
}

export const badRequest = (msg = "Bad Request", issues?: unknown) =>
  fail(400, "BAD_REQUEST", msg, issues);
export const unauthorized = (msg = "Unauthorized") =>
  fail(401, "UNAUTHORIZED", msg);
export const forbidden = (msg = "Forbidden") => fail(403, "FORBIDDEN", msg);
export const notFound = (msg = "Not Found") => fail(404, "NOT_FOUND", msg);
export const conflict = (msg = "Conflict", issues?: unknown) =>
  fail(409, "CONFLICT", msg, issues);
export const serverError = (msg = "Internal Server Error", issues?: unknown) =>
  fail(500, "INTERNAL_ERROR", msg, issues);
