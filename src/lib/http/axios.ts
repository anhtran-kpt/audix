import axios from "axios";
import type { ResponseEnvelope } from "@/lib/errors";

export const http = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => {
    const data = res.data as ResponseEnvelope<unknown>;
    if (!data || typeof data !== "object" || !("ok" in data)) return res;
    if (data.ok) {
      (res as any).unwrapped = data.data;
      return res;
    }

    const err = new Error(data.error.message) as any;
    err.code = data.error.code;
    err.details = data.error.details;
    err.isAppError = true;
    return Promise.reject(err);
  },
  (err) => {
    return Promise.reject(err);
  }
);
