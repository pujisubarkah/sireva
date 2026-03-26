"use client";
import AdminLayoutShell from "../../../src/components/admin/AdminLayoutShell";
import AdminPageHeader from "../../../src/components/admin/AdminPageHeader";
import AdminTableCard from "../../../src/components/admin/AdminTableCard";
import AdminStatusBadge from "../../../src/components/admin/AdminStatusBadge";
import SasaranStrategisFormModal from "../../../src/components/admin/SasaranStrategisFormModal";
import React, { useState } from "react";

// Move summaryCards, rows, and SummaryAndTable above the export default function
const summaryCards = [
  { value: 3, label: "SS", title: "TOTAL SASARAN" },
  { value: 1, label: "", title: "SS TERCAPAI" },
  { value: "88.5%", label: "", title: "RATA-RATA KINERJA" },
];

const rows = [
  {
    kode: "SS-01",
    tujuan: "T-01",
    sasaran: "Meningkatnya Kualitas Tata Kelola LAN",
    indikator: "Nilai SAKIP LAN",
    pic: "Biro Perencanaan dan Keuangan",
    capaian: "A",
    target: "A",
    status: "TERCAPAI",
  },
  {
    kode: "SS-02",
    tujuan: "T-02",
    sasaran: "Terwujudnya ASN yang Profesional",
    indikator: "Indeks Profesionalitas ASN",
  }
];

export default function AdminSasaranStrategisPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | undefined>("create");
  // Dummy data untuk edit, bisa dikembangkan sesuai kebutuhan
  // const [editData, setEditData] = useState(null);

  const handleAdd = () => {
    setModalMode("create");
    setModalOpen(true);
  };
  const handleEdit = () => {
    setModalMode("edit");
    setModalOpen(true);
  };

  return (
    <AdminLayoutShell>
      <AdminPageHeader
        title="Sasaran Strategis (SS)"
        description="Peta jalan strategis dan indikator kinerja makro (Level JPT Utama)."
        action={
          <button
            className="bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-900"
            onClick={handleAdd}
          >
            + Tambah SS
          </button>
        }
      />
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
      {/* Table */}
      <div className="max-w-screen-lg mx-auto bg-white rounded-2xl border border-gray-200 p-0 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
              <th className="py-3 px-4 text-left font-bold">KODE</th>
              <th className="py-3 px-4 text-left font-bold">SASARAN & INDIKATOR</th>
              <th className="py-3 px-4 text-left font-bold">UNIT KERJA (PIC)</th>
              <th className="py-3 px-4 text-center font-bold">CAPAIAN</th>
              <th className="py-3 px-4 text-center font-bold">STATUS</th>
              <th className="py-3 px-4 text-center font-bold">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.kode} className="border-b last:border-b-0">
                <td className="py-3 px-4 font-semibold align-top">
                  <div className="flex flex-col gap-1">
                    <span>{row.kode}</span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold w-max">Mendukung Tujuan: {row.tujuan}</span>
                  </div>
                </td>
                <td className="py-3 px-4 align-top">
                  <div className="font-bold text-blue-900 mb-1">{row.sasaran}</div>
                  <div className="text-xs text-gray-500 mb-1">Indikator: {row.indikator}</div>
                  <div className="text-xs text-gray-400">TARGET: {row.target}</div>
                </td>
                <td className="py-3 px-4 align-top">{row.pic}</td>
                <td className="py-3 px-4 text-center align-top font-bold text-blue-900">{row.capaian}</td>
                <td className="py-3 px-4 text-center align-top">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${row.status === "TERCAPAI" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>{row.status}</span>
                </td>
                <td className="py-3 px-4 text-center align-top">
                  <div className="flex gap-1 justify-center">
                    <button className="p-1 border border-gray-200 rounded hover:bg-gray-50" title="View">
                      <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#2563eb" strokeWidth="1.2"/><circle cx="8" cy="8" r="2.5" stroke="#2563eb" strokeWidth="1.2"/></svg>
                    </button>
                    <button className="p-1 border border-gray-200 rounded hover:bg-gray-50" title="Edit">
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
    </AdminLayoutShell>
  );
}

