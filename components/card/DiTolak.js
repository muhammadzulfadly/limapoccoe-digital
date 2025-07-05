import { Ban } from "lucide-react";

export default function DitolakCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex flex-col justify-between">
      <div className="text-xl font-semibold">1</div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Ditolak</span>
        <Ban className="text-red-500" />
      </div>
    </div>
  );
}