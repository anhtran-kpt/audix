import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/db";
import type { Adapter } from "next-auth/adapters";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password is required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        const isValid = await compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { subscription: true },
        });

        const likedPlaylist = await prisma.playlist.findFirst({
          where: { userId: user.id, systemType: "LIKED_TRACKS" },
          select: { id: true },
        });

        token.subscription = dbUser?.subscription?.type ?? "FREE";
        token.subscriptionStatus = dbUser?.subscription?.status ?? "ACTIVE";
        token.likedPlaylistId = likedPlaylist?.id ?? null;
      }

      if (trigger === "update" && session) {
        if (session.subscription) token.subscription = session.subscription;
        if (session.subscriptionStatus)
          token.subscriptionStatus = session.subscriptionStatus;
        if (session.name) token.name = session.name;
        if (session.image) token.image = session.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.name = token.name;
        session.user.subscription = token.subscription;
        session.user.subscriptionStatus = token.subscriptionStatus;
        session.user.likedPlaylistId = token.likedPlaylistId;
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.name) {
          const fallback =
            profile?.name || user.email?.split("@")[0] || `User-${Date.now()}`;

          await prisma.user.update({
            where: { id: user.id },
            data: { name: fallback },
          });
          user.name = fallback;
        }
      }

      return (
        account?.provider === "google" || account?.provider === "credentials"
      );
    },
  },

  events: {
    async createUser({ user }) {
      await Promise.all([
        prisma.userSubscription.create({
          data: {
            userId: user.id,
            type: "FREE",
            status: "ACTIVE",
          },
        }),

        prisma.playlist.create({
          data: {
            title: "Liked Tracks",
            isSystem: true,
            systemType: "LIKED_TRACKS",
            userId: user.id,
          },
        }),
      ]);
    },
  },

  pages: {
    signIn: "/auth/sign-in",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
