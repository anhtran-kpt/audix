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
    redirect("/auth/signin");
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
  const user = await requireAuth();

  if (user.subscription !== "PREMIUM" && user.subscription !== "FAMILY") {
    redirect("/subscription/upgrade");
  }

  return user;
}
