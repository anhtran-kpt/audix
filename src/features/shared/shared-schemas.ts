import z from "zod";

export const PaginationParamsSchema = z.object({
  limit: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().positive().max(100))
    .default(5)
    .transform((v) => (Number.isNaN(v) ? 20 : v)),
  offset: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().nonnegative())
    .default(0)
    .transform((v) => (Number.isNaN(v) ? 0 : v)),
});
