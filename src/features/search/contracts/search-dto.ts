import z from "zod";
import { searchQuerySchema, searchResult } from "./search-schema";

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type SearchResult = z.infer<typeof searchResult>;
