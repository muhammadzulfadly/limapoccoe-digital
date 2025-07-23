"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, UploadCloud } from "lucide-react";

import Huruf, { validateHuruf } from "@/components/forms/Huruf";
import AngkaHuruf, { validateAngkaHuruf } from "@/components/forms/AngkaHuruf";
import KategoriPengaduan, { validateKategoriPengaduan } from "@/components/forms/KategoriPengaduan";
import Deskripsi, { validateDeskripsi } from "@/components/forms/Deskripsi";

export default function BuatPengaduanPage() {
  const router = useRouter();
  const [tooManyRequestsMessage, setTooManyRequestsMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    title: "",
    location: "",
    category: "",
    description: "",
    file: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchProfileName = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Gagal memuat profil");

        const data = await res.json();
        const nameFromProfile = data.user?.name || "";
        setForm((prev) => ({ ...prev, name: nameFromProfile }));
      } catch (err) {
        console.error("Gagal mengambil nama dari profil:", err);
      }
    };

    fetchProfileName();
  }, []);

  const handleChange = ({ name, value }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, file: "Format harus JPG, JPEG, atau PNG." }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: "Ukuran maksimal 2MB." }));
      return;
    }

    setForm((prev) => ({ ...prev, file }));
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const validate = () => {
    const newErrors = {
      name: validateHuruf(form.name),
      title: validateHuruf(form.title),
      location: validateAngkaHuruf(form.location),
      category: validateKategoriPengaduan(form.category),
      description: validateDeskripsi(form.description),
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => !err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.description);
      formData.append("location", form.location);
      formData.append("category", form.category);
      if (form.file) formData.append("evidence", form.file);

      const res = await fetch("/api/complaint/buat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setShowSuccessModal(true);
        setTimeout(() => {
          router.push("/pengaduan");
        }, 1800);
      } else if (res.status === 429) {
        setTooManyRequestsMessage(result.error || "Terlalu banyak permintaan. Silakan coba lagi nanti.");
      } else {
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error(err);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full p-8">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center max-w-sm shadow-lg">
            <h2 className="text-[#27AE60] text-lg font-bold mb-2">Pengaduan Terkirim!</h2>
            <p className="text-sm">
              Laporan Anda berhasil dikirim dan sedang dalam proses penanganan oleh Staff Desa. <br />
              Info status akan dikirim lewat WhatsApp.
            </p>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center w-full max-w-sm min-h-[200px] shadow-lg">
            <h2 className="text-[#E74C3C] text-2xl font-bold mb-2">Pengaduan Gagal!</h2>
            <p className="text-sm text-gray-700 mb-4">Maaf, pengaduan Anda tidak berhasil diproses. Silakan coba lagi nanti atau periksa koneksi Anda.</p>
            <button className="bg-[#E74C3C] text-white px-4 py-2 text-sm rounded hover:bg-red-600" onClick={() => setShowErrorModal(false)}>
              Kembali
            </button>
          </div>
        </div>
      )}

      <h2 className="sm:text-2xl text-base font-semibold mb-4">Pengaduan / Buat pengaduan</h2>

      <div className="bg-white rounded-lg p-6 mx-auto">
        <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
          <ChevronLeft size={30} className="mr-1" /> Kembali
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Huruf name="name" value={form.name} onChange={handleChange} error={errors.name} disabled={true} label="Nama Lengkap" />
          <KategoriPengaduan name="category" value={form.category} onChange={handleChange} error={errors.category} />
          <Huruf name="title" value={form.title} onChange={handleChange} error={errors.title} label="Judul Pengaduan" />
          <AngkaHuruf name="location" value={form.location} onChange={handleChange} error={errors.location} label="Lokasi Pengaduan" />
          <Deskripsi name="description" value={form.description} onChange={handleChange} error={errors.description} label="Deskripsi Pengaduan" />

          <div className="col-span-1">
            <label className="text-sm font-semibold text-gray-500">Upload Foto (tidak wajib)</label>
            <label
              htmlFor="file"
              className="min-h-[100px] mt-1 flex flex-col justify-center items-center text-center cursor-pointer
              border-dashed border-[#384EB7-30] bg-[#F0FFF6] w-full border rounded px-4 py-5 text-sm hover:bg-green-100"
            >
              <UploadCloud size={30} className="mb-2 text-[#27AE60]" />
              <span className="text-[#27AE60] font-semibold">Upload Foto</span>
              <p className="text-xs text-gray-500 mt-1">Format yang didukung: JPG, JPEG, PNG. Maks 2MB</p>
              {form.file && <p className="mt-2 text-sm text-gray-600">File: {form.file.name}</p>}
              {errors.file && <p className="text-sm text-red-500 mt-1">{errors.file}</p>}
            </label>
            <input type="file" id="file" name="file" onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button type="submit" disabled={loading} className="bg-[#27AE60] hover:bg-green-600 text-white text-sm px-6 py-2 rounded">
              {loading ? "Mengirim..." : "Kirim"}
            </button>
          </div>
        </form>
      </div>

      {tooManyRequestsMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center w-full max-w-sm min-h-[200px] shadow-lg">
            <h2 className="text-yellow-600 text-2xl font-bold mb-2">Terlalu Banyak Permintaan!</h2>
            <p className="text-sm text-gray-700 mb-4">{tooManyRequestsMessage}</p>
            <button className="bg-yellow-500 text-white px-4 py-2 text-sm rounded hover:bg-yellow-600" onClick={() => setTooManyRequestsMessage("")}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
