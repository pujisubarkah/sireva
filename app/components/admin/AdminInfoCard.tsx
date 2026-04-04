import React from "react";

export default function AdminInfoCard({ title, accent, children }: { title: string; accent?: string; children: React.ReactNode }) {
  const accentColor = accent === "orange" ? "bg-orange-100 border-orange-400" : "bg-blue-100 border-blue-400";
  return (
    <div className={`rounded-xl border-l-4 p-4 mb-4 ${accentColor}`}>
      <div className="font-semibold mb-2 text-blue-900">{title}</div>
      <div>{children}</div>
    </div>
  );
}
