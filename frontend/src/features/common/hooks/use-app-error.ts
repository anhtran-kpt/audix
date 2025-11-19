import { AppError, AppErrorCode } from "@/lib/errors";
import { isAxiosError } from "axios";

export interface AppErrorInfo {
  isAppError: boolean;
  code?: AppErrorCode;
  message: string;
  details?: unknown;
}

export function useAppError(error: unknown): AppErrorInfo {
  if (!error) {
    return {
      isAppError: false,
      message: "",
    };
  }

  if (error instanceof AppError) {
    return {
      isAppError: true,
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (isAxiosError(error)) {
    return {
      isAppError: false,
      message: error.message || "Network error",
    };
  }

  return {
    isAppError: false,
    message: (error as Error)?.message ?? "Unexpected error",
  };
}
