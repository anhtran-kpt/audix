import { z } from "zod";

export const zPage = z.coerce.number().int().min(1).default(1);
export const zLimit = z.coerce.number().int().min(1).max(100).default(20);
export const zBoolSchema = z.coerce.boolean();
export const zDateSchema = z.coerce.date();

export const zCuidSchema = z.cuid2();
export const zPublicIdSchema = z.string().min(1);

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

export const zTimeStamps = {
  createdAt: zDateSchema.optional(),
  updatedAt: zDateSchema.optional(),
} as const;

export type zCuidType = z.infer<typeof zCuidSchema>;
