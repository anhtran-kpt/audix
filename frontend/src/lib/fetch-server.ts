import "server-only";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type FetchOptions = RequestInit & {};

export async function serverFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Not Found");
    }
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
