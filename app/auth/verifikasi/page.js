"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const OTP_EXPIRES_KEY = "otp_expires_at"; // kunci penyimpanan waktu kadaluarsa

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [inlineError, setInlineError] = useState(""); // error di bawah input
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // detik, dihitung dari expiresAt
  const [registrationToken, setRegistrationToken] = useState(null);
  const [noWhatsapp, setNoWhatsapp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Popup hanya dipakai untuk: token tak ada ATAU waktu habis
  const [showPopup, setShowPopup] = useState(false);

  const blurNumber = (num) => {
    return num.replace(/^(\d{3})\d+(?=\d{3})/, "$1xxxxxxx");
  };

  // Ambil / set expiry awal: 5 menit dari waktu pertama kali halaman ini dibuka
  const ensureExpiry = () => {
    const saved = localStorage.getItem(OTP_EXPIRES_KEY);
    if (saved && !Number.isNaN(Number(saved))) {
      return Number(saved);
    }
    const newExpires = Date.now() + 5 * 60 * 1000; // 5 menit
    localStorage.setItem(OTP_EXPIRES_KEY, String(newExpires));
    return newExpires;
  };

  // hitung mundur berdasarkan expiresAt di localStorage
  useEffect(() => {
    const expiresAt = ensureExpiry();

    const tick = () => {
      const now = Date.now();
      const remain = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeLeft(remain);

      // Jika sudah habis, pastikan popup tampil
      if (remain <= 0) {
        setShowPopup(true);
      }
    };

    tick(); // hitung awal
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // init token & nomor WA; jika token tidak ada -> popup langsung
  useEffect(() => {
    const token = localStorage.getItem("registration_token");
    if (!token) {
      setShowPopup(true);
    } else {
      setRegistrationToken(token);
    }
    const storedNoWA = localStorage.getItem("no_whatsapp");
    if (storedNoWA) setNoWhatsapp(storedNoWA);
  }, [router]);

  // cooldown resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = value.charAt(0) || "";
    setOtp(newOtp);
    setInlineError(""); // bersihkan error saat mengetik
    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      if (e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    // Jika sudah kadaluarsa, paksa popup
    if (timeLeft <= 0) {
      setShowPopup(true);
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setInlineError("Kode OTP harus terdiri dari 6 angka.");
      return;
    }

    if (!registrationToken) {
      // token tak ada -> popup
      setShowPopup(true);
      return;
    }

    setLoading(true);
    setInlineError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_token: registrationToken,
          otp_code: code,
        }),
      });

      let result = {};
      try {
        result = await res.json();
      } catch (_) {}

      if (res.ok) {
        // bersih-bersih & lanjut
        localStorage.removeItem("registration_token");
        localStorage.removeItem("no_whatsapp");
        localStorage.removeItem(OTP_EXPIRES_KEY); // opsional: bersihkan expiry saat sudah sukses
        const expiresAt = Date.now() + 60 * 60 * 1000; // 1 jam dari sekarang
        localStorage.setItem("token", result && result.access_token);
        localStorage.setItem("user", JSON.stringify((result && result.user) || {}));
        localStorage.setItem("expiresAt", String(expiresAt));
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/auth/lengkapi-profil");
        }, 1800);
      } else {
        // waktu belum habis → tampilkan error di bawah input, bukan popup
        setInlineError(
          (result && result.message) ||
            "Kode OTP yang Anda masukkan salah. Silakan periksa kembali."
        );
      }
    } catch (_) {
      setInlineError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();

    if (resendCooldown > 0) {
      setInlineError(`Silakan tunggu ${resendCooldown} detik sebelum mengirim ulang.`);
      return;
    }

    if (!registrationToken) {
      setShowPopup(true); // token hilang → popup
      return;
    }

    setLoading(true);
    setInlineError("");

    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_token: registrationToken }),
      });

      let result = {};
      try {
        result = await res.json();
      } catch (_) {}

      if (res.ok) {
        // **Tidak** mereset waktu 5 menit, hanya cooldown & bersihkan input
        setOtp(new Array(6).fill(""));
        setResendCooldown(60);
      } else {
        setInlineError((result && result.message) || "Gagal mengirim ulang kode.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setInlineError("Terjadi kesalahan saat mengirim ulang OTP.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="w-full max-w-md">
      <button onClick={() => router.back()} className="absolute top-6 left-6 text-2xl">
        ←
      </button>
      <img src="/logo.png" alt="Logo Desa" className="block mx-auto w-20 h-20 mb-4 md:hidden" />
      <h2 className="text-4xl font-bold mb-6 text-center text-[#27AE60]">VERIFIKASI OTP</h2>
      <p className="text-center text-gray-600 mb-2">
        Masukkan kode OTP yang dikirim ke nomor <br />
        <span className="font-bold">{noWhatsapp ? blurNumber(noWhatsapp) : "Anda"}</span>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center gap-2 mt-6 mb-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`w-12 h-14 text-center text-2xl border rounded-md focus:outline-none ${
                inlineError ? "border-red-500 text-red-500" : "border-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Error inline di bawah kolom angka */}
        {inlineError && (
          <div className="text-red-600 text-sm mt-1 text-center">{inlineError}</div>
        )}

        <div className={`text-center mt-4 ${timeLeft > 0 ? "text-[#27AE60]" : "text-red-600"}`}>
          {timeLeft > 0 ? formatTime(timeLeft) : "Kode OTP kadaluarsa"}
        </div>

        <p className="text-right text-sm mt-2">
          Tidak dapat kode OTP?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loading || resendCooldown > 0}
            className="text-sm hover:underline text-[#27AE60] disabled:opacity-50"
          >
            {resendCooldown > 0 ? `Kirim ulang (${resendCooldown})` : "Kirim ulang kode"}
          </button>
        </p>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#27AE60] px-20 text-white py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </button>
        </div>
      </form>

      {/* Sukses */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[290px] text-center animate-fade-in">
            <h3 className="text-[#27AE60] text-2xl font-bold mb-3">Berhasil!</h3>
            <p className="text-sm text-[#141414] leading-relaxed">
              Kode OTP berhasil diverifikasi. Silakan lengkapi informasi profil Anda untuk
              melanjutkan proses.
            </p>
          </div>
        </div>
      )}

      {/* Popup error (hanya teks tetap + tombol) untuk: habis waktu ATAU token hilang */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-12 w-[300px] text-center animate-fade-in">
            <h3 className="text-[#E74C3C] text-2xl font-bold mb-6 leading-snug">
              Verifikasi Gagal!
            </h3>
            <p className="text-sm text-[#141414] leading-relaxed mb-6">
              Tidak ditemukan kode OTP untuk nomor Anda. Silakan lakukan pendaftaran ulang.
            </p>
            <button
              onClick={() => {
                // bersihkan state penting sebelum daftar ulang
                localStorage.removeItem("registration_token");
                localStorage.removeItem("no_whatsapp");
                localStorage.removeItem(OTP_EXPIRES_KEY);
                router.push("/auth/daftar");
              }}
              className="bg-[#E74C3C] text-white text-sm py-2 px-6 rounded-md hover:bg-red-600"
            >
              Daftar Ulang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
