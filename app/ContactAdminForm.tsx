"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactAdminForm() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [pesan, setPesan] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = `Nama: ${nama}%0D%0AEmail: ${email}%0D%0AMasalah: ${pesan}`;
    window.location.href = `mailto:muhamadilhamm48@gmail.com?subject=SI-REVA Support&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-2">Hubungi Admin</h1>
      <p className="text-sm text-gray-500 mb-6">Kirim pesan terkait kendala teknis atau akun SI-REVA Anda.</p>
      <div className="mb-4 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/></svg>
        </span>
        <input
          type="text"
          placeholder="Nama Lengkap"
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={nama}
          onChange={e => setNama(e.target.value)}
          required
        />
      </div>
      <div className="mb-4 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><rect x="4" y="8" width="10" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>
        </span>
        <input
          type="email"
          placeholder="Email Instansi"
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Deskripsi Masalah"
          className="w-full rounded-lg border border-gray-300 bg-gray-50 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={pesan}
          onChange={e => setPesan(e.target.value)}
          required
          rows={4}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-[#0B1F3A] text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-900 transition-colors">Kirim Pesan</button>
        <button type="button" className="flex-1 border border-blue-900 text-blue-900 font-semibold py-2 rounded-lg hover:bg-blue-50 transition-colors" onClick={() => router.push("/login")}>Batal</button>
      </div>
    </form>
  );
}
