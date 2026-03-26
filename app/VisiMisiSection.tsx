"use client";
export default function VisiMisiSection() {
  return (
    <section id="visi-misi" className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0B1F3A] mb-2">VISI & MISI LAN RI</h2>
        <div className="flex justify-center mb-8">
          <span className="block w-16 h-1 bg-yellow-400 rounded-full"></span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* VISI */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center">
            <div className="bg-blue-100 text-blue-700 rounded-full p-3 mb-3">
              {/* Icon */}
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
            <h3 className="text-lg font-bold text-[#0B1F3A] mb-2">VISI</h3>
            <p className="text-xl font-semibold text-[#0B1F3A] text-center">
              Menjadi lembaga pembina yang unggul dalam mewujudkan birokrasi berkelas dunia untuk Indonesia Maju.
            </p>
          </div>
          {/* MISI */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col">
            <div className="bg-yellow-100 text-yellow-700 rounded-full p-3 mb-3 self-center">
              {/* Icon */}
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
            <h3 className="text-lg font-bold text-[#0B1F3A] mb-2 text-center">MISI</h3>
            <ul className="space-y-4 mt-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-yellow-500">
                  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/></svg>
                </span>
                <span>Meningkatkan kualitas SDM aparatur negara.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-yellow-500">
                  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/></svg>
                </span>
                <span>Mengembangkan inovasi tata kelola pemerintahan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-yellow-500">
                  <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2"/></svg>
                </span>
                <span>Memperkuat sistem pengawasan dan akuntabilitas.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
