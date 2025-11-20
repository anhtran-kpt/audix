import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/auth-provider";
import { authOptions } from "./api/auth/[...nextauth]/route";
import ReactQueryProvider from "@/providers/react-query-provider";
import { Toaster } from "@/components/ui/sonner";

const lexendSans = Lexend({
  subsets: ["vietnamese"],
});

export const metadata: Metadata = {
  title: {
    default: "AudiX",
    template: "%s | AudiX",
  },
  description:
    "Immerse yourself in a personalized music experience that brings your favorite songs to life, anytime, anywhere.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lexendSans.className} h-dvh overflow-hidden overscroll-none`}
      suppressHydrationWarning
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="AudiX" />
      </head>
      <body className="antialiased h-full">
        <ReactQueryProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
