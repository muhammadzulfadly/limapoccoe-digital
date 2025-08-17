"use client";

import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function FloatingButtons() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">
      {/* Tombol Scroll ke Atas */}
      {showScroll && (
        <button onClick={scrollToTop} className="w-12 h-12 bg-[#2C3E50] hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg transition-all">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Tombol WhatsApp */}
      <a
        href="https://wa.me/62881080268674?text=Menu"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-start bg-[#27AE60] hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 w-12 h-12 lg:hover:w-28 overflow-hidden"
      >
        {/* Ikon WhatsApp */}
        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
          <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
        </div>

        {/* Teks Chat */}
        <div className="hidden lg:flex items-center h-full ml-1 pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-semibold">Chat</span>
        </div>
      </a>
    </div>
  );
}
