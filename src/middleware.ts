import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (!token?.sub) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/auth/sign-in";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const match = pathname.match(/^\/users\/([^/]+)(\/.*)?$/);
    if (match) {
      const targetUserId = match[1];
      const restPath = match[2] || "";

      if (targetUserId === token.sub) {
        const url = req.nextUrl.clone();
        url.pathname = `/me${restPath}`;
        return NextResponse.redirect(url);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/((?!api/auth|auth|_next|static|favicon.ico).*)"],
};
