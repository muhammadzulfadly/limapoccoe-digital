import { redirect } from "next/navigation";
import Head from "next/head";

export default function Home() {
  // SEO: Set up the page metadata
  return (
    <>
      <Head>
        <title>Limapoccoe Digital</title>
        <link rel="icon" type="image/png" href="https://limapoccoedigital.id/logo.png" />
        <meta name="description" content="Website Resmi Pemerintahan Desa Limapoccoe" />
        <meta name="keywords" content="limapoccoe, website limapoccoe, aplikasi limapoccoe, limapoccoedigital, desa limapoccoe, maros, website maros" />
        <meta name="author" content="Limapoccoe Digital" />
        <meta property="og:title" content="LimapoccoeDigital" />
        <meta property="og:description" content="Website Resmi Pemerintahan Desa Limapoccoe" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://limapoccoedigital.id" />
        <meta property="og:image" content="https://limapoccoedigital.id/logo.png" />
      </Head>
      {/* Redirect ke halaman /beranda */}
      {redirect("/beranda")}
    </>
  );
}
