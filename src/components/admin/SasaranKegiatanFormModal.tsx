"use client";
import { useState } from "react";
import AdminModalShell from "./AdminModalShell";

interface SasaranKegiatanFormModalProps {
  open: boolean;
  mode?: "create" | "edit";
  onClose: () => void;
}

const SP_OPTIONS = [
  { value: "SP-01", label: "SP-01" },
  { value: "SP-02", label: "SP-02" },
  { value: "SP-03", label: "SP-03" },
];

const STATUS_OPTIONS = [
  { value: "SELESAI", label: "SELESAI" },
  { value: "BELUM MULAI", label: "BELUM MULAI" },
  { value: "HAMPIR SELESAI", label: "HAMPIR SELESAI" },
  { value: "BERJALAN", label: "BERJALAN" },
];

export default function SasaranKegiatanFormModal({ open, mode = "create", onClose }: SasaranKegiatanFormModalProps) {
  const [nama, setNama] = useState("");
  const [sp, setSp] = useState(SP_OPTIONS[0].value);
  const [unit, setUnit] = useState("");
  const [timeline, setTimeline] = useState("");
  const [progress, setProgress] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0].value);
  const [keterangan, setKeterangan] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle submit logic
  };

  return (
    <AdminModalShell
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit Sasaran Kegiatan" : "Tambah Sasaran Kegiatan"}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-900">
            {mode === "edit" ? "Edit Sasaran Kegiatan" : "Tambah Sasaran Kegiatan"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-blue-900 mb-1">Nama Kegiatan</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={nama}
              onChange={e => setNama(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Turunan dari Sasaran Program</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={sp}
              onChange={e => setSp(e.target.value)}
              required
            >
              {SP_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Unit Kerja</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Timeline Pelaksanaan</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={timeline}
              onChange={e => setTimeline(e.target.value)}
              placeholder="Jan - Feb 2026"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Progres Kegiatan (%)</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={progress}
              onChange={e => setProgress(e.target.value)}
              min={0}
              max={100}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={status}
              onChange={e => setStatus(e.target.value)}
              required
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-blue-900 mb-1">Keterangan Singkat</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={keterangan}
              onChange={e => setKeterangan(e.target.value)}
              required
            />
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
            Simpan SK
          </button>
        </div>
      </form>
    </AdminModalShell>
  );
}
