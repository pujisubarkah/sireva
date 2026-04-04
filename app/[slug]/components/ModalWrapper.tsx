import React from "react";

interface ModalWrapperProps {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
}

export default function ModalWrapper({ title, children, onClose }: ModalWrapperProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg animate-fade-in-scale">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Tutup"
        >
          ×
        </button>
        {title && (
          <div className="px-6 pt-6 pb-2 text-lg font-semibold text-gray-800">{title}</div>
        )}
        <div className="px-6 pb-6">{children}</div>
      </div>
      <style jsx global>{`
        @keyframes fade-in-scale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}
