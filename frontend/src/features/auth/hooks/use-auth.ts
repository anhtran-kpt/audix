import { useAuthStore } from "../stores/use-auth-store";
import { login as loginApi, getProfile } from "../api"; // Hàm gọi axios
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoginDto } from "../types";

export const useAuth = () => {
  const { login: setLoginState, logout: setLogoutState, user } = useAuthStore();

  // 1. Logic Đăng nhập
  const loginMutation = useMutation({
    mutationFn: loginApi, // Gọi API NestJS
    onSuccess: (data) => {
      // data trả về từ NestJS: { access_token, user }
      // (Bạn cần đảm bảo API login trả về cả user info, hoặc gọi thêm 1 request nữa)
      setLoginState(data.user, data.access_token);
    },
  });

  // 2. Logic lấy User Profile (Chạy khi F5 hoặc khi mới vào)
  // Chỉ chạy khi có token trong localStorage
  const { isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getProfile,
    retry: false,
    enabled: !!localStorage.getItem("accessToken"), // Chỉ fetch khi có token
    onSuccess: (userData) => {
      // Token còn hạn -> Cập nhật user vào store
      setLoginState(userData, localStorage.getItem("accessToken")!);
    },
    onError: () => {
      // Token hết hạn -> Logout
      setLogoutState();
    },
  });

  return {
    login: loginMutation.mutateAsync,
    logout: setLogoutState,
    user,
    isLoading: loginMutation.isPending || isLoading,
    isAuthenticated: !!user,
  };
};
