"use client";
import InputField from "./InputField";

export default function Nik({ label="NIK", name="nik", value, onChange, error, disabled = false}) {
  return (
    <InputField
      label={label}
      name={name}
      value={value}
      maxLength={16}
      onChange={(e) => onChange({ name, value: e.target.value.replace(/\D/g, "") })}
      error={error}
      disabled={disabled}
    />
  );
}

export function validateNik(value) {
  if (!/^\d{16}$/.test(value)) {
    return "NIK harus terdiri dari 16 digit angka.";
  }
  return "";
}