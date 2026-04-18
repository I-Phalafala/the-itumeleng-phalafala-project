"use client";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
