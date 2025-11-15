import z from "zod";
import { MiniUserSchema, UserItemSchema } from "./user-schemas";

export type MiniUser = z.infer<typeof MiniUserSchema>;
export type UserItem = z.infer<typeof UserItemSchema>;
