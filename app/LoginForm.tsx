"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (username === "admin" && password === "000000") {
      router.push("/admin/dashboard");
    } else if (username === "user" && password === "000000") {
      router.push("/user/dashboard");
    } else {
      alert("Username atau password salah");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      <h1 className="text-2xl font-bold text-blue-900 mb-2">Login SI-REVA</h1>
      <p className="text-sm text-gray-500 mb-6">Masukkan kredensial akun Anda untuk masuk.</p>
      <div className="mb-4 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Username"
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-4 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
            <rect x="4" y="8" width="10" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
        <input
          type="password"
          placeholder="Password"
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className="w-full bg-[#0B1F3A] text-white font-semibold py-2 rounded-lg shadow hover:bg-blue-900 transition-colors mb-4">Login</button>
      <div className="flex justify-between text-sm">
        <Link href="/lupa-password" className="text-blue-700 hover:underline">Lupa Password?</Link>
        <Link href="/hubungi-admin" className="text-blue-700 hover:underline">Hubungi Admin</Link>
      </div>
    </form>
  );
}
