import React from "react";

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sidebar atau Topbar bisa ditambahkan di sini */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
