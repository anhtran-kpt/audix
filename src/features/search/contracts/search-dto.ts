import z from "zod";
import {
  searchQuerySchema,
  searchResult,
  searchTypeSchema,
} from "./search-schema";

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type SearchResult = z.infer<typeof searchResult>;
export type SearchType = z.infer<typeof searchTypeSchema>;
