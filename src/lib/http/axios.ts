import axios from "axios";
import { AppError, type ResponseEnvelope } from "@/lib/errors";
import type { AxiosResponse } from "axios";

export interface AxiosResponseWithUnwrapped<T = unknown>
  extends AxiosResponse<T> {
  unwrapped?: T;
}

export const http = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

http.interceptors.response.use(
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
