interface AdminProgressBarProps {
  value: number;
  color?: "blue" | "green" | "orange" | "red";
}

const colorMap = {
  blue: "bg-blue-700",
  green: "bg-green-600",
  orange: "bg-orange-500",
  red: "bg-red-600",
};

export default function AdminProgressBar({ value, color = "blue" }: AdminProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${colorMap[color]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
