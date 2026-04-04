"use client";
import LayoutShell from "@/components/LayoutShell";
import PageHeader from "@/components/PageHeader";
import TableCard from "@/components/TableCard";
import { IconEdit, IconEye } from "@tabler/icons-react";

const data = [
  {
    id: 1,
    sasaran_strategis: "Meningkatkan Kualitas Tata Kelola Lembaga",
    indikator_kinerja: "Nilai SAKIP LAN",
    target_renstra: "A",
    target_perjanjian: "A",
    capaian: "A",
    persentase: "100%",
  },
  {
    id: 2,
    sasaran_strategis: "Terwujudnya ASN Profesional dan Kompeten",
    indikator_kinerja: "Indeks Kompetensi ASN",
    target_renstra: "85.0",
    target_perjanjian: "85.0",
    capaian: "82.0",
    persentase: "96.47%",
  },
  {
    id: 3,
    sasaran_strategis: "Meningkatkan Inovasi Kelembagaan",
    indikator_kinerja: "Jumlah Inovasi yang Diakui",
    target_renstra: "5",
    target_perjanjian: "5",
    capaian: "3",
    persentase: "60%",
  },
];

export default function SasaranStrategisPage() {
  return (
    <LayoutShell>
      <PageHeader
        title="Sasaran Strategis (SS)"
        description="Peta jalan strategis dan indikator kinerja makro (Level JPT Utama)."
      />
      <TableCard
        title="Daftar Sasaran Strategis"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 uppercase text-xs border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">No</th>
                <th className="text-left py-3 px-4 font-semibold min-w-[200px]">Sasaran Strategis</th>
                <th className="text-left py-3 px-4 font-semibold min-w-[200px]">Indikator Kinerja Sasaran Strategis</th>
                <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Target Indikator Renstra</th>
                <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Target Kinerja Perjanjian Kinerja</th>
                <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Capaian Kinerja</th>
                <th className="text-left py-3 px-4 font-semibold whitespace-nowrap">Persentase Capaian Kinerja</th>
                <th className="text-center py-3 px-4 font-semibold whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.sasaran_strategis}</td>
                  <td className="px-4 py-3 text-gray-700">{row.indikator_kinerja}</td>
                  <td className="px-4 py-3 text-gray-600">{row.target_renstra}</td>
                  <td className="px-4 py-3 text-gray-600">{row.target_perjanjian}</td>
                  <td className="px-4 py-3 text-gray-600">{row.capaian}</td>
                  <td className="px-4 py-3 text-gray-600">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                      parseFloat(row.persentase) >= 100 ? 'bg-emerald-100 text-emerald-800' : 
                      parseFloat(row.persentase) >= 80 ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {row.persentase}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors" title="Lihat Detail">
                        <IconEye size={18} stroke={2} />
                      </button>
                      <button className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors" title="Ubah Data">
                        <IconEdit size={18} stroke={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableCard>
    </LayoutShell>
  );
}
