import { UserSchema } from "@/app/generated/zod";
import z from "zod";

export const MiniUserSchema = UserSchema.pick({
  id: true,
  name: true,
});

export const UserItemSchema = UserSchema.pick({
  id: true,
  name: true,
  image: true,
});

export const UserParamsSchema = z.object({
  targetUserId: z.cuid2(),
});
