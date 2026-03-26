import React from "react";

interface AdminModalShellProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "md" | "lg" | "xl";
}

const sizeMap = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export default function AdminModalShell({ open, title, description, onClose, children, size = "md" }: AdminModalShellProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${sizeMap[size]} mx-4 relative`}>
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-2 border-b border-gray-100">
          <div>
            <div className="text-xl font-bold text-[#0B1F3A]">{title}</div>
            {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Tutup"
          >
            {/* Icon close */}
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
