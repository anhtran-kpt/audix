import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { AppError, type ResponseEnvelope } from "@/lib/errors";

export interface AxiosResponseWithUnwrapped<T = unknown>
  extends AxiosResponse<T> {
  unwrapped?: T;
}

function createAxiosInstance(): AxiosInstance {
  const isServer = typeof window === "undefined";

  const baseURL = isServer
    ? `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api`
    : "/api";

  const instance = axios.create({
    baseURL,
    withCredentials: !isServer,
  });

  instance.interceptors.response.use(
    (res) => {
      const data = res.data as ResponseEnvelope<unknown>;
      if (!data || typeof data !== "object" || !("ok" in data)) {
        return res;
      }

      if (data.ok) {
        (res as AxiosResponseWithUnwrapped).unwrapped = data.data;
        return res;
      }

      return Promise.reject(
        new AppError(data.error.code, data.error.message, data.error.details)
      );
    },
    (err) => Promise.reject(err)
  );

  return instance;
}

export const http = createAxiosInstance();

export function createServerHttp(cookieHeader?: string) {
  const instance = createAxiosInstance();

  if (cookieHeader) {
    instance.defaults.headers.Cookie = cookieHeader;
  }

  return instance;
}
