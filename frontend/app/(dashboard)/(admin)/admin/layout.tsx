import AuthGuard from "@/features/auth/components/auth-guard";
import { UserRole } from "@/features/common/constants/enum";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={[UserRole.ADMIN]}>
      <div className="admin-wrapper">
        <aside>Admin Sidebar</aside>
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}
