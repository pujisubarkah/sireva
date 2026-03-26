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
  const pathname = usePathname();
  return (
    <aside className="h-screen w-[220px] bg-[#0a1834] flex flex-col justify-between py-6 px-4">
      <nav className="flex-1">
        <ul className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${active ? "bg-white text-blue-900 shadow" : "text-gray-200 hover:bg-blue-900/30"}`}
                >
                  <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-lg">SE</div>
        <div className="text-xs text-gray-200 font-semibold">Staf Evaluator</div>
      </div>
    </aside>
  );
}