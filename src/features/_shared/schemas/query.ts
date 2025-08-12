import { z } from "zod";
import { Pagination } from "./common";

export const sortEnum = z
  .enum(["createdAt", "title", "popularity"])
  .default("createdAt");
export const orderEnum = z.enum(["asc", "desc"]).default("desc");

export const playlistListQuery = Pagination.extend({
  search: z.string().trim().max(120).optional(),
  sort: sortEnum,
  order: orderEnum,
}).strict();

export type PlaylistListQuery = z.infer<typeof playlistListQuery>;

// parse trong RSC/route:
// const q = playlistListQuery.parse(Object.fromEntries(searchParams));
