"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/sign-in");
  }

  return session.user;
}

export async function getUserId() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return { ok: false, formError: "You need to sign in" };
  }

  return session.user.id;
}

export async function requirePremium() {
  const user = await getAuthenticatedUser();

  if (user.subscription !== "PREMIUM" && user.subscription !== "FAMILY") {
    redirect("/subscription/upgrade");
  }

  return user;
}

export async function getUserIdOrThrow() {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  if (!id) throw new (class extends Error {})("UNAUTHORIZED");
  return id;
}

export async function getUserIdOrNull() {
  const s = await getServerSession(authOptions);
  return s?.user?.id ?? null;
}

export const getAuthenticatedUser = async () => {
  const session = await getServerSession(authOptions);
  return session!.user!;
};
