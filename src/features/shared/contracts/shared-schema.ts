import z from "zod";

export const zPage = z.coerce.number().int().min(1).default(1);
export const zLimit = z.coerce.number().int().min(1).max(100).default(20);
export const zBoolSchema = z.boolean();
export const zDateSchema = z.coerce.date();
export const zCuidSchema = z.cuid2();
export const zPublicIdSchema = z.string().min(1);
export const zIntSchema = z.number().int().positive();
export const zStringSchema = z.string().min(1);
export const PaginationQuery = z.object({
  page: zPage,
  limit: zLimit,
});
export const zTimeStamps = {
  createdAt: zDateSchema.nullish(),
  updatedAt: zDateSchema.nullish(),
} as const;
