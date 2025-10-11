import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { z } from "zod";
import { AppError, type ResponseEnvelope } from "@/lib/errors";
import { PaginationParams } from "@/features/shared/contracts/shared-dto";

export interface AxiosResponseWithUnwrapped<T = unknown>
  extends AxiosResponse<T> {
  unwrapped?: T;
}

function createAxiosInstance(cookieHeader?: string): AxiosInstance {
  const isServer = typeof window === "undefined";

  const instance = axios.create({
    baseURL: isServer
      ? `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api`
      : "/api",
    withCredentials: !isServer,
  });

  instance.interceptors.request.use((config) => {
    // config.params ??= {};
    // config.params.limit ??= 5;
    // config.params.offset ??= 0;

    if (cookieHeader) config.headers.Cookie = cookieHeader;
    return config;
  });

  instance.interceptors.response.use(
    (res) => {
      const data = res.data as ResponseEnvelope<unknown>;
      if (!data || typeof data !== "object" || !("ok" in data)) return res;

      if (data.ok) {
        (res as AxiosResponseWithUnwrapped).unwrapped = data.data;
        return res;
      }

      throw new AppError(
        data.error.code,
        data.error.message,
        data.error.details
      );
    },
    (err) => Promise.reject(err)
  );

  return instance;
}

async function requestInstance(cookieHeader?: string): Promise<AxiosInstance> {
  const isServer = typeof window === "undefined";

  if (!isServer) return createAxiosInstance();

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const effectiveCookie = cookieHeader ?? cookieStore.toString();

  return createAxiosInstance(effectiveCookie);
}

export async function getApi<TData = unknown>(
  url: string,
  options?: BaseRequestOptions
): Promise<TData> {
  const instance = await requestInstance(options?.cookieHeader);
  const res = await instance.get(url, { params: options?.params });
  return (res as AxiosResponseWithUnwrapped).unwrapped ?? res.data;
}

interface BaseRequestOptions {
  params?: Record<string, any> & Partial<PaginationParams>;
  cookieHeader?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface MutateOptions<S extends z.ZodType, R>
  extends BaseRequestOptions {
  schema: S;
  body: z.input<S>;
  parseBeforeSend?: boolean;
}

async function mutateApi<S extends z.ZodType, R = unknown>(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  url: string,
  options: MutateOptions<S, R>
): Promise<R> {
  const {
    schema,
    body,
    params,
    cookieHeader,
    parseBeforeSend = true,
  } = options;

  const instance = await requestInstance(cookieHeader);
  const safeBody = parseBeforeSend ? schema.parse(body) : body;

  const res = await instance.request({
    method,
    url,
    data: safeBody,
    params,
  });

  return (res as AxiosResponseWithUnwrapped).unwrapped ?? res.data;
}

export async function postApi<S extends z.ZodType, R = unknown>(
  url: string,
  options: MutateOptions<S, R>
): Promise<R> {
  return mutateApi<S, R>("POST", url, options);
}

export async function putApi<S extends z.ZodType, R = unknown>(
  url: string,
  options: MutateOptions<S, R>
): Promise<R> {
  return mutateApi<S, R>("PUT", url, options);
}

export async function patchApi<S extends z.ZodType, R = unknown>(
  url: string,
  options: MutateOptions<S, R>
): Promise<R> {
  return mutateApi<S, R>("PATCH", url, options);
}

export async function deleteApi<S extends z.ZodType, R = unknown>(
  url: string,
  options: MutateOptions<S, R>
): Promise<R> {
  return mutateApi<S, R>("DELETE", url, options);
}
