"use client";

import Header from "@/components/header";
import SidebarAdmin from "@/components/sidebarAdmin";
import StatusCard from "@/components/statuscard";
import {
  FaClock,
  FaCog,
  FaTimesCircle,
  FaCheckCircle,
  FaUserCheck,
  FaFileDownload,
} from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex flex-1">
        <SidebarAdmin />

        <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Dashboard Admin</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatusCard icon={<FaClock />} title="Pending" count={0} color="text-orange-500" />
            <StatusCard icon={<FaCog />} title="Sedang Proses" count={0} color="text-gray-500" />
            <StatusCard icon={<FaTimesCircle />} title="Dibatalkan" count={0} color="text-red-500" />
            <StatusCard icon={<FaUserCheck />} title="Selesai" count={0} color="text-green-500" />
            <StatusCard icon={<FaCheckCircle />} title="Butuh Konfirmasi" count={0} color="text-cyan-700" />
            <StatusCard icon={<FaFileDownload />} title="User Guid" count="" color="text-black" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
