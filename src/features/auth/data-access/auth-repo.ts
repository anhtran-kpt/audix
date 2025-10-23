import "server-only";
import db from "@/lib/db";
import { hash } from "bcryptjs";
import { SignUpInput } from "../contracts/auth-dto";
import { AwaitedReturnType } from "@/utils/type";
import { AppError } from "@/lib/errors";

export const signUp = async (input: SignUpInput) => {
  const { email, name, password } = input;

  try {
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError("CONFLICT", "This email is already in use");
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

    await Promise.all([
      db.playlist.create({
        data: {
          title: "Liked Tracks",
          isSystem: true,
          systemType: "LIKED_TRACKS",
          userId: user.id,
        },
      }),

      db.userSubscription.create({
        data: {
          userId: user.id,
          type: "FREE",
          status: "ACTIVE",
        },
      }),
    ]);

    return {
      success: true,
      message: "Success! Your account has been created. Welcome aboard!",
      data: user,
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        success: false,
        message: error.message,
      };
    }

    console.error("SignUp Error:", error);
    return {
      success: false,
      message: "An unexpected error occurred, please try again.",
    };
  }
};

export type SignUpOutput = AwaitedReturnType<typeof signUp>;
