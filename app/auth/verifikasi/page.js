"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 menit
  const [registrationToken, setRegistrationToken] = useState(null);
  const [noWhatsapp, setNoWhatsapp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const blurNumber = (num) => {
    return num.replace(/^(\d{3})\d+(?=\d{3})/, "$1xxxxxxx");
  };

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = value.charAt(0) || "";
    setOtp(newOtp);
    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (!/^\d{6}$/.test(code)) {
      setError("Kode OTP harus terdiri dari 6 angka.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration_token: registrationToken,
          otp_code: code,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.removeItem("registration_token");
        localStorage.removeItem("no_whatsapp");
        const expiresAt = Date.now() + 60 * 60 * 1000; // 1 jam dari sekarang
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("expiresAt", expiresAt.toString());
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/auth/lengkapi-profil");
        }, 1800);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();

    if (resendCooldown > 0) {
      setError(`Silakan tunggu ${resendCooldown} detik sebelum mengirim ulang.`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registration_token: registrationToken,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setOtp(new Array(6).fill(""));
        setTimeLeft(300); // reset waktu OTP jika diperlukan
        setResendCooldown(60); // 🔒 mulai cooldown 60 detik
      } else {
        setError(result.message || "Gagal mengirim ulang kode.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setError("Terjadi kesalahan saat mengirim ulang OTP.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    const token = localStorage.getItem("registration_token");
    if (!token) {
      setError(true);
    } else {
      setRegistrationToken(token);
    }
    const storedNoWA = localStorage.getItem("no_whatsapp");
    if (storedNoWA) setNoWhatsapp(storedNoWA);
  }, [router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`w-12 h-14 text-center text-2xl border rounded-md focus:outline-none ${error ? "border-red-500 text-red-500" : "border-gray-400"}`}
            />
          ))}
        </div>

        <div className={`text-center mt-4 ${timeLeft > 0 ? "text-green-600" : "text-red-600"}`}>{timeLeft > 0 ? formatTime(timeLeft) : "Kode OTP kadaluarsa"}</div>

        <p className="text-right text-sm mt-2">
          Tidak dapat kode OTP?{" "}
          <button type="button" onClick={handleResendOtp} disabled={loading || resendCooldown > 0} className="text-sm hover:underline text-[#27AE60] disabled:opacity-50">
            {resendCooldown > 0 ? `Kirim ulang (${resendCooldown})` : "Kirim ulang kode"}
          </button>
        </p>

        <div className="flex justify-center mt-6">
          <button type="submit" disabled={loading} className="bg-[#27AE60] px-20 text-white py-2 rounded-md">
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[290px] text-center animate-fade-in">
            <h3 className="text-[#27AE60] text-2xl font-bold mb-3">Berhasil!</h3>
            <p className="text-sm text-[#141414] leading-relaxed">Kode OTP berhasil diverifikasi. Silakan lengkapi informasi profil Anda untuk melanjutkan proses.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-12 w-[260px] text-center animate-fade-in">
            <h3 className="text-[#E74C3C] text-2xl font-bold mb-6 leading-snug">Verifikasi Gagal!</h3>
            <p className="text-sm text-[#141414] leading-relaxed mb-6">Tidak ditemukan kode OTP untuk nomor Anda. Silakan lakukan pendaftaran ulang.</p>
            <button onClick={() => router.push("/auth/daftar")} className="bg-[#E74C3C] text-white text-sm py-2 px-6 rounded-md hover:bg-red-600">
              Daftar Ulang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
