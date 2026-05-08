"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2 bg-brand-dark/40 backdrop-blur-2xl rounded-full p-1 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <Globe className="w-3.5 h-3.5 text-white/50 ml-3" />
      <div className="flex space-x-1 relative">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-y-0 bg-white/10 rounded-full border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          layoutId="activeLangBg"
          initial={false}
          animate={{
            left: language === "en" ? 0 : "50%",
            width: "50%",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        <button
          onClick={() => setLanguage("en")}
          className={`relative z-10 px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] rounded-full transition-colors ${
            language === "en" ? "text-moon-blue-light drop-shadow-[0_0_8px_rgba(0,122,255,0.6)]" : "text-white/50 hover:text-white"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("fr")}
          className={`relative z-10 px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] rounded-full transition-colors ${
            language === "fr" ? "text-moon-yellow drop-shadow-[0_0_8px_rgba(251,183,48,0.6)]" : "text-white/50 hover:text-white"
          }`}
        >
          FR
        </button>
      </div>
    </div>
  );
}
