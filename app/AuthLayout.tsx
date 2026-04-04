"use client";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400/20 rounded-full blur-3xl"></div>

      <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-blue-900 font-medium hover:text-blue-700 transition-colors">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Beranda
        </Link>
        <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-[0_8px_40px_0_rgba(31,38,135,0.08)] flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Left Panel */}
          <div className="flex-1 flex flex-col p-10 lg:p-12 border-b md:border-b-0 md:border-r border-gray-100/50 bg-gradient-to-br from-blue-50/50 to-white/30 relative overflow-hidden">
            {/* Inner Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="mb-8">
                <div className="inline-block p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-400 shadow-lg shadow-blue-500/30 mb-4">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">LAN RI</h2>
                <div className="text-sm font-semibold text-emerald-500 tracking-widest uppercase mt-1">SI-REVA 2026</div>
                <p className="mt-4 text-gray-500 text-sm leading-relaxed max-w-sm">
                  Sistem Informasi Rencana dan Evaluasi Kinerja untuk memantau pencapaian sasaran strategis secara real-time.
                </p>
              </div>

              {/* Procedural Dashboard Graphic */}
              <div className="mt-auto bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-lg p-5 w-full flex-1 max-h-[220px] flex flex-col gap-3 group hover:shadow-xl transition-shadow duration-500">
                {/* Header Mockup */}
                <div className="flex items-center justify-between mb-2">
                  <div className="w-24 h-4 bg-gray-200/80 rounded-full"></div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 bg-blue-100/80 rounded-full"></div>
                    <div className="w-6 h-6 bg-emerald-100/80 rounded-full"></div>
                  </div>
                </div>
                {/* Chart Area Mockup */}
                <div className="flex items-end gap-2 h-24 mt-2">
                  <div className="w-full bg-blue-100/60 rounded-t-md h-[40%] group-hover:h-[60%] transition-all duration-700 ease-out"></div>
                  <div className="w-full bg-blue-200/60 rounded-t-md h-[70%] group-hover:h-[85%] transition-all duration-700 ease-out delay-75"></div>
                  <div className="w-full bg-emerald-300/60 rounded-t-md h-[50%] group-hover:h-[95%] transition-all duration-700 ease-out delay-150"></div>
                  <div className="w-full bg-blue-100/60 rounded-t-md h-[30%] group-hover:h-[45%] transition-all duration-700 ease-out delay-200"></div>
                  <div className="w-full bg-blue-200/60 rounded-t-md h-[80%] group-hover:h-[70%] transition-all duration-700 ease-out delay-300"></div>
                  <div className="w-full bg-emerald-400/60 rounded-t-md h-[60%] group-hover:h-[80%] transition-all duration-700 ease-out delay-500"></div>
                </div>
                {/* Footer Mockup */}
                <div className="grid grid-cols-3 gap-3 mt-auto">
                  <div className="h-2 bg-gray-100 rounded-full"></div>
                  <div className="h-2 bg-gray-100 rounded-full"></div>
                  <div className="h-2 bg-gray-100 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel (Form Content) */}
          <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 relative">
            <div className="w-full max-w-md flex justify-center">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
