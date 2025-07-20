"use client";

export default function RtRw({ label="RT/RW (tidak wajib diisi)", name="rt_rw", value, onChange, error, disabled = false}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-500">{label}</label>
      <input
        name={name}
        value={value}
        placeholder="Contoh: 001/002"
        disabled={disabled}
        onChange={(e) => onChange({ name, value: e.target.value })}
        className={`w-full border rounded px-4 py-2 mt-1 text-sm ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export function validateRTRW(value) {
  if (value && !/^\d{3}\/\d{3}$/.test(value)) return "Format RT/RW tidak valid. Contoh: 005/003.";
  return "";
}
