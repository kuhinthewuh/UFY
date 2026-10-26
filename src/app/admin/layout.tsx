import React from "react";
import { headers } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";

  // The login page manages its own fullscreen layout
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--ufy-purple-25)" }}>
      <AdminSidebar />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>
        {children}
      </div>
    </div>
  );
}
