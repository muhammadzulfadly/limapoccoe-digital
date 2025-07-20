"use client";

import { ChevronDown } from "lucide-react";

const pilihanDusun = ["< Rp1 Juta", "Rp1-5 juta", "Rp5-10 juta", "Rp10-20 juta", "> Rp20 juta"];

export default function Dusun({ label = "Penghasilan per bulan", name = "penghasilan", value, onChange, error, disabled = false }) {
  return (
    <div className="relative">
      <label className="text-sm font-semibold text-gray-500">
        {label}
        <span className="text-red-500 ml-0.5">*</span>
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange({ name, value: e.target.value })}
          className={`mt-1 appearance-none w-full rounded-lg border bg-white px-4 py-2 text-sm outline-none ${error ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="">Pilih</option>
          {pilihanDusun.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 bottom-3 text-black pointer-events-none" size={16} />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validatePenghasilan(value) {
  if (!value) return "Penghasilan wajib dipilih.";
  return "";
}
