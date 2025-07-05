import { FileText } from "lucide-react";

export default function UserGuideCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full p-4 flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-gray-800">User Guid</span>
        <span className="text-sm text-gray-800">Lihat panduan</span>
      </div>
      <FileText className="text-gray-800" />
    </div>
  );
}
