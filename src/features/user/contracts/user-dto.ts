import z from "zod";
import { MiniUserSchema, UserItemSchema } from "./user-schema";

export type MiniUser = z.infer<typeof MiniUserSchema>;
export type UserItem = z.infer<typeof UserItemSchema>;
