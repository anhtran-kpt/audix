import { z } from "zod";
import {
  getApi,
  postApi,
  putApi,
  patchApi,
  deleteApi,
  getApiServer,
  postApiServer,
  putApiServer,
  patchApiServer,
  deleteApiServer,
} from "./request";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiFetch<S extends z.ZodTypeAny>(
  method: HttpMethod,
  url: string,
  schema: S
): Promise<z.infer<S>>;

export async function apiFetch<T = unknown>(
  method: HttpMethod,
  url: string
): Promise<T>;

export async function apiFetch<S extends z.ZodType, B = unknown>(
  method: HttpMethod,
  url: string,
  bodyOrSchema?: B | S,
  schemaOrCookie?: S | string,
  maybeCookieHeader?: string
): Promise<S extends z.ZodType ? z.infer<S> : unknown> {
  const isServer = typeof window === "undefined";

  const isGet = method === "GET";

  if (!isServer) {
    switch (method) {
      case "GET":
        return getApi(url, bodyOrSchema as any);
      case "POST":
        return postApi(url, bodyOrSchema as any, schemaOrCookie as any);
      case "PUT":
        return putApi(url, bodyOrSchema as any, schemaOrCookie as any);
      case "PATCH":
        return patchApi(url, bodyOrSchema as any, schemaOrCookie as any);
      case "DELETE":
        return deleteApi(url, bodyOrSchema as any);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cookieHeader =
    (isGet ? (schemaOrCookie as string) : maybeCookieHeader) ??
    cookieStore.toString();

  switch (method) {
    case "GET":
      return getApiServer(url, bodyOrSchema as any, cookieHeader);
    case "POST":
      return postApiServer(
        url,
        bodyOrSchema as any,
        schemaOrCookie as any,
        cookieHeader
      );
    case "PUT":
      return putApiServer(
        url,
        bodyOrSchema as any,
        schemaOrCookie as any,
        cookieHeader
      );
    case "PATCH":
      return patchApiServer(
        url,
        bodyOrSchema as any,
        schemaOrCookie as any,
        cookieHeader
      );
    case "DELETE":
      return deleteApiServer(url, bodyOrSchema as any, cookieHeader);
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }
}
