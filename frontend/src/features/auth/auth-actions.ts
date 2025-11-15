"use server";

import "server-only";
import db from "@/lib/db";
import { hash } from "bcryptjs";
import { AppError } from "@/lib/errors";
import { DEFAULT_USER_PLAYLIST_TYPE } from "@/lib/constants";
import { SignUpInput } from "./auth-types";

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
          title: "Favorite Songs",
          isSystem: true,
          systemType: DEFAULT_USER_PLAYLIST_TYPE,
          userId: user.id,
          imageId: process.env.NEXT_PUBLIC_FAVORITE_SONGS_COVER,
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
