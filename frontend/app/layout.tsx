import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/providers/auth-provider";
import { ConfirmModal } from "@/components/modals/confirm-modal";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexendSans.className} antialiased`}>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" />
            <ConfirmModal />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
