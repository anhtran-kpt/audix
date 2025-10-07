import { makeResourceQueryFactory } from "@/lib/make-resource-query-factory";

export const artistFactory = makeResourceQueryFactory({
  basePath: "artists",
});
