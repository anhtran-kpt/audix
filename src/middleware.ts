import { withAuth } from "next-auth/middleware";

export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith("/library")) {
        return !!token;
      }

      if (req.nextUrl.pathname.startsWith("/premium")) {
        return token?.subscription === "PREMIUM";
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/library/:path*", "/premium/:path*", "/api/protected/:path*"],
};
