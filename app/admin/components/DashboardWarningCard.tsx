import React from "react";

export default function DashboardWarningCard() {
  return (
    <div className="bg-pink-50 border border-pink-200 rounded-xl shadow-sm p-6 flex flex-col min-h-[180px]">
      <div className="flex items-center justify-between mb-4">
        <div className="font-bold text-pink-700 text-base">WARNING KINERJA</div>
        <a href="#" className="text-pink-700 text-xs font-semibold hover:underline">Lihat Data</a>
      </div>
      <div className="bg-white rounded-lg p-3 mb-2 shadow-xs border border-pink-100">
        <div className="font-semibold text-gray-700 text-sm mb-1">Pusat Kajian Kebijakan</div>
        <div className="text-xs text-gray-500 mb-2">Persentase Rekomendasi Diadopsi</div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-600">Target <span className="font-bold">80%</span></span>
          <span className="text-gray-600">Capaian <span className="font-bold text-pink-700">45%</span></span>
        </div>
      </div>
      <div className="text-xs text-pink-700 mt-auto">* Terdapat 1 indikator dengan deviasi &gt; 20%.</div>
    </div>
  );
}
