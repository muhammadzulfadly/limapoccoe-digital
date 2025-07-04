"use client";

export default function InputField({ label, name, value, onChange, error, maxLength, type = "text", placeholder }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder || `Masukkan ${label}`}
        className={`w-full border ${error ? "border-red-500" : "border-gray-300"} rounded p-2 mt-1 text-sm`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}