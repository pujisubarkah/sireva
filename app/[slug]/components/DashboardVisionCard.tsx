import React from "react";

export default function DashboardVisionCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col min-h-[180px]">
      <div className="flex items-center justify-between mb-4">
        <div className="font-bold text-gray-800 text-base">VISI & TUJUAN</div>
        <a href="#" className="text-blue-700 text-xs font-semibold hover:underline">Lihat Detail</a>
      </div>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-1.5 rounded-l bg-yellow-400" style={{ minHeight: 40 }} />
        <div className="bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-700 font-medium flex-1">
          "Menjadi lembaga pembina yang mewujudkan birokrasi berkelas dunia untuk Indonesia Maju."
        </div>
      </div>
      <div className="flex flex-col gap-1 mt-auto">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Misi Organisasi</span>
          <span className="font-bold">3 Misi</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Tujuan Strategis</span>
          <span className="font-bold">4 Tujuan</span>
        </div>
      </div>
    </div>
  );
}
