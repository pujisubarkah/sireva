import React, { useState } from "react";
import AdminSidebar from "../../../src/components/admin/AdminSidebar";
import AdminTopbar from "../../../src/components/admin/AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // default: closed

  const handleToggleSidebar = () => setIsSidebarOpen((v) => !v);

  return (
    <div className="min-h-screen flex bg-[#eef2f6]">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} />
      {/* Content */}
      <div className="flex-1 flex flex-col">
        <AdminTopbar onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
