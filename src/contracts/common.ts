import { z } from "zod";

export const zPage = z.coerce.number().int().min(1).default(1);
export const zLimit = z.coerce.number().int().min(1).max(100).default(20);
export const zBool = z.coerce.boolean();
export const zDate = z.coerce.date();

export const zCuid = z.cuid2();
export const zPublicId = z.string().min(1);
export const zSlug = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/);

export const zStringArrayFromQS = z
  .union([
    z.array(z.string()),
    z.string().transform((s) =>
      s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
    ),
  ])
  .transform((arr) => Array.from(new Set(arr)));

export const PaginationQuery = z.object({
  page: zPage,
  limit: zLimit,
});

export const zTimeStamps = z.object({
  createdAt: zDate.optional(),
  updatedAt: zDate.optional(),
});
