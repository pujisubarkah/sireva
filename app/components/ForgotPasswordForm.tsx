"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [input, setInput] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle forgot password
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto bg-white rounded-2xl shadow p-8 flex flex-col gap-6 border border-gray-200"
    >
      <h1 className="text-3xl font-bold text-center mb-2">Reset Password</h1>
      <p className="text-gray-500 text-center mb-6">
        Masukkan Email atau Username Anda untuk mendapatkan email link reset password
      </p>
      <div>
        <label htmlFor="emailOrUsername" className="block text-sm font-medium mb-1">
          Email/Username
        </label>
        <input
          id="emailOrUsername"
          name="emailOrUsername"
          type="text"
          required
          className="w-full border-b border-gray-300 focus:border-blue-800 outline-none py-2 px-0 bg-transparent placeholder-gray-400 text-gray-900"
          placeholder="Email/Username"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 rounded-lg transition-colors"
      >
        Kirim Link Reset
      </button>
      <div className="text-center mt-4">
        <Link href="/login" className="text-blue-800 text-sm font-medium hover:underline">
          Kembali ke Login
        </Link>
      </div>
    </form>
  );
}
