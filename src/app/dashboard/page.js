"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import StatusCard from "@/components/statuscard";
import {
  FaClock,
  FaCog,
  FaTimesCircle,
  FaCheckCircle,
  FaUserCheck,
  FaFileDownload,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="flex h-screen flex-col">
      <Header />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatusCard
              icon={<FaClock />}
              title="Pending"
              count={0}
              color="text-orange-500"
            />
            <StatusCard
              icon={<FaCog />}
              title="Sedang Proses"
              count={0}
              color="text-gray-500"
            />
            <StatusCard
              icon={<FaTimesCircle />}
              title="Dibatalkan"
              count={0}
              color="text-red-500"
            />
            <StatusCard
              icon={<FaUserCheck />}
              title="Selesai"
              count={0}
              color="text-green-500"
            />
            <StatusCard
              icon={<FaCheckCircle />}
              title="Butuh Konfirmasi"
              count={0}
              color="text-cyan-700"
            />
            <StatusCard
              icon={<FaFileDownload />}
              title="User Guid"
              count=""
              color="text-black"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
