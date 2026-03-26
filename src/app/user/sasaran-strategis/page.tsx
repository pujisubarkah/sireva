"use client";
import UserLayoutShell from "../../../components/user/UserLayoutShell";
import UserPageHeader from "../../../components/user/UserPageHeader";
import UserTableCard from "../../../components/user/UserTableCard";
import UserStatusBadge from "../../../components/user/UserStatusBadge";

const data = [
  {
    kode: "SS-01",
    sasaran: "Meningkatkan Kualitas Tata Kelola Lembaga",
    iku: "NILAI SAKIP LAN",
    target: "A",
    capaian: "A",
    status: "TERCAPAI",
  },
  {
    kode: "SS-02",
    sasaran: "Terwujudnya ASN Profesional dan Kompeten",
    iku: "INDEKS KOMPETENSI ASN",
    target: "85.0",
    capaian: "82.0",
    status: "BERJALAN",
  },
  {
    kode: "SS-03",
    sasaran: "Meningkatkan Inovasi Kelembagaan",
    iku: "JUMLAH INOVASI",
    target: "5",
    capaian: "3",
    status: "BERJALAN",
  },
  {
    kode: "SS-04",
    sasaran: "Meningkatkan Akuntabilitas Kinerja",
    iku: "NILAI LAKIP",
    target: "A",
    capaian: "B",
    status: "PERLU ATENSI",
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
              <th className="text-left py-2 pr-4">KODE</th>
              <th className="text-left py-2">SASARAN STRATEGIS</th>
              <th className="text-left py-2">INDIKATOR (IKU)</th>
              <th className="text-left py-2">TARGET</th>
              <th className="text-left py-2">CAPAIAN</th>
              <th className="text-left py-2">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.kode}>
                <td className="font-semibold pr-4">{row.kode}</td>
                <td>{row.sasaran}</td>
                <td>{row.iku}</td>
                <td>{row.target}</td>
                <td>{row.capaian}</td>
                <td><UserStatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </UserTableCard>
    </UserLayoutShell>
  );
}
