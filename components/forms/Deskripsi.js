"use client";

export default function Deskripsi({ label="Deskripsi", name="description", value, onChange, error, disabled = false }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-500">
        {label} <span className="text-red-500">*</span>
      </label>
      <textarea
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange({ name, value: e.target.value })}
        placeholder={`Mohon jelaskan ${label} Anda.`}
        rows={5}
        className={`w-full border rounded px-4 py-2 mt-1 text-sm ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function validateDeskripsi(value) {
  if (!value || value.length < 1) {
    return "Form tidak boleh kosong.";
  }
  return "";
}