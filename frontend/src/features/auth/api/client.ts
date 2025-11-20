import apiClient from "@/lib/axios";
import { LoginDto, LoginResponse } from "../auth.type";

export const login = async (data: LoginDto): Promise<LoginResponse> => {
  return apiClient.post<LoginDto, LoginResponse>("/auth/login", data);
};

export const getProfile = async (data: LoginDto): Promise<LoginResponse> => {
  return apiClient.post<LoginDto, LoginResponse>("/auth/profile", data);
};
