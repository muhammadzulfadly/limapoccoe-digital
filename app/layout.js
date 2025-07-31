import PropTypes from "prop-types";

export const metadata = {
  title: "LimapoccoeDigital",
  description: "Selamat Datang. Website ini merupakan website resmi Pemerintahan Desa Limapoccoe. Adapun layanan yang dimiliki yaitu Pengajuan surat, Pengaduan, Berita desa, dan Informasi desa",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "LimapoccoeDigital",
    description: "Selamat Datang. Website ini merupakan website resmi Pemerintahan Desa Limapoccoe. Adapun layanan yang dimiliki yaitu Pengajuan surat, Pengaduan, Berita desa, dan Informasi desa",
    url: "https://limapoccoedigital.id",
    images: "/logo.png",
    type: "website",
  },
  keywords: ["limapoccoe", "website limapoccoe", "aplikasi limapoccoe", "desa limapoccoe", "maros", "website maros", "limapoccoe digital"],
  authors: [{ name: "LimapoccoeDigital" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
