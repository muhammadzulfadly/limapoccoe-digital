import { redirect } from "next/navigation";
import Head from "next/head";

export default function Home() {
  // SEO: Set up the page metadata
  return (
    <>
      <Head>
        <title>Limapoccoe Digital</title>
        <meta name="description" content="Website Resmi Pemerintahan Desa Limapoccoe" />
        <meta name="keywords" content="limapoccoe, website limapoccoe, aplikasi limapoccoe, limapoccoedigital, desa limapoccoe, maros, website maros" />
        <meta name="author" content="Limapoccoe Digital" />
        <meta property="og:title" content="Limapoccoe Digital" />
        <meta property="og:description" content="Temukan solusi digital terbaik di Limapoccoe Digital untuk bisnis Anda." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://limapoccoedigital.id" />
        <meta property="og:image" content="/path/to/image.jpg" />
      </Head>
      {/* Redirect ke halaman /beranda */}
      {redirect("/beranda")}
    </>
  );
}
