"use client";
import LayoutShell from "@/components/LayoutShell";
import PageHeader from "@/components/PageHeader";
import InfoCard from "@/components/InfoCard";

export default function VisiMisiTujuanPage() {
  return (
    <LayoutShell>
      <PageHeader
        title="Visi, Misi & Tujuan"
        description="Fondasi arah kebijakan dan landasan perencanaan strategis LAN RI."
      />
      {/* Hero Card */}
      <div className="mb-8 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-emerald-500/20 rounded-3xl blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-3xl p-8 md:p-10 flex flex-col gap-4 shadow-xl relative overflow-hidden transition-transform duration-500 group-hover:-translate-y-1">
          {/* Decorative Circles */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-[-20%] right-[10%] w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl"></div>
          
          <span className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 text-xs font-bold px-3 py-1.5 rounded-full w-max shadow-sm backdrop-blur-sm z-10">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            VISI LAN RI 2026
          </span>
          <div className="text-white text-2xl md:text-3xl font-extrabold leading-tight z-10">
            Menjadi Lembaga Pembina yang Unggul Dalam Mewujudkan Birokrasi Berkelas Dunia Untuk Indonesia Maju.
          </div>
        </div>
      </div>
      
      {/* Grid 2 kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Misi Organisasi */}
        <InfoCard title="Misi Organisasi" accent="blue" actionLabel="3 Misi Utama">
          <ul className="space-y-3">
            <li className="flex items-start gap-3 bg-blue-50/50 hover:bg-blue-50 rounded-xl px-4 py-3 border border-blue-100/50 transition-colors">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mt-0.5">1</span>
              <span className="text-gray-700 text-sm font-medium leading-relaxed">Meningkatkan kualitas SDM aparatur negara melalui pelatihan inovatif dan berstandar global.</span>
            </li>
            <li className="flex items-start gap-3 bg-blue-50/50 hover:bg-blue-50 rounded-xl px-4 py-3 border border-blue-100/50 transition-colors">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mt-0.5">2</span>
              <span className="text-gray-700 text-sm font-medium leading-relaxed">Mengembangkan inovasi tata kelola pemerintahan yang responsif terhadap dinamika global.</span>
            </li>
            <li className="flex items-start gap-3 bg-blue-50/50 hover:bg-blue-50 rounded-xl px-4 py-3 border border-blue-100/50 transition-colors">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mt-0.5">3</span>
              <span className="text-gray-700 text-sm font-medium leading-relaxed">Memperkuat sistem pengawasan, akuntabilitas, dan pelayanan publik berbasis rekam jejak digital.</span>
            </li>
          </ul>
        </InfoCard>
        
        {/* Tujuan Strategis */}
        <InfoCard title="Tujuan Strategis" accent="green" actionLabel="Target 2026">
          <div className="overflow-hidden rounded-xl border border-gray-100 mt-2">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-gray-500 font-semibold tracking-wider text-xs">
                  <th className="text-left py-3 px-4">KODE</th>
                  <th className="text-left py-3 px-4">PERNYATAAN TUJUAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition-colors group">
                  <td className="font-bold text-gray-900 px-4 py-3.5 group-hover:text-emerald-600 transition-colors">T-01</td>
                  <td className="text-gray-600 px-4 py-3.5 font-medium">Meningkatkan kualitas pelayanan publik berbasis digital</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors group">
                  <td className="font-bold text-gray-900 px-4 py-3.5 group-hover:text-emerald-600 transition-colors">T-02</td>
                  <td className="text-gray-600 px-4 py-3.5 font-medium">Meningkatkan profesionalisme ASN di seluruh K/L/D</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors group">
                  <td className="font-bold text-gray-900 px-4 py-3.5 group-hover:text-emerald-600 transition-colors">T-03</td>
                  <td className="text-gray-600 px-4 py-3.5 font-medium">Meningkatkan ekosistem inovasi kelembagaan daerah</td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors group">
                  <td className="font-bold text-gray-900 px-4 py-3.5 group-hover:text-emerald-600 transition-colors">T-04</td>
                  <td className="text-gray-600 px-4 py-3.5 font-medium">Meningkatkan akuntabilitas kinerja LAN RI Emas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </InfoCard>
      </div>
    </LayoutShell>
  );
}
