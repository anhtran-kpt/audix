import AuthGuard from "@/features/auth/components/auth-guard";
import { UserRole } from "@/features/common/constants/enum";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={[UserRole.USER]}>
      <aside>User Sidebar</aside>
      <main>{children}</main>
    </AuthGuard>
  );
}
