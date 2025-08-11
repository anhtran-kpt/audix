import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "./prisma";

// Lấy session hiện tại
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

// Middleware để protect routes
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  return session.user;
}

// Check user có premium không
export async function requirePremium() {
  const user = await requireAuth();

  if (user.subscription !== "PREMIUM" && user.subscription !== "FAMILY") {
    redirect("/subscription/upgrade");
  }

  return user;
}

// Lấy full user data từ database
export async function getUserWithDetails(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
      playlists: {
        where: { isPublic: true },
        take: 5,
        orderBy: { updatedAt: "desc" },
      },
      likedSongs: {
        take: 10,
        orderBy: { likedAt: "desc" },
        include: {
          song: {
            include: {
              artist: true,
              album: true,
            },
          },
        },
      },
      _count: {
        select: {
          playlists: true,
          likedSongs: true,
          followers: true,
          following: true,
        },
      },
    },
  });
}
