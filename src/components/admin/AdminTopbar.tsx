"use client";
interface AdminTopbarProps {
  onToggleSidebar: () => void;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-[72px] w-full bg-white border-b border-gray-200 flex items-center px-8 justify-between">
      {/* Kiri: Hamburger + Search */}
      <div className="flex items-center gap-4 flex-1 max-w-[420px]">
        {/* Hamburger */}
        <button
          className="mr-2 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-800"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
        >
          {/* Hamburger icon */}
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <rect y="5" width="24" height="2.5" rx="1.25" fill="#0B1F3A" />
            <rect y="11" width="24" height="2.5" rx="1.25" fill="#0B1F3A" />
            <rect y="17" width="24" height="2.5" rx="1.25" fill="#0B1F3A" />
          </svg>
        </button>
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {/* Icon search */}
            <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
              <circle cx="8" cy="8" r="6.5" stroke="#94a3b8" strokeWidth="1.5" />
              <path d="M15 15l-3.5-3.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Cari data kinerja..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
          />
        </div>
      </div>
      {/* Tengah: Mode */}
      <div className="flex items-center gap-2 mx-8">
        <span className="text-xs text-gray-500 font-semibold">Mode:</span>
        <select className="rounded-md border border-gray-300 py-1 px-3 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-800">
          <option>Admin Perencana</option>
        </select>
      </div>
      {/* Kanan: Notif & User */}
      <div className="flex items-center gap-6">
        {/* Icon bell */}
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path d="M10 17a2 2 0 0 0 2-2H8a2 2 0 0 0 2 2Zm6-3V9a6 6 0 1 0-12 0v5l-1 1v1h16v-1l-1-1Z" stroke="#0B1F3A" strokeWidth="1.5" />
          </svg>
        </button>
        {/* User info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-[#0B1F3A] leading-tight">Admin Perencana</div>
            <div className="text-xs text-gray-500">Biro Perencanaan</div>
          </div>
          <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">"
            AP
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
