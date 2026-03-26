"use client";
import React, { useState } from "react";
import UserSidebar from "../../../src/components/user/UserSidebar";
import UserTopbar from "../../../src/components/user/UserTopbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#eef2f6]">
      <div className="flex min-h-screen">
        <UserSidebar isOpen={isSidebarOpen} />
        <div className="flex min-w-0 flex-1 flex-col">
          <UserTopbar onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
          <main className="min-w-0 flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
