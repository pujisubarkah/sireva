"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// Simulasi loading
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setLoading(false);
		
		if (password === "12345678") {
			if (username.toLowerCase() === "admin" || username.toLowerCase() === "user") {
				router.push(`/${username.toLowerCase()}/dashboard`);
			} else {
				alert("Gunakan username 'admin' atau 'user'.");
			}
		} else {
			alert("Password salah. Silakan gunakan password '12345678'.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_0_rgba(31,38,135,0.08)] p-10 flex flex-col gap-6 border border-white/60 relative overflow-hidden"
		>
			<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-blue-400 to-emerald-400"></div>
			
			<div className="flex flex-col items-center mb-2 mt-4">
				<div className="relative mb-6 group">
					<div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-emerald-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
					<div className="relative bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-400 p-4 rounded-3xl shadow-xl transform group-hover:scale-105 transition duration-500">
						<svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
						</svg>
					</div>
				</div>
				<h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight text-center">
					Selamat Datang
				</h1>
				<p className="text-gray-500 text-sm text-center max-w-70 leading-relaxed">
					Masukkan kredensial Anda untuk mengakses dashboard SI-REVA.
				</p>
			</div>

			<div className="space-y-5">
				{/* Username */}
				<div className="space-y-1.5">
					<label htmlFor="username" className="block text-sm font-semibold text-gray-700 ml-1">
						Nama Pengguna
					</label>
					<div className="relative group">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
							<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</span>
						<input
							id="username"
							name="username"
							type="text"
							autoComplete="username"
							required
							className="block w-full pl-12 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-white"
							placeholder="Masukkan nama pengguna"
							value={username}
							onChange={e => setUsername(e.target.value)}
						/>
					</div>
				</div>

				{/* Password */}
				<div className="space-y-1.5">
					<div className="flex items-center justify-between ml-1">
						<label htmlFor="password" className="block text-sm font-semibold text-gray-700">
							Kata Sandi
						</label>
						<Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors">
							Lupa Sandi?
						</Link>
					</div>
					<div className="relative group">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
							<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</span>
						<input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							autoComplete="current-password"
							required
							className="block w-full pl-12 pr-12 py-3.5 bg-white/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-white"
							placeholder="Masukkan kata sandi"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
						<button
							type="button"
							className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
							tabIndex={-1}
							onClick={() => setShowPassword(v => !v)}
							aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
						>
							{showPassword ? (
								<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
							) : (
								<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Tombol Login */}
			<div className="mt-4">
				<button
					type="submit"
					disabled={loading}
					className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/30 transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
				>
					<div className="absolute inset-0 bg-white/20 group-hover:translate-x-full -translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></div>
					{loading ? (
						<svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
					) : (
						<span className="relative z-10">Masuk ke Sistem</span>
					)}
				</button>
			</div>

			{/* Teks bawah */}
			<div className="text-center text-sm text-gray-500 mt-2">
				Mengalami kendala saat login?{' '}
				<Link href="/contact-admin" className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
					Hubungi Admin
				</Link>
			</div>
		</form>
	);
}

