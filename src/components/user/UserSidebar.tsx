"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserSidebarProps {
  isOpen: boolean;
}

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
    href: "/user/visi-misi-tujuan",
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

const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen }) =>{
  const pathname = usePathname();
  return (
    <aside
      className={`relative shrink-0 overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'w-[248px] opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full'}
      `}
      aria-hidden={!isOpen}
    >
      <div className="min-h-screen w-[248px] bg-[#0a1834] text-white flex flex-col justify-between py-6 px-4">
        <div className="flex flex-col h-full">
          {/* Branding */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center mb-2">
              {/* Logo Placeholder */}
              <span className="text-blue-900 font-bold text-lg">L</span>
            </div>
            <div className="text-2xl font-extrabold text-white tracking-wide">LAN RI</div>
            <div className="text-xs text-yellow-400 font-semibold mt-1">SI-REVA 2026</div>
          </div>
          <div className="text-xs text-gray-400 font-bold mb-2 px-2 tracking-widest">MENU UTAMA</div>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${active ? "bg-blue-600 text-white" : "text-gray-200 hover:bg-blue-900 hover:text-white"}`}
                >
                  <span className="w-5 h-5 flex items-center justify-center text-blue-200">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {/* Logout */}
          <div className="mt-8">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-pink-100 text-pink-700 font-semibold text-sm hover:bg-pink-200 transition-colors">
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M7 9h7m0 0l-2.5-2.5M14 9l-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="3" width="7" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/></svg>
              Logout Sistem
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
export default UserSidebar;
