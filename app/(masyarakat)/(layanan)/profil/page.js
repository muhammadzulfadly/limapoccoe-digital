"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, ChevronLeft, LogOut } from "lucide-react";

import NIK from "@/components/forms/NIK";
import Huruf from "@/components/forms/Huruf";
import Tanggal from "@/components/forms/Tanggal";
import RTRW from "@/components/forms/RTRW";
import Dusun from "@/components/forms/Dusun";
import AngkaHuruf from "@/components/forms/AngkaHuruf";
import JenisKelamin from "@/components/forms/JenisKelamin";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditable, setIsEditable] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSuccessLogout, setShowSuccessLogout] = useState(false);
  const [showSuccessEdit, setShowSuccessEdit] = useState(false);

  const [form, setForm] = useState({
    nik: "",
    name: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    alamat: "",
    pekerjaan: "",
    dusun: "",
    rt_rw: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Gagal mengambil data user");

      const data = await res.json();
      const user = data.user || {};
      const profile = data.profile || {};

      setForm({
        nik: user.nik || "",
        name: user.name || "",
        tempat_lahir: profile.tempat_lahir || "",
        tanggal_lahir: profile.tanggal_lahir || "",
        jenis_kelamin: profile.jenis_kelamin || "",
        alamat: profile.alamat || "",
        pekerjaan: profile.pekerjaan || "",
        dusun: profile.dusun || "",
        rt_rw: profile.rt_rw || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Logout gagal.");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("expiresAt");
      window.dispatchEvent(new Event("storage"));

      setShowLogoutConfirm(false);
      setShowSuccessLogout(true);
      setTimeout(() => {
        router.push("/beranda");
      }, 1800);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleToggleEdit = () => {
    if (isEditable) {
      setShowSuccessEdit(true);
      setTimeout(() => {
        setShowSuccessEdit(false);
      }, 1800);
    }
    setIsEditable(!isEditable);
  };

  return (
    <div className="min-h-full p-8">
      <h2 className="sm:text-2xl text-base font-semibold mb-4">Profil</h2>
      <div className="bg-white rounded-lg p-6 shadow relative">
        <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
          <ChevronLeft size={30} className="mr-1" />
          Kembali
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          {/* Icon + Nama */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-full bg-[#2DB567] flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <p className="font-semibold text-black">{form.name}</p>
          </div>

          {/* Tombol Aksi */}
          <div className={`w-full sm:flex sm:items-center sm:gap-4 sm:w-auto grid gap-2 ${isEditable ? "grid-cols-1 justify-center" : "grid-cols-2"}`}>
            <button onClick={handleToggleEdit} className="bg-[#2DB567] hover:bg-[#239653] text-white text-sm font-medium px-4 py-1.5 rounded w-full sm:w-auto whitespace-nowrap">
              {isEditable ? "Simpan" : "Ubah Profil"}
            </button>

            {!isEditable && (
              <button onClick={() => setShowLogoutConfirm(true)} className="bg-[#E74C3C] hover:bg-[#c0392b] text-white text-sm font-medium px-4 py-1.5 rounded flex items-center justify-center gap-2 w-full">
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
          <NIK name="nik" value={form.nik} onChange={handleChange} error={""} disabled={true} label="NIK" />
          <Huruf name="name" value={form.name} onChange={handleChange} error={""} disabled={true} label="Nama Lengkap" />
          <Huruf name="tempat_lahir" value={form.tempat_lahir} onChange={handleChange} disabled={!isEditable} label="Tempat lahir" />
          <Tanggal name="tanggal_lahir" value={form.tanggal_lahir} onChange={handleChange} disabled={!isEditable} label="Tanggal Lahir" />
          <JenisKelamin name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} disabled={!isEditable} label="Jenis Kelamin" />
          <AngkaHuruf name="alamat" value={form.alamat} onChange={handleChange} disabled={!isEditable} label="Alamat" />
          <Huruf name="pekerjaan" value={form.pekerjaan} onChange={handleChange} disabled={!isEditable} label="Pekerjaan" />
          <Dusun name="dusun" value={form.dusun} onChange={handleChange} disabled={!isEditable} label="Dusun" />
          <RTRW name="rt_rw" value={form.rt_rw} onChange={handleChange} disabled={!isEditable} />
        </form>
      </div>

      {/* Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-8 w-[300px] text-center space-y-4">
            <div className="w-12 h-12 mx-auto flex items-center justify-center border-2 border-red-500 rounded-full">
              <span className="text-red-500 text-2xl font-bold">i</span>
            </div>
            <h3 className="text-xl font-bold text-black">Logout akun</h3>
            <p className="text-gray-700 text-sm">Apakah anda yakin ingin logout?</p>
            <div className="flex justify-between gap-4 mt-4">
              <button onClick={() => setShowLogoutConfirm(false)} className="w-1/2 border border-red-500 text-red-500 py-1.5 rounded hover:bg-red-50">
                kembali
              </button>
              <button onClick={handleLogout} className="w-1/2 bg-red-500 text-white py-1.5 rounded hover:bg-red-600">
                Ya logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up berhasil logout */}
      {showSuccessLogout && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[280px] text-center animate-fade-in">
            <h3 className="text-[#27AE60] text-2xl font-bold mb-2">Berhasil Logout</h3>
            <p className="text-sm text-gray-800">Anda sudah berhasil logout.</p>
          </div>
        </div>
      )}

      {/* Pop-up berhasil ubah data */}
      {showSuccessEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg px-6 py-9 w-[280px] text-center animate-fade-in">
            <h3 className="text-[#27AE60] text-2xl font-bold mb-2">Berhasil!</h3>
            <p className="text-sm text-gray-800">Anda telah berhasil merubah profil.</p>
          </div>
        </div>
      )}
    </div>
  );
}
