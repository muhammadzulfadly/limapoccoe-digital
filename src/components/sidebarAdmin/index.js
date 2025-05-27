"use client";

import Link from "next/link";

const SidebarAdmin = () => {
  return (
    <aside className="w-64 bg-white shadow h-full p-4">
      <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/admin/pengajuan" className="block px-3 py-2 rounded hover:bg-teal-100">
            Pengajuan Surat
          </Link>
        </li>
        <li>
          <Link href="/admin/pengaduan" className="block px-3 py-2 rounded hover:bg-teal-100">
            Pengaduan Masyarakat
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default SidebarAdmin;
