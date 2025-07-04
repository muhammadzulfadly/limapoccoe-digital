"use client";

export default function RtRw({ value, onChange, error }) {
  return (
    <div>
      <label className="text-sm">RT/RW (opsional)</label>
      <input
        name="rt_rw"
        value={value}
        onChange={(e) => onChange({ name: "rt_rw", value: e.target.value })}
        className={`w-full border rounded px-4 py-2 mt-1 ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export function validateRtRw(value) {
  if (value && !/^\d{3}\/\d{3}$/.test(value)) return "Format RT/RW tidak valid. Contoh: 005/003.";
  return "";
}
