"use client";
const dasarHukum = [
  {
    title: "UU No. 5 Tahun 2014",
    desc: "Aparatur Sipil Negara.",
  },
  {
    title: "Perpres No. 79 Tahun 2018",
    desc: "Lembaga Administrasi Negara (LAN).",
  },
  {
    title: "PerLAN No. 1 Tahun 2021",
    desc: "Organisasi dan Tata Kerja LAN.",
  },
  {
    title: "PermenPAN-RB No. 89/2021",
    desc: "Penjenjangan Kinerja Instansi Pemerintah.",
  },
  {
    title: "Instruksi Kepala LAN 3/2025",
    desc: "Implementasi SI-REVA.",
  },
];

export default function DasarHukumSection() {
  return (
    <section id="dasar-hukum" className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-2">DASAR HUKUM</h2>
        <div className="w-16 h-1 bg-blue-500 rounded-full mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {dasarHukum.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-start shadow">
              <div className="mb-3">
                <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                  <rect x="6" y="6" width="20" height="20" rx="4" fill="#F3F4F6" />
                  <path d="M12 20v-6m4 6v-6m4 6v-6" stroke="#A0AEC0" strokeWidth="2" />
                </svg>
              </div>
              <div className="font-bold text-lg text-[#0B1F3A] mb-1">{item.title}</div>
              <div className="text-gray-600">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
