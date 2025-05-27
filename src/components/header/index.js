"use client";
import { FaUser } from "react-icons/fa";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-teal-700 text-white flex justify-between items-center px-6 py-4">
      {/* Logo dan Nama Desa (link ke landing page) */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80">
        <img src="/logo-desa.png" alt="Logo Desa" className="h-8" />
        <h1 className="font-bold text-lg">Desa Limapoccoe</h1>
      </Link>

      {/* Info pengguna dan tombol dashboard */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="bg-white text-teal-700 px-3 py-1 rounded hover:bg-gray-100 text-sm font-medium"
        >
          Dashboard
        </Link>
        
        <div className="flex items-center gap-2">
          <FaUser />
          <span>Syahran Syahputra</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
