import { axiosClient } from "./axios.client";

const isServer = typeof window === "undefined";

export async function getJSON<T>(url: string): Promise<T> {
  if (isServer) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<T>;
  }
  return axiosClient.get<T>(url);
}
