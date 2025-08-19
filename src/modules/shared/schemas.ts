import z from "zod";

export const baseFields = {
  id: z.cuid2(),
  count: z.number().int().min(0),
} as const;
