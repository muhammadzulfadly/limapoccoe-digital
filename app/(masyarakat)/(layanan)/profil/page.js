"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

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

  const fetchNamaFromLocal = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setForm((prev) => ({
          ...prev,
          name: user?.user?.name || "",
          nik: user?.user?.nik || "",
        }));
      }
    } catch (err) {
      console.error("Gagal mengambil nama dari localStorage:", err);
    }
  };

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
      setForm({
        nik: data.user?.nik || "",
        name: data.user?.name || "",
        tempat_lahir: data.profile?.tempat_lahir || "",
        tanggal_lahir: data.profile?.tanggal_lahir || "",
        jenis_kelamin: data.profile?.jenis_kelamin || "",
        alamat: data.profile?.alamat || "",
        pekerjaan: data.profile?.pekerjaan || "",
        dusun: data.profile?.dusun || "",
        rt_rw: data.profile?.rt_rw || "",
      });

      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNamaFromLocal();
    fetchUser();
  }, []);

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

      localStorage.removeItem("user");
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
      // TODO: simpan ke API
    }
    setIsEditable(!isEditable);
  };

  return (
    <div className="min-h-screen bg-[#f1f4f9] px-4 py-10 md:px-20">
      <h1 className="text-xl font-bold text-black mb-4">Profil</h1>
      <div className="bg-white rounded-lg p-6 shadow relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2DB567] flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <p className="font-semibold text-black">{form.name}</p>
          </div>
          <button
            onClick={handleToggleEdit}
            className="bg-[#2DB567] hover:bg-[#239653] text-white text-sm font-medium px-4 py-1.5 rounded"
          >
            {isEditable ? "Simpan" : "Ubah Profil"}
          </button>
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
          <RTRW name="rt_rw" value={form.rt_rw} onChange={handleChange} disabled={!isEditable} label="RT/RW (opsional)" />
        </form>

        {!isEditable && (
          <div className="flex justify-end mt-8">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="bg-[#E74C3C] hover:bg-[#c0392b] text-white text-sm font-medium px-5 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}
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
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-1/2 border border-red-500 text-red-500 py-1.5 rounded hover:bg-red-50"
              >
                kembali
              </button>
              <button
                onClick={handleLogout}
                className="w-1/2 bg-red-500 text-white py-1.5 rounded hover:bg-red-600"
              >
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
            <h3 className="text-green-600 text-2xl font-bold mb-2">Berhasil Logout</h3>
            <p className="text-sm text-gray-800">Anda sudah berhasil logout.</p>
          </div>
        </div>
      )}
    </div>
  );
}
