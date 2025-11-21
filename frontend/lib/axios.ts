import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface NestErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError<NestErrorResponse>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    let errorMessage = "Something went wrong";

    if (data && data.message) {
      if (Array.isArray(data.message)) {
        errorMessage = data.message.join(", ");
      } else {
        errorMessage = data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    const customError = new Error(errorMessage);

    return Promise.reject(customError);
  }
);

export default apiClient;
