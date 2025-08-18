"use client";

import axios from "axios";

export const axiosClient = axios.create({ baseURL: "/", timeout: 10000 });
axiosClient.interceptors.response.use(
  (r) => r.data,
  (e) => Promise.reject(e?.response?.data ?? e)
);
