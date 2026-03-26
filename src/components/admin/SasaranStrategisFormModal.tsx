"use client";
import { useState } from "react";
import AdminModalShell from "./AdminModalShell";

interface SasaranStrategisFormModalProps {
  open: boolean;
  mode?: "create" | "edit";
  onClose: () => void;
}

const statusOptions = ["TERCAPAI", "BERJALAN", "PERLU ATENSI"];

export default function SasaranStrategisFormModal({ open, mode = "create", onClose }: SasaranStrategisFormModalProps) {
  const [kode, setKode] = useState("");
  const [judul, setJudul] = useState("");
  const [iku, setIku] = useState("");
  const [target, setTarget] = useState("");
  const [capaian, setCapaian] = useState("");
  const [status, setStatus] = useState(statusOptions[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle submit
  };

  return (
    <AdminModalShell
      open={open}
      title={mode === "edit" ? "Edit Sasaran Strategis" : "Tambah Sasaran Strategis"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">Kode SS</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="SS-05"
              value={kode}
              onChange={e => setKode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">Indikator (IKU)</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="Persentase SDM kompeten"
              value={iku}
              onChange={e => setIku(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">Target</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="90%"
              value={target}
              onChange={e => setTarget(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">Capaian</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              placeholder="92%"
              value={capaian}
              onChange={e => setCapaian(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">Status</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              value={status}
              onChange={e => setStatus(e.target.value)}
              required
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">Judul Sasaran Strategis</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
            placeholder="Masukkan judul sasaran strategis..."
            value={judul}
            onChange={e => setJudul(e.target.value)}
            rows={3}
            required
          />
        </div>
        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
            Simpan SS
          </button>
        </div>
      </form>
    </AdminModalShell>
  );
}
