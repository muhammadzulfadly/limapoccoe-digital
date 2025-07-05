import { Cog } from "lucide-react";

export default function SedangProsesCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex flex-col justify-between">
      <div className="text-xl font-semibold">0</div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Sedang Proses</span>
        <Cog className="text-gray-500" />
      </div>
    </div>
  );
}