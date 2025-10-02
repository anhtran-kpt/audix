import z from "zod";
import { MiniUserSchema } from "./user-schema";

export type MiniUser = z.infer<typeof MiniUserSchema>;
