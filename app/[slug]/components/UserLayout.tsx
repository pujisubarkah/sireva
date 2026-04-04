"use client";
import React, { useState } from "react";
import Sidebar from "../../../src/components/Sidebar";
import Topbar from "../../../src/components/Topbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#eef2f6]">
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onToggleSidebar={() => setIsSidebarOpen((v) => !v)} />
          <main className="min-w-0 flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
