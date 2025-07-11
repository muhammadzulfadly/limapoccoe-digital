"use client";

import { ChevronDown } from "lucide-react";

const ALL_OPTIONS = ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"];

export default function StatusPerkawinanSelect({
  label="Status Perkawinan",
  name="statusperkawinan",
  value,
  onChange,
  error,
  disabled = false,
  // kalau false, “Kawin” disembunyikan
  showKawin = true,
  // teks placeholder saat value === ""
  placeholder = "Pilih",
}) {
  // tentukan opsi sesuai flag
  const options = showKawin ? ALL_OPTIONS : ALL_OPTIONS.filter((o) => o !== "Kawin");

  return (
    <div className="relative">
      <label className="text-sm font-semibold text-gray-500">
        {label}<span className="text-red-500 ml-0.5">*</span>
      </label>

      <select
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange({ name, value: e.target.value })}
        className={`mt-1 appearance-none w-full rounded-lg border bg-white px-4 py-2 text-sm outline-none ${error ? "border-red-500" : "border-gray-300"}`}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <ChevronDown className="absolute right-3 bottom-3 text-black pointer-events-none" size={16} />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateStatusPerkawinan(value) {
  if (!value) return "Status Perkawinan wajib dipilih.";
  return "";
}
