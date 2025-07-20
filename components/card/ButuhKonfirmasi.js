import { BadgeCheck } from "lucide-react";

export default function ButuhKonfirmasiCard({ count }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex items-center justify-between">
      <div>
        <div className="text-lg md:text-xl font-semibold">{count}</div>
        <span className="text-xs md:text-sm text-gray-400">Butuh Konfirmasi</span>
      </div>
      <BadgeCheck
        size={32} // default untuk mobile
        className="text-cyan-800 md:w-[50px] md:h-[50px]"
      />
    </div>
  );
}
