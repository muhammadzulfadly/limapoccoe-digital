"use client";

import Image from "next/image";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import FloatingButtons from "@/components/FloatingButtons";

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

export default function InfografisPage() {
  const dataPenduduk = [
    {
      label: "TOTAL PENDUDUK",
      value: "0 Jiwa",
      icon: "/images/penduduk/total.png",
    },
    {
      label: "KEPALA KELUARGA",
      value: "0 KK",
      icon: "/images/penduduk/kepala-keluarga.png",
    },
    {
      label: "PEREMPUAN",
      value: "0 Jiwa",
      icon: "/images/penduduk/perempuan.png",
    },
    {
      label: "LAKI-LAKI",
      value: "0 Jiwa",
      icon: "/images/penduduk/laki-laki.png",
    },
  ];

  const dataPerkawinan = [
    { label: "Belum Kawin", value: "0 Jiwa", icon: "/images/penduduk/belum-kawin.png" },
    { label: "Kawin", value: "0 Jiwa", icon: "/images/penduduk/kawin.png" },
    { label: "Cerai Mati", value: "0 Jiwa", icon: "/images/penduduk/cerai-mati.png" },
    { label: "Cerai Hidup", value: "0 Jiwa", icon: "/images/penduduk/cerai-hidup.png" },
  ];

  const dataAgama = [
    { label: "Islam", value: "0 Jiwa", icon: "/images/penduduk/islam.png" },
    { label: "Hindu", value: "0 Jiwa", icon: "/images/penduduk/hindu.png" },
    { label: "Budha", value: "0 Jiwa", icon: "/images/penduduk/buddha.png" },
    { label: "Konghucu", value: "0 Jiwa", icon: "/images/penduduk/konghucu.png" },
    { label: "Kristen", value: "0 Jiwa", icon: "/images/penduduk/kristen.png" },
    { label: "Katolik", value: "0 Jiwa", icon: "/images/penduduk/katolik.png" },
    { label: "Kepercayaan lainnya", value: "0 Jiwa", icon: "/images/penduduk/agama-lainnya.png" },
  ];

  const dataDusun = [
    { name: "WT.Bengo", jumlah: 500 },
    { name: "Barua", jumlah: 500 },
    { name: "Mappasaile", jumlah: 500 },
    { name: "Kampala", jumlah: 500 },
    { name: "Kaluku", jumlah: 500 },
    { name: "Jambua", jumlah: 500 },
    { name: "Bontopanno", jumlah: 500 },
    { name: "Samata", jumlah: 500 },
  ];

  const dataPendidikan = [
    { name: "Tidak Belum Sekolah", jumlah: 500 },
    { name: "Belum Tamat SD/Sederajat", jumlah: 500 },
    { name: "Tamat SD/Sederajat", jumlah: 500 },
    { name: "SLTP/Sederajat", jumlah: 500 },
    { name: "SLTA/Sederajat", jumlah: 500 },
    { name: "D-1/D-2", jumlah: 500 },
    { name: "D-3", jumlah: 500 },
    { name: "S-1", jumlah: 500 },
    { name: "S-2", jumlah: 500 },
    { name: "S-3", jumlah: 500 },
  ];

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
