"use client";

export default function Pekerjaan({ label="No. BPJS (opsional)", name="bpjs", value, onChange, error, disabled = false }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-500">{label}</label>
      <input
        name={name}
        value={value}
        placeholder={`Masukkan ${label}`}
        disabled={disabled}
        maxLength={13}
        onChange={(e) => onChange({ name, value: e.target.value.replace(/\D/g, "") })}
        className={`w-full border rounded px-4 py-2 mt-1 text-sm ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export function validatePekerjaan(value) {
  if (!/^\d{13}$/.test(value)) {
    return "BPJS harus terdiri dari 13 digit angka.";
  }
  return "";
}
