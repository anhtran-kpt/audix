import z from "zod";
import { PaginationParamsSchema } from "./shared-schemas";

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
