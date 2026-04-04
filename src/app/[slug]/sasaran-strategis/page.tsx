"use client";
import React from "react";
import UserLayoutShell from "@/components/user/UserLayoutShell";
import UserPageHeader from "@/components/user/UserPageHeader";
import UserTableCard from "@/components/user/UserTableCard";
import UserStatusBadge from "@/components/user/UserStatusBadge";
import { IconEye, IconPencil } from "@tabler/icons-react";

const data = [
  {
    sasaran: "Meningkatkan Kualitas Tata Kelola Lembaga",
    indikator: "NILAI SAKIP LAN",
    targetRenstra: "A",
    targetPK: "A",
    capaian: "A",
    persen: "100%",
  },
  {
    sasaran: "Terwujudnya ASN Profesional dan Kompeten",
    indikator: "INDEKS KOMPETENSI ASN",
    targetRenstra: "85.0",
    targetPK: "85.0",
    capaian: "82.0",
    persen: "96.5%",
  },
  {
    sasaran: "Meningkatkan Inovasi Kelembagaan",
    indikator: "JUMLAH INOVASI",
    targetRenstra: "5",
    targetPK: "5",
    capaian: "3",
    persen: "60%",
  },
  {
    sasaran: "Meningkatkan Akuntabilitas Kinerja",
    indikator: "NILAI LAKIP",
    targetRenstra: "A",
    targetPK: "A",
    capaian: "B",
    persen: "80%",
  },
];

export default function UserSasaranStrategisPage() {
  return (
    <UserLayoutShell>
      <UserPageHeader
        title="Sasaran Strategis (SS)"
        description="Peta jalan strategis dan indikator kinerja makro (Level JPT Utama)."
      />
      <UserTableCard
        title="Daftar Sasaran Strategis"
        toolbar={
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cari Sasaran Strategis..."
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button className="px-3 py-1.5 rounded-lg border border-blue-800 text-blue-800 text-sm font-semibold hover:bg-blue-50">Export</button>
          </div>
        }
      >
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-500 uppercase text-xs">
              <th className="text-left py-2 pr-4">No</th>
              <th className="text-left py-2">Sasaran Strategis</th>
              <th className="text-left py-2">Indikator Kinerja Sasaran Strategis</th>
              <th className="text-left py-2">Target Kinerja Renstra</th>
              <th className="text-left py-2">Target Kinerja Perjanjian Kinerja</th>
              <th className="text-left py-2">Capaian Kinerja</th>
              <th className="text-left py-2">% Capaian Kinerja</th>
              <th className="text-left py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td className="font-semibold pr-4">{idx + 1}</td>
                <td>{row.sasaran}</td>
                <td>{row.indikator}</td>
                <td>{row.targetRenstra}</td>
                <td>{row.targetPK}</td>
                <td>{row.capaian}</td>
                <td>{row.persen}</td>
                <td className="flex gap-2 items-center py-1">
                  <button title="Lihat" className="text-blue-700 hover:text-blue-900"><IconEye size={18} /></button>
                  <button title="Edit" className="text-amber-600 hover:text-amber-800"><IconPencil size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </UserTableCard>
    </UserLayoutShell>
  );
}
