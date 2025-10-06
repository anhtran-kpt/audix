import { http, createServerHttp } from "./axios";
import { z } from "zod";

// --- GET ---
export function getApi<S extends z.ZodTypeAny>(
  url: string,
  schema: S
): Promise<z.infer<S>>;

export function getApi<T = unknown>(
  url: string,
  schema?: undefined
): Promise<T>;

export async function getApi(url: string, schema?: z.ZodTypeAny) {
  const res = await http.get(url);
  const data = (res as any).unwrapped ?? res.data;
  return schema ? schema.parse(data) : data;
}

// --- POST ---
export function postApi<S extends z.ZodTypeAny, B = unknown>(
  url: string,
  body: B,
  schema: S
): Promise<z.infer<S>>;

export function postApi<T = unknown, B = unknown>(
  url: string,
  body?: B,
  schema?: undefined
): Promise<T>;

export async function postApi(
  url: string,
  body?: unknown,
  schema?: z.ZodTypeAny
) {
  const res = await http.post(url, body);
  const data = (res as any).unwrapped ?? res.data;
  return schema ? schema.parse(data) : data;
}

// --- PATCH ---
export function patchApi<S extends z.ZodTypeAny, B = unknown>(
  url: string,
  body: B,
  schema: S
): Promise<z.infer<S>>;

export function patchApi<T = unknown, B = unknown>(
  url: string,
  body?: B,
  schema?: undefined
): Promise<T>;

export async function patchApi(
  url: string,
  body?: unknown,
  schema?: z.ZodTypeAny
) {
  const res = await http.patch(url, body);
  const data = (res as any).unwrapped ?? res.data;
  return schema ? schema.parse(data) : data;
}

// --- PUT ---
export function putApi<S extends z.ZodTypeAny, B = unknown>(
  url: string,
  body: B,
  schema: S
): Promise<z.infer<S>>;

export function putApi<T = unknown, B = unknown>(
  url: string,
  body?: B,
  schema?: undefined
): Promise<T>;

export async function putApi(
  url: string,
  body?: unknown,
  schema?: z.ZodTypeAny
) {
  const res = await http.put(url, body);
  const data = (res as any).unwrapped ?? res.data;
  return schema ? schema.parse(data) : data;
}

// --- DELETE ---
export function deleteApi<S extends z.ZodTypeAny>(
  url: string,
  schema: S
): Promise<z.infer<S>>;

export function deleteApi<T = unknown>(
  url: string,
  schema?: undefined
): Promise<T>;

export async function deleteApi(url: string, schema?: z.ZodTypeAny) {
  const res = await http.delete(url);
  const data = (res as any).unwrapped ?? res.data;
  return schema ? schema.parse(data) : data;
}

// --- GET ---
export async function getApiServer<S extends z.ZodTypeAny>(
  url: string,
  schema: S,
  cookieHeader?: string
): Promise<z.infer<S>>;

export async function getApiServer<T = unknown>(
  url: string,
  schema?: undefined,
  cookieHeader?: string
): Promise<T>;

export async function getApiServer(
  url: string,
  schema?: z.ZodTypeAny,
  cookieHeader?: string
) {
  const serverHttp = createServerHttp(cookieHeader);
  const res = await serverHttp.get(url);
  const data = (res as any).unwrapped ?? res.data;
  return schema ? schema.parse(data) : data;
}

// --- POST ---
export async function postApiServer<S extends z.ZodTypeAny, B = unknown>(
  url: string,
  body: B,
  schema: S,
  cookieHeader?: string
): Promise<z.infer<S>>;

export async function postApiServer<T = unknown, B = unknown>(
  url: string,
  body?: B,
  schema?: undefined,
  cookieHeader?: string
): Promise<T>;

export async function postApiServer(
  url: string,
  body?: unknown,
  schema?: z.ZodTypeAny,
  cookieHeader?: string
) {
  const serverHttp = createServerHttp(cookieHeader);
  const res = await serverHttp.post(url, body);
  const data = (res as any).unwrapped ?? res.data;
  return schema ? schema.parse(data) : data;
}

// --- PUT ---
export async function putApiServer<S extends z.ZodTypeAny, B = unknown>(
  url: string,
  body: B,
  schema: S,
  cookieHeader?: string
): Promise<z.infer<S>>;

export async function putApiServer<T = unknown, B = unknown>(
  url: string,
  body?: B,
  schema?: undefined,
  cookieHeader?: string
): Promise<T>;

export async function putApiServer(
  url: string,
  body?: unknown,
  schema?: z.ZodTypeAny,
  cookieHeader?: string
) {
  const serverHttp = createServerHttp(cookieHeader);
  const res = await serverHttp.put(url, body);
  const data = (res as any).unwrapped ?? res.data;
  return schema ? schema.parse(data) : data;
}

// --- PATCH ---
export async function patchApiServer<S extends z.ZodTypeAny, B = unknown>(
  url: string,
  body: B,
  schema: S,
  cookieHeader?: string
): Promise<z.infer<S>>;

export async function patchApiServer<T = unknown, B = unknown>(
  url: string,
  body?: B,
  schema?: undefined,
  cookieHeader?: string
): Promise<T>;

export async function patchApiServer(
  url: string,
  body?: unknown,
  schema?: z.ZodTypeAny,
  cookieHeader?: string
) {
  const serverHttp = createServerHttp(cookieHeader);
  const res = await serverHttp.patch(url, body);
  const data = (res as any).unwrapped ?? res.data;
  return schema ? schema.parse(data) : data;
}

// --- DELETE ---
export async function deleteApiServer<S extends z.ZodTypeAny>(
  url: string,
  schema: S,
  cookieHeader?: string
): Promise<z.infer<S>>;

export async function deleteApiServer<T = unknown>(
  url: string,
  schema?: undefined,
  cookieHeader?: string
): Promise<T>;

export async function deleteApiServer(
  url: string,
  schema?: z.ZodTypeAny,
  cookieHeader?: string
) {
  const serverHttp = createServerHttp(cookieHeader);
  const res = await serverHttp.delete(url);
  const data = (res as any).unwrapped ?? res.data;
  return schema ? schema.parse(data) : data;
}
