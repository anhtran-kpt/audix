import { z } from "zod";

export const Id = z.cuid2().brand<"Id">();

export const NonEmpty = z.string().trim().min(1, "Cannot be blank");

export const LimitedText = (min: number, max: number) =>
  z.string().trim().min(min).max(max);

export const Slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug can only contain a-z, 0-9, hyphens"
  )
  .max(120)
  .brand<"Slug">();

export const Pagination = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export const Nullable = <T extends z.ZodTypeAny>(schema: T) => schema.nullish();

export const ImageUrl = z.url().max(2048);
