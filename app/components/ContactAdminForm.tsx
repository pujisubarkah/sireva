"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContactAdminForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/contact-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (res.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setMessage("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow border border-gray-200 p-8">
      <h1 className="text-3xl font-bold text-center mb-2">Kontak Admin</h1>
      <p className="text-gray-500 text-center mb-6">
        Ada masalah atau membutuhkan bantuan? Kirim pesan kepada admin di bawah ini
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Nama Lengkap</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-gray-300 py-2 px-3 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
            placeholder="Nama Lengkap"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-gray-300 py-2 px-3 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Pesan</label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="w-full rounded-lg border border-gray-300 py-2 px-3 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none"
            placeholder="Tulis pesan Anda di sini..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>
        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Mengirim..." : "Kirim pesan"}
          </button>
          <button
            type="button"
            className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => router.push("/login")}
          >
            Batal
          </button>
        </div>
        {success && (
          <div className="text-green-600 text-center font-medium mt-2">Pesan berhasil dikirim!</div>
        )}
      </form>
    </div>
  );
}
