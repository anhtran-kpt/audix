import { components } from "./api-schema";

export type PageMeta = components["schemas"]["PageMetaDto"];
export type PageOptions = components["schemas"]["PageOptionsDto"];

export interface PaginatedResponse<T> {
  data: T[];
  meta: PageMeta;
}
