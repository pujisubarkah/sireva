"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  isOpen: boolean;
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="mr-3">
        <rect x="3" y="3" width="6" height="6" rx="2" fill="currentColor" className="text-blue-400" />
        <rect x="11" y="3" width="6" height="6" rx="2" fill="currentColor" className="text-blue-400" />
        <rect x="3" y="11" width="6" height="6" rx="2" fill="currentColor" className="text-blue-400" />
        <rect x="11" y="11" width="6" height="6" rx="2" fill="currentColor" className="text-blue-400" />
      </svg>
    ),
  },
  {
    label: "Visi, Misi & Tujuan",
    href: "/admin/visi-misi",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="mr-3">
        <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Sasaran Strategis",
    href: "/admin/sasaran-strategis",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="mr-3">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="10" cy="10" r="3" fill="currentColor" className="text-blue-400" />
      </svg>
    ),
  },
  {
    label: "Sasaran Program",
    href: "/admin/sasaran-program",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="mr-3">
        <rect x="4" y="4" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    label: "Sasaran Kegiatan",
    href: "/admin/sasaran-kegiatan",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="mr-3">
        <path d="M4 10h12M10 4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Pemantauan Kinerja",
    href: "/admin/pemantauan-kinerja",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="mr-3">
        <rect x="3" y="10" width="3" height="7" rx="1.5" fill="currentColor" className="text-blue-400" />
        <rect x="8.5" y="6" width="3" height="11" rx="1.5" fill="currentColor" className="text-blue-400" />
        <rect x="14" y="3" width="3" height="14" rx="1.5" fill="currentColor" className="text-blue-400" />
      </svg>
    ),
  },
  {
    label: "Cascading",
    href: "/admin/cascading",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20" className="mr-3">
        <path d="M5 5h10v3H5zM5 12h10v3H5z" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const pathname = usePathname();
  return (
    <aside
      className={`relative shrink-0 overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'w-[248px] opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full'}
      `}
      aria-hidden={!isOpen}
    >
      <div className="min-h-screen w-[248px] bg-[#0B1F3A] text-white flex flex-col justify-between">
        <div className="flex flex-col h-full">
          {/* Branding */}
          <div className="flex flex-col items-center py-8 border-b border-blue-900">
          <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center mb-2">
            {/* Placeholder logo */}
            <svg width="28" height="28" fill="none" viewBox="0 0 28 28">
              <rect width="28" height="28" rx="6" fill="#FFD600" />
              <text x="14" y="19" textAnchor="middle" fontSize="14" fill="#0B1F3A" fontWeight="bold">L</text>
            </svg>
          </div>
          <div className="text-2xl font-bold text-white tracking-wide">LAN RI</div>
          <div className="text-xs font-semibold text-yellow-400 mt-1 tracking-widest">SI-REVA 2026</div>
          </div>
          {/* Menu Section */}
          <div className="px-4 mt-8 flex-1">
            <div className="text-xs text-blue-200 font-semibold mb-3 tracking-widest">MENU UTAMA</div>
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg font-medium text-sm transition-colors ${active ? "bg-blue-700 text-white" : "text-blue-100 hover:bg-blue-800 hover:text-white"}`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          {/* Logout */}
          <div className="px-4 pb-6">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm bg-pink-100 text-pink-700 hover:bg-pink-200 transition-colors">
              {/* Icon logout */}
              <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                <path d="M7 5v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 9H3m0 0l2.5-2.5M3 9l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Logout Sistem
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
