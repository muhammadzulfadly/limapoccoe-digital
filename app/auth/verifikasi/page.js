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
        localStorage.setItem("token", result.access_token);
        localStorage.setItem("user", JSON.stringify(result.user));
        alert(result.message || "Verifikasi berhasil!");
        router.push("/auth/lengkapi-profil");
      } else {
        setError(result.message || "Verifikasi gagal. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal menghubungi server.");
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
        alert(result.message || "Kode OTP baru telah dikirim.");
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
      alert("Token registrasi tidak ditemukan. Silakan daftar ulang.");
      router.push("/auth/daftar-akun");
    } else {
      setRegistrationToken(token);
    }

    const storedNoWA = localStorage.getItem("no_whatsapp");
    if (storedNoWA) {
      setNoWhatsapp(storedNoWA);
    }
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
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">VERIFIKASI OTP</h2>
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

        <div className={`text-center mt-4 ${timeLeft > 0 ? "text-green-600" : "text-red-600"}`}>{timeLeft > 0 ? formatTime(timeLeft) : "Kode OTP kadaluarsa. Silakan daftar ulang."}</div>

        <p className="text-right text-sm mt-2">
          Tidak dapat kode OTP?{" "}
          <button type="button" onClick={handleResendOtp} disabled={loading || resendCooldown > 0} className="text-sm hover:underline text-black disabled:opacity-50">
            {resendCooldown > 0 ? `Kirim ulang (${resendCooldown})` : "Kirim ulang kode"}
          </button>
        </p>

        <div className="flex justify-center mt-6">
          <button type="submit" disabled={loading} className="bg-green-500 text-white px-6 py-2 rounded-md">
            {loading ? "Memverifikasi..." : "Verifikasi"}
          </button>
        </div>
      </form>
    </div>
  );
}
