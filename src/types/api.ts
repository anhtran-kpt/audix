export type ApiMeta = { page?: number; perPage?: number; total?: number };
export type ApiSuccess<T> = { ok: true; data: T; meta?: ApiMeta };
export type ApiFailure = {
  ok: false;
  error: { code: string; message: string; issues?: unknown };
};
export type ApiResult<T> = ApiSuccess<T> | ApiFailure;
