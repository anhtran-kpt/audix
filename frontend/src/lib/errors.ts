export type AppErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "RATE_LIMIT"
  | "INTERNAL";

export class AppError extends Error {
  code: AppErrorCode;
  details?: unknown;
  constructor(code: AppErrorCode, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

export type ResponseEnvelope<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: { code: AppErrorCode; message: string; details?: unknown };
    };

export function ok<T>(data: T): ResponseEnvelope<T> {
  return { ok: true, data };
}
export function fail(
  code: AppErrorCode,
  message: string,
  details?: unknown
): ResponseEnvelope<never> {
  return { ok: false, error: { code, message, details } };
}
