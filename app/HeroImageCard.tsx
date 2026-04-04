export default function HeroImageCard() {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Procedural Dashboard Graphic Container */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white p-6 flex flex-col gap-4 group hover:shadow-[0_8px_40px_rgb(59,130,246,0.2)] transition-all duration-500 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        {/* Header Mockup */}
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex flex-col gap-1">
            <div className="w-32 h-4 bg-gray-200 rounded-full"></div>
            <div className="w-20 h-3 bg-gray-100 rounded-full"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full"></div>
            <div className="w-8 h-8 bg-emerald-100 rounded-full"></div>
          </div>
        </div>
        
        {/* Content Area Mockup */}
        <div className="grid grid-cols-2 gap-4 mt-2 relative z-10">
          <div className="bg-blue-50 rounded-xl p-3 h-24 flex flex-col justify-end">
            <div className="w-full h-1 bg-blue-200 rounded-full mb-1"></div>
            <div className="w-[80%] h-1 bg-blue-200 rounded-full"></div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 h-24 flex flex-col justify-end">
            <div className="w-full h-1 bg-emerald-200 rounded-full mb-1"></div>
            <div className="w-[60%] h-1 bg-emerald-200 rounded-full"></div>
          </div>
        </div>

        {/* Chart Area Mockup */}
        <div className="flex items-end gap-3 h-32 mt-2 relative z-10">
          <div className="w-full bg-gradient-to-t from-blue-400 to-blue-300 rounded-t-lg h-[40%] group-hover:h-[60%] transition-all duration-700 ease-out"></div>
          <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg h-[70%] group-hover:h-[85%] transition-all duration-700 ease-out delay-75"></div>
          <div className="w-full bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-t-lg h-[50%] group-hover:h-[95%] transition-all duration-700 ease-out delay-150"></div>
          <div className="w-full bg-gradient-to-t from-blue-400 to-blue-300 rounded-t-lg h-[30%] group-hover:h-[45%] transition-all duration-700 ease-out delay-200"></div>
          <div className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg h-[80%] group-hover:h-[70%] transition-all duration-700 ease-out delay-300"></div>
          <div className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg h-[60%] group-hover:h-[80%] transition-all duration-700 ease-out delay-500"></div>
        </div>
      </div>
    </div>
  );
}
