"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function KataSandi({ label="Kata Sandi", name="password", value, onChange, error, disabled = false }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label className="text-sm font-semibold text-gray-500">{label}<span className="text-red-500 ml-0.5">*</span></label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange({ name, value: e.target.value })}
          placeholder={`Masukkan ${label} Anda`}
          className={`w-full border ${error ? "border-red-500" : "border-gray-300"} rounded px-4 py-2 mt-1 text-sm pr-10`}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateKataSandi(value) {
  if (value.length < 12) {
    return "Kata sandi minimal 12 karakter.";
  }
  return "";
}
