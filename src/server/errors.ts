export class AppError extends Error {
  constructor(
    public code: "UNAUTHORIZED" | "BAD_REQUEST" | "NOT_FOUND" | "INTERNAL",
    message: string,
    public status = 400,
    public details?: any
  ) {
    super(message);
  }
}
export const BadRequest = (m: string, d?: any) =>
  new AppError("BAD_REQUEST", m, 400, d);
export const Unauthorized = (m = "Unauthorized") =>
  new AppError("UNAUTHORIZED", m, 401);
export const NotFound = (m = "Not found") => new AppError("NOT_FOUND", m, 404);
