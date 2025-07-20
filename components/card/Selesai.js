import { UserCheck } from "lucide-react";

export default function SelesaiCard({ count }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex items-center justify-between">
      <div>
        <div className="text-lg md:text-xl font-semibold">{count}</div>
        <span className="text-xs md:text-sm text-gray-400">Selesai</span>
      </div>
      <UserCheck
        size={32} // Mobile size
        className="text-green-500 md:w-[50px] md:h-[50px]"
      />
    </div>
  );
}
