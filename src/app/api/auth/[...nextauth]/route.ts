import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/server/db";
import type { Adapter } from "next-auth/adapters";

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

        token.subscription = dbUser?.subscription?.type ?? "FREE";
        token.subscriptionStatus = dbUser?.subscription?.status ?? "ACTIVE";
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
      }

      return session;
    },

    async signIn({ account }) {
      return account?.provider === "google";
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}`;
    },
  },

  events: {
    async createUser({ user }) {
      await prisma.userSubscription.create({
        data: {
          userId: user.id,
          type: "FREE",
          status: "ACTIVE",
        },
      });
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
