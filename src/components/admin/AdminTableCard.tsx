import React from "react";

interface AdminTableCardProps {
  title?: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminTableCard({ title, toolbar, children }: AdminTableCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-0 mb-8">
      {(title || toolbar) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {title && <div className="text-lg font-bold text-[#0B1F3A]">{title}</div>}
          {toolbar && <div>{toolbar}</div>}
        </div>
      )}
      <div className="overflow-x-auto p-6">{children}</div>
    </div>
  );
}
