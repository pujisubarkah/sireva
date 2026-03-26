interface AdminStatusBadgeProps {
  status: string;
}

const statusMap: Record<string, { bg: string; text: string }> = {
  TERCAPAI: { bg: "bg-green-100", text: "text-green-800" },
  BERJALAN: { bg: "bg-blue-100", text: "text-blue-800" },
  "PERLU ATENSI": { bg: "bg-pink-100", text: "text-pink-700" },
  SELESAI: { bg: "bg-green-100", text: "text-green-800" },
  "BELUM MULAI": { bg: "bg-gray-100", text: "text-gray-600" },
  "HAMPIR SELESAI": { bg: "bg-blue-100", text: "text-blue-800" },
  AKTIF: { bg: "bg-blue-100", text: "text-blue-800" },
};

export default function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const normalized = status.trim().toUpperCase();
  const style = statusMap[normalized] || { bg: "bg-gray-100", text: "text-gray-600" };
  return (
    <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}>{status}</span>
  );
}
