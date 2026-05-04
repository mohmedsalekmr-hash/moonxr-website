"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";
import { motion } from "framer-motion";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
      <Globe className="w-4 h-4 text-white/70 ml-2" />
      <div className="flex space-x-1 relative">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-y-0 bg-brand-cyan/20 rounded-full"
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
          className={`relative z-10 px-3 py-1 text-sm font-medium rounded-full transition-colors ${
            language === "en" ? "text-cyan-400" : "text-white/70 hover:text-white"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("fr")}
          className={`relative z-10 px-3 py-1 text-sm font-medium rounded-full transition-colors ${
            language === "fr" ? "text-cyan-400" : "text-white/70 hover:text-white"
          }`}
        >
          FR
        </button>
      </div>
    </div>
  );
}
