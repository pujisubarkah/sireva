"use client";

import AdminLayoutShell from "../../../src/components/admin/AdminLayoutShell";
import AdminPageHeader from "../../../src/components/admin/AdminPageHeader";
import AdminStatusBadge from "../../../src/components/admin/AdminStatusBadge";
import AdminProgressBar from "../../../src/components/admin/AdminProgressBar";
import SasaranKegiatanFormModal from "../../../src/components/admin/SasaranKegiatanFormModal";
import React, { useState } from "react";


export default function AdminSasaranKegiatanPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>("create");

  const handleAdd = () => {
    setModalMode("create");
    setModalOpen(true);
  };
  const handleEdit = () => {
    setModalMode("edit");
    setModalOpen(true);
  };

  // Dummy summary data
  const summaryCards = [
    { value: 3, label: "SK", title: "TOTAL KEGIATAN" },
    { value: 1, label: "", title: "SELESAI" },
    { value: "65.0%", label: "", title: "RATA-RATA PROGRES" },
  ];

  // Dummy table data
  const rows = [
    {
      nama: "Penyusunan Kurikulum PKN I",
      sp: "SP-02",
      unit: "Pusbangkom",
      timeline: "Mar - Apr 2026",
      progress: 100,
      status: "SELESAI",
    },
    {
      nama: "Workshop Laboratorium Inovasi Daerah",
      sp: "SP-03",
      unit: "Puslitbang",
      timeline: "Jun 2026",
      progress: 0,
      status: "BELUM MULAI",
    },
    {
      nama: "Penyusunan Laporan Kinerja (LAKIP)",
      sp: "SP-01",
      unit: "Biro Perencanaan",
      timeline: "Jan - Feb 2026",
      progress: 95,
      status: "HAMPIR SELESAI",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f8fa] px-6 md:px-10 py-10">
      {/* Header & Action Row */}
      <div className="max-w-screen-lg mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900 mb-1">Sasaran Kegiatan (SK)</h1>
          <p className="text-gray-500 text-sm">Level Administrator/Pengawas</p>
        </div>
        <div className="flex gap-2 items-center">
          <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
            <option>Semua Unit Kerja</option>
          </select>
          <button className="bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-900" onClick={handleAdd}>+ Tambah SK</button>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {summaryCards.map((c, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-blue-900">{c.value}</span>
              {c.label && <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">{c.label}</span>}
            </div>
            <div className="text-xs text-gray-500 font-bold tracking-widest uppercase mt-1">{c.title}</div>
          </div>
        ))}
      </div>
      {/* Table Card */}
      <div className="max-w-screen-lg mx-auto bg-white rounded-2xl border border-gray-200 p-0 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
              <th className="py-3 px-4 text-left font-bold">NAMA KEGIATAN</th>
              <th className="py-3 px-4 text-left font-bold">TURUNAN DARI SP</th>
              <th className="py-3 px-4 text-left font-bold">UNIT KERJA</th>
              <th className="py-3 px-4 text-left font-bold">TIMELINE</th>
              <th className="py-3 px-4 text-center font-bold">PROGRES</th>
              <th className="py-3 px-4 text-center font-bold">STATUS</th>
              <th className="py-3 px-4 text-center font-bold">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="py-3 px-4 align-top font-semibold text-blue-900">{row.nama}</td>
                <td className="py-3 px-4 align-top">
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">{`Turunan dari: ${row.sp}`}</span>
                </td>
                <td className="py-3 px-4 align-top">{row.unit}</td>
                <td className="py-3 px-4 align-top">
                  <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">{row.timeline}</span>
                </td>
                <td className="py-3 px-4 text-center align-top min-w-[120px]">
                  <div className="flex flex-col gap-1 items-center">
                    <span className="text-xs font-semibold text-gray-700">{row.progress}%</span>
                    <AdminProgressBar value={row.progress} color={row.progress === 100 ? "green" : "blue"} />
                  </div>
                </td>
                <td className="py-3 px-4 text-center align-top">
                  <AdminStatusBadge status={row.status} />
                </td>
                <td className="py-3 px-4 text-center align-top">
                  <div className="flex gap-1 justify-center">
                    <button className="p-1 border border-gray-200 rounded hover:bg-gray-50" title="Edit" onClick={handleEdit}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 12.5V13h.5l7.1-7.1-1.5-1.5L3 11.5v1Z" stroke="#0B1F3A" strokeWidth="1.2"/><path d="M12.5 5.5l-2-2" stroke="#0B1F3A" strokeWidth="1.2"/></svg>
                    </button>
                    <button className="p-1 border border-gray-200 rounded hover:bg-gray-50" title="Delete">
                      <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 6l4 4M10 6l-4 4" stroke="#e11d48" strokeWidth="1.5"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SasaranKegiatanFormModal open={modalOpen} onClose={() => setModalOpen(false)} mode={modalMode} />
    </div>
  );
}
