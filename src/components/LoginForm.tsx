"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: handle login
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-md bg-white rounded-2xl shadow p-8 flex flex-col gap-6"
		>
			<div>
				<h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3A] mb-1">Login</h1>
				<p className="text-gray-500 text-sm mb-4">
					Masukkan Nama Pengguna Anda di bawah ini untuk masuk ke akun Anda
				</p>
			</div>
			{/* Username */}
			<div>
				<label htmlFor="username" className="block text-sm font-medium text-[#0B1F3A] mb-1">
					Username
				</label>
				<div className="relative">
					<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
						{/* Icon user */}
						<svg width="18" height="18" fill="none" viewBox="0 0 18 18">
							<circle cx="9" cy="6.5" r="3.5" stroke="#94a3b8" strokeWidth="1.5" />
							<path d="M3.5 14c0-2.21 2.24-4 5-4s5 1.79 5 4" stroke="#94a3b8" strokeWidth="1.5" />
						</svg>
					</span>
					<input
						id="username"
						name="username"
						type="text"
						autoComplete="username"
						required
						className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-900"
						placeholder="Nama Pengguna"
						value={username}
						onChange={e => setUsername(e.target.value)}
					/>
				</div>
			</div>
			{/* Password */}
			<div>
				<label htmlFor="password" className="block text-sm font-medium text-[#0B1F3A] mb-1">
					Password
				</label>
				<div className="relative">
					<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
						{/* Icon lock */}
						<svg width="18" height="18" fill="none" viewBox="0 0 18 18">
							<rect x="4" y="8" width="10" height="6" rx="2" stroke="#94a3b8" strokeWidth="1.5" />
							<path d="M6 8V6a3 3 0 1 1 6 0v2" stroke="#94a3b8" strokeWidth="1.5" />
						</svg>
					</span>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						className="pl-10 pr-3 py-2 w-full rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-700 text-gray-900"
						placeholder="Password"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
			</div>
			{/* Link Lupa Password */}
			<div className="flex justify-end">
				<Link href="/forgot-password" className="text-blue-700 text-sm font-semibold hover:underline">
					Lupa Password?
				</Link>
			</div>
			{/* Tombol Login */}
			<button
				type="submit"
				className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-colors text-base shadow"
			>
				Login
			</button>
			{/* Teks bawah */}
			<div className="text-center text-sm text-gray-500 mt-2">
				Ada masalah dengan login?{' '}
				<Link href="/contact-admin" className="text-blue-700 font-semibold hover:underline">
					Hubungi Admin
				</Link>
			</div>
		</form>
	);
}
