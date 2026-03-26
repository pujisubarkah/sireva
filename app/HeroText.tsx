import BadgeRilis from "./BadgeRilis";
import PrimaryButton from "./PrimaryButton";

export default function HeroText() {
  return (
    <div className="flex flex-col gap-6 items-start">
      {/* Badge */}
      <BadgeRilis />
      {/* Heading besar 4 baris */}
      <h1 className="font-bold text-4xl sm:text-5xl md:text-6xl leading-tight">
        <span className="block text-[#0B1F3A]">Sistem</span>
        <span className="block text-[#0B1F3A]">Informasi</span>
        <span className="block text-blue-700">Perencanaan &</span>
        <span className="block text-blue-700">Evaluasi</span>
      </h1>
      {/* Paragraf deskripsi */}
      <p className="text-gray-600 max-w-xl leading-relaxed text-base md:text-lg">
        Portal terintegrasi untuk mendukung proses perencanaan, pelaksanaan, dan evaluasi program secara efektif, transparan, dan akuntabel di lingkungan pemerintahan.
      </p>
      {/* Tombol CTA */}
      <PrimaryButton label="Masuk ke Sistem" />
    </div>
  );
}
