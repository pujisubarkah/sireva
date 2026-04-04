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
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight mb-2">Login SI-REVA</h1>
        <p className="text-sm text-gray-500 font-medium">Masuk untuk mengelola kinerja Anda.</p>
      </div>
      
      <div className="space-y-5">
        <div className="relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-900 transition-colors">
            <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
          <input
              type="text"
              placeholder="Username"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 transition-all"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
        </div>

        <div className="relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-900 transition-colors">
            <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
              <rect x="4" y="6" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M6 6V4a3 3 0 1 1 6 0v2" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
          <input
              type="password"
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
        </div>
      </div>

      <button type="submit" className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-8 mb-6">
        Masuk
      </button>

      <div className="flex justify-between items-center text-sm font-medium">
        <Link href="/lupa-password" className="text-gray-500 hover:text-blue-900 transition-colors">Lupa Password?</Link>
        <Link href="/hubungi-admin" className="text-blue-700 hover:text-blue-900 hover:underline transition-colors">Hubungi Admin</Link>
      </div>
    </form>
  );
}
