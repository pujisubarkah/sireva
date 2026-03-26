import Image from "next/image";

export default function HeroImageCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-2 flex items-center justify-center w-full max-w-md mx-auto">
      <Image
        src="/images/hero-dashboard.png"
        alt="Dashboard SI-REVA"
        width={480}
        height={320}
        className="rounded-xl object-cover w-full h-auto"
        priority
      />
    </div>
  );
}
