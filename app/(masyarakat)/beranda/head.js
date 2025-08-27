// app/beranda/head.js
export default function Head() {
  const title = "LimapoccoeDigital - Website Resmi Desa Limapoccoe";
  const description = "Website resmi Desa Limapoccoe, Kec. Cenrana, Kab. Maros. Layanan digital desa: pengajuan surat, pengaduan, informasi kegiatan, dan potensi masyarakat.";
  const url = "https://limapoccoedigital.id";
  const image = "https://limapoccoedigital.id/logo.png";
  const siteName = "LimapoccoeDigital";

  return (
    <>
      {/* Basic */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="limapoccoe, website limapoccoe, aplikasi limapoccoe, desa limapoccoe, maros, website maros, limapoccoe digital, limapoccoe" />
      <meta name="author" content="LimapoccoeDigital" />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={url} />

      {/* Icons */}
      <link rel="icon" href="/logo.png" />
      <link rel="apple-touch-icon" href="/logo.png" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="LimapoccoeDigital" />
      <meta property="og:locale" content="id_ID" />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "LimapoccoeDigital",
            url: "https://limapoccoedigital.id",
            logo: "https://limapoccoedigital.id/logo.png",
          }),
        }}
      />
    </>
  );
}
