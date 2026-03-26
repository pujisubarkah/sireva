"use client";
import { useState } from "react";
import AdminModalShell from "./AdminModalShell";

interface CascadingSetupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CascadingSetupModal({ open, onClose }: CascadingSetupModalProps) {
  // Level Strategis
  const [ss, setSs] = useState("");
  const [pjStrategis, setPjStrategis] = useState("");
  const [ikuStrategis, setIkuStrategis] = useState("");
  const [targetStrategis, setTargetStrategis] = useState("");
  // Level Program
  const [sp, setSp] = useState("");
  const [pjProgram, setPjProgram] = useState("");
  const [indikatorProgram, setIndikatorProgram] = useState("");
  const [targetProgram, setTargetProgram] = useState("");
  // Level Kegiatan
  const [sk, setSk] = useState("");
  const [picKegiatan, setPicKegiatan] = useState("");
  const [outputKegiatan, setOutputKegiatan] = useState("");
  // Opsi tambahan
  const [alignment, setAlignment] = useState(false);
  const [catatan, setCatatan] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle submit logic
  };

  return (
    <AdminModalShell
      open={open}
      onClose={onClose}
      title="Setup Cascading Kinerja"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="w-full max-w-3xl max-h-[80vh] overflow-y-auto px-1">
        {/* Level Strategis */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h3 className="text-base font-semibold text-blue-900 mb-3">Level Strategis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Pilih Sasaran Strategis</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={ss} onChange={e => setSs(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Nama Pejabat / Penanggung Jawab</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={pjStrategis} onChange={e => setPjStrategis(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">IKU Strategis</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={ikuStrategis} onChange={e => setIkuStrategis(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Target Strategis</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={targetStrategis} onChange={e => setTargetStrategis(e.target.value)} required />
            </div>
          </div>
        </div>
        {/* Level Program */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h3 className="text-base font-semibold text-blue-900 mb-3">Level Program</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Pilih Sasaran Program</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={sp} onChange={e => setSp(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Nama Pejabat / PIC Program</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={pjProgram} onChange={e => setPjProgram(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Indikator Program</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={indikatorProgram} onChange={e => setIndikatorProgram(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Target Program</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={targetProgram} onChange={e => setTargetProgram(e.target.value)} required />
            </div>
          </div>
        </div>
        {/* Level Kegiatan */}
        <div className="mb-8 pb-6 border-b border-gray-200">
          <h3 className="text-base font-semibold text-blue-900 mb-3">Level Kegiatan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">Pilih Sasaran Kegiatan</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={sk} onChange={e => setSk(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1">PIC Kegiatan</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={picKegiatan} onChange={e => setPicKegiatan(e.target.value)} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-900 mb-1">Output / Target Kegiatan</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={outputKegiatan} onChange={e => setOutputKegiatan(e.target.value)} required />
            </div>
          </div>
        </div>
        {/* Opsi tambahan */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-blue-900 mb-3">Opsi Tambahan</h3>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="alignment"
              checked={alignment}
              onChange={e => setAlignment(e.target.checked)}
              className="rounded border-gray-300 text-blue-800 focus:ring-blue-800 mr-2"
            />
            <label htmlFor="alignment" className="text-sm text-blue-900">Aktifkan alignment otomatis</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-1">Catatan Cascading</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[48px]" value={catatan} onChange={e => setCatatan(e.target.value)} />
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
            Simpan Setup
          </button>
        </div>
      </form>
    </AdminModalShell>
  );
}
