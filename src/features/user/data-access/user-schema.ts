import { UserSchema } from "@/app/generated/zod";

export const MiniUserSchema = UserSchema.pick({
  id: true,
  name: true,
});
