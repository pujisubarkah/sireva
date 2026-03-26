import Link from "next/link";

export default function AuthBackLink() {
  return (
    <div className="mb-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[#0B1F3A] text-sm font-medium hover:text-[#14386b] transition-colors"
      >
        {/* Icon panah kiri */}
        <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
          <path d="M11.5 4.5L7 9l4.5 4.5" stroke="#0B1F3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Kembali ke Beranda
      </Link>
    </div>
  );
}
