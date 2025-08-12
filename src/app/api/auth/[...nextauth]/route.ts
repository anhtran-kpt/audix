import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import type { Adapter } from "next-auth/adapters";
import { getImageUrl } from "@/lib/helpers/get-image-url";
import { generateUniqueUsername } from "@/lib/helpers/generate-unique-username";
import { extractCloudinaryId } from "@/lib/helpers/extract-cloudinary-id";

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
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            subscription: true,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          image: user.image ? getImageUrl(user.image) : null,
          subscription: user.subscription?.type || "FREE",
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      // Khi user đăng nhập lần đầu
      if (user) {
        token.username = user.username;
        token.subscription = user.subscription || "FREE";

        // Lấy thông tin subscription từ database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { subscription: true },
        });

        if (dbUser?.subscription) {
          token.subscription = dbUser.subscription.type;
          token.subscriptionStatus = dbUser.subscription.status;
        }
      }

      // Khi session được update
      if (trigger === "update" && session) {
        token.name = session.name;
        token.username = session.username;
        token.image = session.image;
      }

      return token;
    },

    // Session Callback - Được gọi khi session được truy cập
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.username = token.username as string;
        session.user.subscription = token.subscription as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
      }

      return session;
    },

    // SignIn Callback - Được gọi khi user đăng nhập
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Nếu đăng nhập bằng OAuth providers
        if (account?.provider === "google" || account?.provider === "github") {
          return true;
        }

        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },

    // Redirect Callback - Xử lý redirect sau khi đăng nhập
    async redirect({ url, baseUrl }) {
      // Redirect về dashboard sau khi đăng nhập thành công
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User ${user.email} signed in with ${account?.provider}`);
    },

    async signOut({ session, token }) {
      console.log(`User signed out`);
    },

    async createUser({ user }) {
      const username = await generateUniqueUsername(
        user.name || user.email!.split("@")[0]
      );
      await prisma.user.update({
        where: { id: user.id },
        data: {
          username,
          image: user.image ? extractCloudinaryId(user.image) : null,
          subscription: { create: { type: "FREE", status: "ACTIVE" } },
        },
      });
    },
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
