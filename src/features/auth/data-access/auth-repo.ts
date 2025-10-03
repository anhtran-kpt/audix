import "server-only";
import db from "@/lib/db";
import { hash } from "bcryptjs";
import { SignUpInput } from "../contracts/auth-dto";
import { AwaitedReturnType } from "@/utils/type";
import { AppError } from "@/lib/errors";

export const signUp = async (input: SignUpInput) => {
  const { email, name, password } = input;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("CONFLICT", "This email in use");
  }

  const passwordHash = await hash(password, 10);

  const user = await db.user.create({
    data: { email, name, passwordHash },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  await db.userSubscription.create({
    data: {
      userId: user.id,
      type: "FREE",
      status: "ACTIVE",
    },
  });

  return user;
};

export type SignUpOutput = AwaitedReturnType<typeof signUp>;
