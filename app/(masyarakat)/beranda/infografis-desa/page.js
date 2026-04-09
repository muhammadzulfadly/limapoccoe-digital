"use client";

import Image from "next/image";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import FloatingButtons from "@/components/FloatingButtons";
import { useEffect, useState } from "react";

// ✅ Custom Tick untuk XAxis
const CustomXAxisTick = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        transform="rotate(-35)"
        style={{
          fontSize: "12px",
          fill: "#333",
          maxWidth: "60px",
        }}
      >
        {payload.value.length > 12 ? payload.value.substring(0, 12) + "…" : payload.value}
      </text>
    </g>
  );
};

export const metadata = {
  title: "Infografis Desa | LimapoccoeDigital",
  description: "Website Resmi Desa Limapoccoe",
};

export default function InfografisPage() {
  const [dataPenduduk, setDataPenduduk] = useState([
    { label: "TOTAL PENDUDUK", value: "...", icon: "/images/penduduk/total.png" },
    { label: "KEPALA KELUARGA", value: "...", icon: "/images/penduduk/kepala-keluarga.png" },
    { label: "PEREMPUAN", value: "...", icon: "/images/penduduk/perempuan.png" },
    { label: "LAKI-LAKI", value: "...", icon: "/images/penduduk/laki-laki.png" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [resPenduduk, resKeluarga, resKelamin, resPerkawinan, resAgama, resDusun, resPendidikan] = await Promise.all([
          fetch("/api/population/jumlah-penduduk", {
            headers: { Authorization: token },
          }),
          fetch("/api/population/jumlah-keluarga", {
            headers: { Authorization: token },
          }),
          fetch("/api/population/jenis-kelamin", {
            headers: { Authorization: token },
          }),
          fetch("/api/population/perkawinan", {
            headers: { Authorization: token },
          }),
          fetch("/api/population/agama", {
            headers: { Authorization: token },
          }),
          fetch("/api/population/dusun", {
            headers: { Authorization: token },
          }),
          fetch("/api/population/pendidikan", {
            headers: { Authorization: token },
          }),
        ]);

        const penduduk = await resPenduduk.json();
        const keluarga = await resKeluarga.json();
        const kelamin = await resKelamin.json();
        const perkawinan = await resPerkawinan.json();
        const agama = await resAgama.json();
        const dusun = await resDusun.json();
        const pendidikan = await resPendidikan.json();

        const jumlahL = kelamin.find((item) => item.jenis_kelamin === "Laki-laki")?.total || "...";
        const jumlahP = kelamin.find((item) => item.jenis_kelamin === "Perempuan")?.total || "...";

        setDataPenduduk((prev) => {
          const updated = [...prev];
          updated[0].value = penduduk?.jumlah_penduduk ? `${penduduk.jumlah_penduduk} Jiwa` : "...";
          updated[1].value = keluarga?.jumlah_keluarga ? `${keluarga.jumlah_keluarga} KK` : "...";
          updated[2].value = `${jumlahP} Jiwa`;
          updated[3].value = `${jumlahL} Jiwa`;
          return updated;
        });

        //Perkawinan
        const getLabel = (row) => (row?.status_perkawinan ?? row?.status ?? row?.perkawinan ?? row?.label ?? "").toString().trim().toLowerCase();

        const mapPerkawinan = new Map();
        (perkawinan || []).forEach((row) => {
          mapPerkawinan.set(getLabel(row), row?.total ?? 0);
        });

        setDataPerkawinan((prev) => {
          const next = prev.map((card) => {
            const key = card.label.toLowerCase(); // "belum kawin", "kawin", "cerai mati", "cerai hidup"
            const jumlah = mapPerkawinan.get(key);
            return {
              ...card,
              value: typeof jumlah === "number" ? `${jumlah} Jiwa` : "0 Jiwa",
            };
          });
          return next;
        });

        // Agama
        const getLabelAgama = (row) => (row?.agama ?? row?.label ?? "").toString().trim().toLowerCase();

        const mapAgama = new Map();
        (agama || []).forEach((row) => {
          mapAgama.set(getLabelAgama(row), row?.total ?? 0);
        });

        setDataAgama((prev) => {
          return prev.map((card) => {
            const key = card.label.toLowerCase();
            const jumlah = mapAgama.get(key);
            return {
              ...card,
              value: typeof jumlah === "number" ? `${jumlah} Jiwa` : "0 Jiwa",
            };
          });
        });

        // Dusun
        setDataDusun(
          (dusun || [])
            .filter((row) => row?.dusun) // hindari dusun null
            .map((row) => ({
              name: row.dusun,
              jumlah: row.total ?? 0,
            }))
        );

        // Pendidikan
        const mapPendidikan = new Map();
        (pendidikan || []).forEach((row) => {
          const label = row?.pendidikan?.toString().trim().toLowerCase();
          if (label) mapPendidikan.set(label, row.total ?? 0);
        });

        setDataPendidikan(
          listPendidikanTetap.map((label) => {
            const jumlah = mapPendidikan.get(label.toLowerCase()) ?? 0;
            return {
              name: label,
              jumlah,
            };
          })
        );
      } catch (error) {
        console.error("Gagal mengambil data infografis:", error);
      }
    };

    fetchData();
  }, []);

  const [dataPerkawinan, setDataPerkawinan] = useState([
    { label: "Belum Kawin", value: "...", icon: "/images/penduduk/belum-kawin.png" },
    { label: "Kawin", value: "...", icon: "/images/penduduk/kawin.png" },
    { label: "Cerai Mati", value: "...", icon: "/images/penduduk/cerai-mati.png" },
    { label: "Cerai Hidup", value: "...", icon: "/images/penduduk/cerai-hidup.png" },
  ]);

  const [dataAgama, setDataAgama] = useState([
    { label: "Islam", value: "...", icon: "/images/penduduk/islam.png" },
    { label: "Hindu", value: "...", icon: "/images/penduduk/hindu.png" },
    { label: "Budha", value: "...", icon: "/images/penduduk/buddha.png" },
    { label: "Konghucu", value: "...", icon: "/images/penduduk/konghucu.png" },
    { label: "Kristen", value: "...", icon: "/images/penduduk/kristen.png" },
    { label: "Katolik", value: "...", icon: "/images/penduduk/katolik.png" },
    { label: "Kepercayaan lainnya", value: "...", icon: "/images/penduduk/agama-lainnya.png" },
  ]);

  const [dataDusun, setDataDusun] = useState([]);

  const listPendidikanTetap = ["Tidak Belum Sekolah", "Belum Tamat SD/Sederajat", "Tamat SD/Sederajat", "SLTP/Sederajat", "SLTA/Sederajat", "D-1/D-2", "D-3", "S-1", "S-2", "S-3"];

  const [dataPendidikan, setDataPendidikan] = useState(
    listPendidikanTetap.map((label) => ({
      name: label,
      jumlah: 0,
    }))
  );

  const pieColors = ["#27AE60", "#2980B9", "#F39C12", "#8E44AD", "#E74C3C", "#16A085", "#D35400", "#2C3E50"];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Infografis Desa</h2>
        <p className="mx-auto text-gray-600 mb-10 text-sm sm:text-base text-center">
          Halaman ini menyajikan data demografis Desa Limapoccoe dalam bentuk visual yang mudah dipahami. Informasi meliputi jumlah penduduk, pendidikan, status perkawinan, agama, dan distribusi dusun. Data ini berguna sebagai dasar
          perencanaan dan pengambilan keputusan di tingkat desa.
        </p>

        {/* PENDUDUK */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-6 mb-10">
          {dataPenduduk.map((item, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4">
              <Image src={item.icon} alt={item.label} width={60} height={60} />
              <div>
                <p className="text-sm sm:text-lg text-gray-600">{item.label}</p>
                <p className="text-sm sm:text-lg text-gray-600">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* PIE CHART DUSUN */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <h3 className="text-lg font-semibold text-green-600 mb-4">Berdasarkan Dusun</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="jumlah" data={dataDusun} cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {dataDusun.map((_, index) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART PENDIDIKAN */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <h3 className="text-lg font-semibold text-green-600 mb-4">Berdasarkan Pendidikan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataPendidikan} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <XAxis dataKey="name" tick={<CustomXAxisTick />} interval={0} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#27AE60" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PERKAWINAN */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <h3 className="text-lg font-semibold text-green-600 mb-6">Berdasarkan Perkawinan</h3>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {dataPerkawinan.map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4">
                <Image src={item.icon} alt={item.label} width={60} height={60} />
                <div>
                  <p className="text-sm sm:text-lg text-gray-600">{item.label}</p>
                  <p className="text-sm sm:text-lg text-gray-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AGAMA */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-green-600 mb-6">Berdasarkan Agama</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
            {dataAgama.map((item, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-4">
                <Image src={item.icon} alt={item.label} width={60} height={60} />
                <div>
                  <p className="text-sm sm:text-lg text-gray-600">{item.label}</p>
                  <p className="text-sm sm:text-lg text-gray-600">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <FloatingButtons />
    </div>
  );
}
