interface AdminInfoCardProps {
  title: string;
  children: React.ReactNode;
  accent?: "blue" | "orange" | "red" | "green";
  actionLabel?: string;
}

const accentColors = {
  blue: "bg-blue-800",
  orange: "bg-orange-500",
  red: "bg-red-600",
  green: "bg-green-600",
};

export default function AdminInfoCard({ title, children, accent = "blue", actionLabel }: AdminInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2 h-6 rounded-full ${accentColors[accent]}`} />
          <span className="text-lg font-bold text-[#0B1F3A]">{title}</span>
        </div>
        {actionLabel && (
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {actionLabel}
          </span>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
