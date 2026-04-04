import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex bg-[#eef2f6]">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col"> 
        <Topbar onToggleSidebar={handleToggleSidebar} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
