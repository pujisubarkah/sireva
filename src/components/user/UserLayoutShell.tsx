"use client";
import React, { useState } from "react";
import UserSidebar from "./UserSidebar";
import UserTopbar from "./UserTopbar";
import AppShell from "../AppShell";

export default function UserLayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleToggleSidebar = () => setIsSidebarOpen((v) => !v);
  return (
    <AppShell
      sidebar={<UserSidebar isOpen={isSidebarOpen} />}
      topbar={<UserTopbar onToggleSidebar={handleToggleSidebar} />}
    >
      {children}
    </AppShell>
  );
}
