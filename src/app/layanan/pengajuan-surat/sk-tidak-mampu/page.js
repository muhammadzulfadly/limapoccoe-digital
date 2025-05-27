"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SKTidakMampu = () => {
  const [dataSurat, setDataSurat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pilihan, setPilihan] = useState("diri-sendiri");

  const router = useRouter();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "selesai":
        return "text-green-600 font-semibold";
      case "dikonfirmasi":
        return "text-blue-600 font-semibold";
      case "dibatalkan":
        return "text-red-600 font-semibold";
      case "pending":
        return "text-yellow-600 font-semibold";
      case "sedang proses":
        return "text-gray-600 font-semibold";
      default:
        return "text-black";
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSubmitModal = () => {
    router.push(`/layanan/pengajuan-surat/sk-tidak-mampu/form?untuk=${pilihan}`);
    handleCloseModal();
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Pembuatan Surat / SK Tidak Mampu</h1>

          <div className="bg-white p-4 rounded shadow">
            <button onClick={handleOpenModal} className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded flex items-center gap-2 mb-4">
              <FaPlus /> Buat Surat Baru
            </button>

            {dataSurat.length === 0 ? (
              <div className="text-center text-gray-500 py-10">Anda belum melakukan pengajuan surat!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-teal-700 text-white">
                    <tr>
                      <th className="px-4 py-2 border">Tanggal</th>
                      <th className="px-4 py-2 border">Nama</th>
                      <th className="px-4 py-2 border">NIK</th>
                      <th className="px-4 py-2 border">Status</th>
                      <th className="px-4 py-2 border">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSurat.map((item, index) => (
                      <tr key={index} className="text-center">
                        <td className="px-4 py-2 border">{item.tanggal}</td>
                        <td className="px-4 py-2 border">{item.nama}</td>
                        <td className="px-4 py-2 border">{item.nik}</td>
                        <td className={`px-4 py-2 border ${getStatusColor(item.status)}`}>{item.status}</td>
                        <td className="px-4 py-2 border">
                          <button className="text-gray-700 hover:text-black">
                            <FaSearch />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL PILIH PEMOHON */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white rounded-md p-6 w-[350px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-center">Buat Surat Untuk :</h2>

            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => setPilihan("diri-sendiri")}
                className={`w-full px-4 py-3 rounded border text-left flex items-center gap-3 transition-all duration-200 ${
                  pilihan === "diri-sendiri" ? "bg-teal-700 text-white border-teal-700" : "border-gray-300 text-black hover:bg-gray-100"
                }`}
              >
                <span className="text-black text-xl">{pilihan === "diri-sendiri" ? "●" : "○"}</span>
                Diri Sendiri
              </button>

              <button
                onClick={() => setPilihan("orang-lain")}
                className={`w-full px-4 py-3 rounded border text-left flex items-center gap-3 transition-all duration-200 ${
                  pilihan === "orang-lain" ? "bg-teal-700 text-white border-teal-700" : "border-gray-300 text-black hover:bg-gray-100"
                }`}
              >
                <span className="text-black text-xl">{pilihan === "orang-lain" ? "●" : "○"}</span>
                Orang Lain
              </button>
            </div>

            <div className="flex justify-between items-center">
              <button onClick={handleCloseModal} className="text-red-500 hover:underline text-sm">
                Batalkan
              </button>

              <button onClick={handleSubmitModal} className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded text-sm">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SKTidakMampu;
