"use client";
import AdminLayoutShell from "../../../src/components/admin/AdminLayoutShell";
import AdminPageHeader from "../../../src/components/admin/AdminPageHeader";
import AdminTableCard from "../../../src/components/admin/AdminTableCard";
import AdminProgressBar from "../../../src/components/admin/AdminProgressBar";
import SasaranProgramFormModal from "../../../src/components/admin/SasaranProgramFormModal";
import React, { useState } from "react";

export default function AdminSasaranProgramPage() {
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

  return (
    <AdminLayoutShell>
      <AdminPageHeader
        title="Sasaran Program (SP)"
        description="Penjabaran strategis ke tingkat program kerja (Level JPT Pratama)."
        action={
          <button
            className="bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-900"
            onClick={handleAdd}
          >
            + Tambah SP
          </button>
        }
      />
      <AdminTableCard
        title="Daftar Sasaran Program"
        toolbar={
          <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm">
            <option>Filter by SS: Semua</option>
          </select>
        }
      >
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-500 uppercase text-xs">
              <th className="text-left py-2 pr-4">Kode</th>
              <th className="text-left py-2">Sasaran Program</th>
              <th className="text-left py-2">Unit Kerja (PIC)</th>
              <th className="text-left py-2">Indikator Kinerja Program</th>
              <th className="text-left py-2">Progress</th>
              <th className="text-left py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-semibold pr-4">SP-01</td>
              <td>
                Penyusunan Kurikulum PKN I
                <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Terkait: SS-01</span>
              </td>
              <td>Pusbangkom</td>
              <td>Jumlah kurikulum disusun</td>
              <td className="min-w-[120px]">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-700">80%</span>
                  <AdminProgressBar value={80} color="blue" />
                </div>
              </td>
              <td className="flex gap-2">
                <button className="p-1 hover:bg-gray-100 rounded" onClick={handleEdit}><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 12.5V13h.5l7.1-7.1-1.5-1.5L3 11.5v1Z" stroke="#0B1F3A" strokeWidth="1.2"/><path d="M12.5 5.5l-2-2" stroke="#0B1F3A" strokeWidth="1.2"/></svg></button>
                <button className="p-1 hover:bg-gray-100 rounded"><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 6l4 4M10 6l-4 4" stroke="#e11d48" strokeWidth="1.5"/></svg></button>
              </td>
            </tr>
            <tr>
              <td className="font-semibold pr-4">SP-02</td>
              <td>
                Workshop Laboratorium Inovasi
                <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Terkait: SS-02</span>
              </td>
              <td>Puslitbang</td>
              <td>Jumlah workshop</td>
              <td className="min-w-[120px]">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-700">60%</span>
                  <AdminProgressBar value={60} color="blue" />
                </div>
              </td>
              <td className="flex gap-2">
                <button className="p-1 hover:bg-gray-100 rounded" onClick={handleEdit}><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 12.5V13h.5l7.1-7.1-1.5-1.5L3 11.5v1Z" stroke="#0B1F3A" strokeWidth="1.2"/><path d="M12.5 5.5l-2-2" stroke="#0B1F3A" strokeWidth="1.2"/></svg></button>
                <button className="p-1 hover:bg-gray-100 rounded"><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 6l4 4M10 6l-4 4" stroke="#e11d48" strokeWidth="1.5"/></svg></button>
              </td>
            </tr>
            <tr>
              <td className="font-semibold pr-4">SP-03</td>
              <td>
                Penyusunan Laporan Kinerja
                <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Terkait: SS-03</span>
              </td>
              <td>Biro Perencanaan</td>
              <td>Jumlah laporan</td>
              <td className="min-w-[120px]">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-gray-700">95%</span>
                  <AdminProgressBar value={95} color="blue" />
                </div>
              </td>
              <td className="flex gap-2">
                <button className="p-1 hover:bg-gray-100 rounded" onClick={handleEdit}><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 12.5V13h.5l7.1-7.1-1.5-1.5L3 11.5v1Z" stroke="#0B1F3A" strokeWidth="1.2"/><path d="M12.5 5.5l-2-2" stroke="#0B1F3A" strokeWidth="1.2"/></svg></button>
                <button className="p-1 hover:bg-gray-100 rounded"><svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 6l4 4M10 6l-4 4" stroke="#e11d48" strokeWidth="1.5"/></svg></button>
              </td>
            </tr>
          </tbody>
        </table>
      </AdminTableCard>
      <SasaranProgramFormModal open={modalOpen} onClose={() => setModalOpen(false)} mode={modalMode} />
    </AdminLayoutShell>
  );
}
