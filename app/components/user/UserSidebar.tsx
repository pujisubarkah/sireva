"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    href: "/user/dashboard",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/></svg>
    ),
  },
  {
    label: "Visi, Misi & Tujuan",
    href: "/user/visi-misi",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5"/></svg>
    ),
  },
  {
    label: "Sasaran Strategis",
    href: "/user/sasaran-strategis",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5"/></svg>
    ),
  },
  {
    label: "Sasaran Program",
    href: "/user/sasaran-program",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="5" y="5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>
    ),
  },
  {
    label: "Sasaran Kegiatan",
    href: "/user/sasaran-kegiatan",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M5 10h10M10 5v10" stroke="currentColor" strokeWidth="1.5"/></svg>
    ),
  },
  {
    label: "Pemantauan Kinerja",
    href: "/user/pemantauan-kinerja",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="8" width="3" height="8" rx="1.5" fill="currentColor"/><rect x="8.5" y="4" width="3" height="12" rx="1.5" fill="currentColor"/><rect x="13" y="11" width="3" height="5" rx="1.5" fill="currentColor"/></svg>
    ),
  },
  {
    label: "Cascading",
    href: "/user/cascading",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="6" cy="6" r="2" fill="currentColor"/><circle cx="14" cy="10" r="2" fill="currentColor"/><circle cx="10" cy="16" r="2" fill="currentColor"/><path d="M7.5 7.5l4 1.5M12.5 12l-2 2" stroke="currentColor" strokeWidth="1.2"/></svg>
    ),
  },
];

export default function UserSidebar() {
  // Komponen ini placeholder, silakan sesuaikan dengan kebutuhan sidebar user
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 text-blue-900">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}