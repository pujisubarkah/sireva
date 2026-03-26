"use client";
import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Link reset password telah dikirim (simulasi)");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-2">Reset Password</h1>
      <p className="text-sm text-gray-500 mb-6">Masukkan Email Instansi Anda. Link untuk mereset password akan dikirimkan.</p>
      <div className="mb-6">
        <input
          type="email"
          placeholder="Email Instansi (@lan.go.id)"
          className="w-full border-b-2 border-gray-300 bg-gray-50 py-2 px-2 text-sm focus:outline-none focus:border-blue-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="w-full bg-[#0B1F3A] text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-900 transition-colors mb-4">Kirim Link Reset</button>
      <div className="text-center text-sm">
        <Link href="/login" className="text-blue-700 hover:underline">Kembali ke Login</Link>
      </div>
    </form>
  );
}
