"use client";

export default function Pekerjaan({ value, onChange, error }) {
  return (
    <div>
      <label className="text-sm">Pekerjaan</label>
      <input
        name="pekerjaan"
        value={value}
        onChange={(e) => onChange({ name: "pekerjaan", value: e.target.value })}
        className={`w-full border rounded px-4 py-2 mt-1 ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

export function validatePekerjaan(value) {
  if (!/^[A-Za-z\s]+$/.test(value)) return "Pekerjaan hanya huruf dan spasi.";
  return "";
}
