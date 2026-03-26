export default function FloatingToolbar() {
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F3A] rounded-full p-3 flex flex-col gap-3 shadow-lg hidden sm:flex">
      {/* Dot grid icon */}
      <button className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors">
        <span className="text-white text-xl">⋮⋮</span>
      </button>
      {/* Arrow icon */}
      <button className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors">
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="text-white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 5v10m0 0l-4-4m4 4l4-4"/></svg>
      </button>
      {/* Expand icon */}
      <button className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors">
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20" stroke="currentColor" className="text-white"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M16 8V4h-4M4 12v4h4m8-4v4h-4"/></svg>
      </button>
    </div>
  );
}
