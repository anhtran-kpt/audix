import { UserSchema } from "@/app/generated/zod";

export const MiniUserSchema = UserSchema.pick({
  id: true,
  name: true,
});

export const UserItemSchema = UserSchema.pick({
  id: true,
  name: true,
  image: true,
});
