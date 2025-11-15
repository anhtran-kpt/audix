import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      subscription?: string;
      subscriptionStatus?: string;
      likedPlaylistId?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    subscription?: string;
    likedPlaylistId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    subscription?: string;
    subscriptionStatus?: string;
    likedPlaylistId?: string | null;
  }
}
