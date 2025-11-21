import GuestGuard from "@/features/auth/components/guest-guard";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestGuard>{children}</GuestGuard>;
}
