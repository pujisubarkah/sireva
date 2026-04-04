"use client";
import LayoutShell from "../../../components/LayoutShell";
import PageHeader from "../../../components/PageHeader";
import UserStatCard from "@/components/user/UserStatCard";
import UserInfoCard from "@/components/user/UserInfoCard";
import UserProgressBar from "@/components/user/UserProgressBar";

export default function UserDashboardPage() {
  return (
<LayoutShell>
      <PageHeader
        title="Dashboard Unit Kerja"
        description="Ringkasan capaian kinerja unit Anda (Pusbangkom Pejabat Negara) Tahun 2026."
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <UserStatCard title="SASARAN STRATEGIS" value="1 SS" badgeText="Tercapai" variant="green" />
        <UserStatCard title="SASARAN PROGRAM" value="3 SP" badgeText="Berjalan" variant="blue" />
        <UserStatCard title="SASARAN KEGIATAN" value="8 SK" badgeText="Aktif" variant="blue" />
        <div className="col-span-1 md:col-span-1">
          <UserStatCard
            title="CAPAIAN PEMANTAUAN KINERJA"
            value="82.0%"
            variant="green"
            subtitle="Tahun 2026"
          />
        </div>
      </div>
      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserInfoCard title="VISI & TUJUAN" accent="blue" actionLabel="Lihat Detail">
          <div className="mb-2 text-lg font-semibold text-blue-900">"Menjadi lembaga pembina yang unggul dalam mewujudkan birokrasi berkelas dunia untuk Indonesia Maju."</div>
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-sm text-gray-700">Misi Organisasi: <b>3 Misi</b></span>
            <span className="text-sm text-gray-700">Tujuan Strategis: <b>4 Tujuan</b></span>
          </div>
        </UserInfoCard>
        <UserInfoCard title="STATUS CASCADING" accent="green" actionLabel="Lihat Pohon">
          <div className="text-xs font-semibold text-gray-500 mb-1">Cascading 100%</div>
          <UserProgressBar value={100} color="green" />
          <div className="text-sm text-gray-700 mt-2">Semua sasaran kegiatan unit telah tercascading sempurna.</div>
        </UserInfoCard>
        <UserInfoCard title="STATUS KINERJA" accent="green">
          <div className="bg-emerald-50 rounded-xl p-4 flex flex-col gap-1">
            <div className="text-xs font-bold text-emerald-700 mb-1">Unit Anda</div>
            <div className="text-sm text-emerald-900 font-semibold">Semua Indikator Kinerja terpantau hijau.</div>
            <div className="text-xs text-gray-500 mt-2">Tidak ada deviasi yang melewati batas toleransi bulan ini.</div>
          </div>
        </UserInfoCard>
      </div>
    </LayoutShell>
  );
}
