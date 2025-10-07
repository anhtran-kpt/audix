import z from "zod";
import { PaginationParamsSchema } from "./shared-schema";

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
