"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationToken, setRegistrationToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("registration_token");
    if (!token) {
      alert("Token registrasi tidak ditemukan. Silakan daftar ulang.");
      router.push("/auth/register");
    } else {
      setRegistrationToken(token);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.trim().length === 0) {
      setError("Kode OTP wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.API_SECRET_URL}/api/v1/verify-otp`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration_token: registrationToken,
          code: otp,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Verifikasi berhasil!");

        // Simpan token user untuk sesi login, misal di localStorage
        localStorage.removeItem("registration_token");
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        router.push("/dashboard"); // ganti sesuai halaman utama setelah login
      } else {
        setError(result.message || "Verifikasi gagal. Coba lagi.");
      }
    } catch (err) {
      setError("Gagal menghubungi server..");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full border rounded-md p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Verifikasi OTP</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Masukkan Kode OTP</label>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Kode OTP" className="w-full border rounded-md p-2" maxLength={6} required />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className={`w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </button>
        </form>
      </div>
    </main>
  );
}
