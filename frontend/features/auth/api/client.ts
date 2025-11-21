import apiClient from "@/lib/axios";
import {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  UserResponse,
} from "../auth.type";

export const login = async (data: LoginDto): Promise<LoginResponse> => {
  return apiClient.post<LoginDto, LoginResponse>("/auth/login", data);
};

export const register = async (
  data: RegisterDto
): Promise<RegisterResponse> => {
  return apiClient.post("/auth/register", data);
};

export const getProfile = async (): Promise<UserResponse> => {
  return apiClient.get("/auth/profile");
};
