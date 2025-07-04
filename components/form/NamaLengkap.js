"use client";
import InputField from "./InputField";

export default function NamaLengkap({ value, onChange, error }) {
  return (
    <InputField
      label="Nama Lengkap"
      name="name"
      value={value}
      onChange={(e) => onChange({ name: "name", value: e.target.value })}
      error={error}
    />
  );
}

export function validateNama(value) {
  if (!/^[a-zA-Z\s]{3,}$/.test(value)) {
    return "Nama harus terdiri dari minimal 3 huruf dan hanya huruf/spasi.";
  }
  return "";
}