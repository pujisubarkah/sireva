"use client";
import { useState } from "react";
import AdminModalShell from "./AdminModalShell";

interface SasaranProgramFormModalProps {
  open: boolean;
  mode?: "create" | "edit";
  onClose: () => void;
}

const SS_OPTIONS = [
  { value: "SS-01", label: "SS-01" },
  { value: "SS-02", label: "SS-02" },
  { value: "SS-03", label: "SS-03" },
  { value: "SS-04", label: "SS-04" },
];

export default function SasaranProgramFormModal({ open, mode = "create", onClose }: SasaranProgramFormModalProps) {
  const [kode, setKode] = useState("");
  const [ss, setSs] = useState(SS_OPTIONS[0].value);
  const [nama, setNama] = useState("");
  const [pic, setPic] = useState("");
  const [indikator, setIndikator] = useState("");
  const [target, setTarget] = useState("");
  const [progress, setProgress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle submit logic
  };

  return (
    <AdminModalShell
      open={open}
      onClose={onClose}
      title={mode === "edit" ? "Edit Sasaran Program" : "Tambah Sasaran Program"}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-blue-900">
            {mode === "edit" ? "Edit Sasaran Program" : "Tambah Sasaran Program"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode SP</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={kode}
              onChange={e => setKode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Terkait Sasaran Strategis</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={ss}
              onChange={e => setSs(e.target.value)}
              required
            >
              {SS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sasaran Program</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[60px] focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={nama}
              onChange={e => setNama(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Kerja (PIC)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={pic}
              onChange={e => setPic(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Indikator Kinerja Program</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={indikator}
              onChange={e => setIndikator(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Program</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={target}
              onChange={e => setTarget(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Realisasi / Progress</label>
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
            Simpan SP
          </button>
        </div>
      </form>
    </AdminModalShell>
  );
}
