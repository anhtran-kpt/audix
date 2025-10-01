import {
  zCuidSchema,
  zStringSchema,
} from "@/features/shared/contracts/shared-schema";
import z from "zod";

export const BaseGenreSchema = z.object({
  id: zCuidSchema,
  name: zStringSchema,
  slug: zStringSchema,
  description: zStringSchema.nullish(),
  color: zStringSchema,
});
