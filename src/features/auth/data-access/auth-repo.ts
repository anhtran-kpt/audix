import "server-only";
import db from "@/lib/db";
import { hash } from "bcryptjs";
import { SignUpInput } from "../contracts/auth-dto";
import { NextResponse } from "next/server";

export const signUp = async (input: SignUpInput) => {
  const { email, name, password } = input;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "This email in use" }, { status: 400 });
  }

  const passwordHash = await hash(password, 10);

  const user = await db.user.create({
    data: { email, name, passwordHash },
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
