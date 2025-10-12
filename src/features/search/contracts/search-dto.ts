import z from "zod";
import { searchQuerySchema, searchTypeSchema } from "./search-schema";

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type SearchType = z.infer<typeof searchTypeSchema>;
