"use client";

export default function Tanggal({ label="Tanggal", name="tanggal", value, onChange, error, disabled = false}) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-500">{label}<span className="text-red-500 ml-0.5">*</span></label>
      <input
        type="date"
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange({ name, value: e.target.value })}
        className={`w-full border rounded px-4 py-2 mt-1 text-sm ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export function validateTanggal(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Gunakan format tanggal: dd/mm/yyyy.";
  return "";
}