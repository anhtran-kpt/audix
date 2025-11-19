import { User } from "generated/prisma";

export type AuthUserPayload = Omit<User, "passwordHash">;
