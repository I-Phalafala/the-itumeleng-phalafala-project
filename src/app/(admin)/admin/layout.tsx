"use client";

import { usePathname } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Sidebar from "@/components/admin/Sidebar";

/**
 * Inner layout used only for authenticated admin routes.
 * Keeping this in a separate component ensures the useAuthGuard hook
 * is never called while the user is on the login page.
 */
function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuthGuard();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 px-6 py-8 md:ml-0">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The login page lives inside this layout directory but must NOT be
  // wrapped by the auth guard – doing so causes a redirect loop and
  // prevents the post-login navigation from completing.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return <ProtectedAdminLayout>{children}</ProtectedAdminLayout>;
}
