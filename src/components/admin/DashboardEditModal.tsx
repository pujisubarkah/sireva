"use client";
import { useState } from "react";
import AdminModalShell from "./AdminModalShell";

interface DashboardEditModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DashboardEditModal({ open, onClose }: DashboardEditModalProps) {
  // Bagian A
  const [jumlahSS, setJumlahSS] = useState("");
  const [jumlahSP, setJumlahSP] = useState("");
  const [jumlahSK, setJumlahSK] = useState("");
  const [persenKinerja, setPersenKinerja] = useState("");
  // Bagian B
  const [visi, setVisi] = useState("");
  const [jumlahMisi, setJumlahMisi] = useState("");
  const [jumlahTujuan, setJumlahTujuan] = useState("");
  // Bagian C
  const [persenCascading, setPersenCascading] = useState("");
  const [descCascading, setDescCascading] = useState("");
  // Bagian D
  const [indikatorWarning, setIndikatorWarning] = useState("");
  const [targetWarning, setTargetWarning] = useState("");
  const [capaianWarning, setCapaianWarning] = useState("");
  const [catatanWarning, setCatatanWarning] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle submit logic
  };

  return (
    <AdminModalShell
      open={open}
      onClose={onClose}
      title="Edit Ringkasan Dashboard"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="w-full max-w-4xl max-h-[80vh] overflow-y-auto px-1">
        {/* Bagian A */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-blue-900 mb-2">Statistik Utama</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Jumlah Sasaran Strategis</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={jumlahSS} onChange={e => setJumlahSS(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Jumlah Sasaran Program</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={jumlahSP} onChange={e => setJumlahSP(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Jumlah Sasaran Kegiatan</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={jumlahSK} onChange={e => setJumlahSK(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Persentase Capaian Pemantauan Kinerja</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={persenKinerja} onChange={e => setPersenKinerja(e.target.value)} min={0} max={100} required />
            </div>
          </div>
        </div>
        {/* Bagian B */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-blue-900 mb-2">Ringkasan Visi & Tujuan</h3>
          <div className="mb-3">
            <label className="block text-sm font-medium text-blue-900 mb-1">Kutipan Visi</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[48px]" value={visi} onChange={e => setVisi(e.target.value)} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Jumlah Misi Organisasi</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={jumlahMisi} onChange={e => setJumlahMisi(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Jumlah Tujuan Strategis</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={jumlahTujuan} onChange={e => setJumlahTujuan(e.target.value)} required />
            </div>
          </div>
        </div>
        {/* Bagian C */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-blue-900 mb-2">Status Cascading</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Persentase Cascading</label>
              <input type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={persenCascading} onChange={e => setPersenCascading(e.target.value)} min={0} max={100} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-900 mb-1">Deskripsi Status Cascading</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[48px]" value={descCascading} onChange={e => setDescCascading(e.target.value)} required />
            </div>
          </div>
        </div>
        {/* Bagian D */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-blue-900 mb-2">Warning Kinerja</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Nama Indikator Bermasalah</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={indikatorWarning} onChange={e => setIndikatorWarning(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Target</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={targetWarning} onChange={e => setTargetWarning(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Capaian</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={capaianWarning} onChange={e => setCapaianWarning(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-900 mb-1">Catatan Warning</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[48px]" value={catatanWarning} onChange={e => setCatatanWarning(e.target.value)} required />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-8">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-800 text-white font-semibold hover:bg-blue-900"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </AdminModalShell>
  );
}
