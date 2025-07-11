"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, UploadCloud } from "lucide-react";

import NamaLengkap, { validateNama } from "@/components/form/NamaLengkap";
import JudulPengaduan, { validateJudul } from "@/components/form/JudulPengaduan";
import LokasiKejadian, { validateLokasi } from "@/components/form/LokasiKejadian";
import KategoriPengaduan, { validateKategori } from "@/components/form/KategoriPengaduan";
import DeskripsiPengaduan, { validateDeskripsi } from "@/components/form/DeskripsiPengaduan";

export default function BuatPengaduanPage() {
  const router = useRouter();

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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setForm((prev) => ({ ...prev, name: user?.name || "" }));
    }
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
      name: validateNama(form.name),
      title: validateJudul(form.title),
      location: validateLokasi(form.location),
      category: validateKategori(form.category),
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
    <div className="flex h-full">
      <div className="flex-1 p-8 space-y-8 bg-[#EDF0F5]">
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

        <h2 className="text-2xl font-semibold mb-4">
          Pengaduan / <span className="font-semibold">Buat pengaduan</span>
        </h2>

        <div className="bg-white rounded-lg p-6 max-w-6xl mx-auto">
          <button type="button" onClick={() => router.back()} className="flex items-center text-base text-gray-500 mb-6">
            <ChevronLeft size={30} className="mr-1" /> Kembali
          </button>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NamaLengkap value={form.name} onChange={handleChange} error={errors.name} disabled={true} />
            <KategoriPengaduan value={form.category} onChange={handleChange} error={errors.category} />
            <JudulPengaduan value={form.title} onChange={handleChange} error={errors.title} />
            <LokasiKejadian value={form.location} onChange={handleChange} error={errors.location} />
            <DeskripsiPengaduan value={form.description} onChange={handleChange} error={errors.description} />

            <div className="col-span-1">
              <label className="text-sm font-semibold text-gray-500">Upload Foto (opsional)</label>
              <label
                htmlFor="file"
                className="min-h-[100px] mt-1 flex flex-col justify-center items-center text-center cursor-pointer
              border-dashed border-green-300 bg-green-50 w-full border rounded px-4 py-5 text-sm hover:bg-green-100"
              >
                <UploadCloud size={30} className="mb-2 text-green-500" />
                <span className="text-green-600 font-semibold">Upload Foto</span>
                <p className="text-xs text-gray-500 mt-1">Format yang didukung: JPG, JPEG, PNG. Maks 2MB</p>
                {form.file && <p className="mt-2 text-sm text-gray-600">File: {form.file.name}</p>}
                {errors.file && <p className="text-sm text-red-500 mt-1">{errors.file}</p>}
              </label>
              <input type="file" id="file" name="file" onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white text-sm px-6 py-2 rounded">
                {loading ? "Mengirim..." : "Kirim"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
