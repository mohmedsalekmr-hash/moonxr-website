"use client";

import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Boxes, Sparkles, FileText, X, Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsContactOpen(true);
    window.addEventListener("openContactModal", handleOpen);
    return () => window.removeEventListener("openContactModal", handleOpen);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    if (!isContactOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsContactOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isContactOpen]);

  const backgroundColor = useTransform(
    scrollY,
    [0, 60],
    ["rgba(7, 26, 60, 0)", "rgba(7, 26, 60, 0.85)"]
  );
  const backdropBlur = useTransform(scrollY, [0, 60], ["blur(0px)", "blur(18px)"]);
  const borderColor = useTransform(
    scrollY,
    [0, 60],
    ["rgba(255,255,255,0)", "rgba(0,122,255,0.18)"]
  );
  // Separate transform for the accent line opacity — avoids calling useTransform inside JSX
  const accentLineOpacity = useTransform(scrollY, [0, 60], [0, 1]);

  return (
    <>
      <motion.header
        style={{ backgroundColor, backdropFilter: backdropBlur, borderBottomColor: borderColor }}
        className="fixed top-0 left-0 right-0 z-40 border-b"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-14 h-14">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 relative z-10 drop-shadow-[0_0_15px_rgba(0,122,255,0.8)] group-hover:scale-110 transition-transform duration-500"
              >
                <circle cx="32" cy="32" r="24" fill="url(#core-glow)" opacity="0.5" className="animate-pulse" />
                <path
                  d="M12 30C12 26.6863 14.6863 24 18 24H46C49.3137 24 52 26.6863 52 30V38C52 42.4183 48.4183 46 44 46H20C15.5817 46 12 42.4183 12 38V30Z"
                  fill="url(#visor-gradient)"
                  stroke="#007aff"
                  strokeWidth="2"
                />
                <path
                  d="M16 35H48"
                  stroke="#0c3585"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="animate-pulse"
                  style={{ filter: "drop-shadow(0 0 8px #0c3585)" }}
                />
                <path d="M14 28H8C5.79086 28 4 29.7909 4 32V34" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
                <path d="M50 28H56C58.2091 28 60 29.7909 60 32V34" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
                <defs>
                  <linearGradient id="visor-gradient" x1="12" y1="24" x2="52" y2="46" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1A1A24" />
                    <stop offset="1" stopColor="#0A0A0F" />
                  </linearGradient>
                  <radialGradient id="core-glow" cx="32" cy="32" r="24" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#007aff" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#0c3585" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>

              <motion.div
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
              </motion.div>
            </div>

            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl tracking-widest leading-none">
                <span className="text-white">Moon</span>
                <span className="text-moon-blue-light drop-shadow-[0_0_8px_rgba(0,122,255,0.6)]">XR</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 mt-1">Virtual Reality</span>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center relative bg-brand-dark/40 backdrop-blur-2xl px-1.5 py-1.5 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-moon-blue-light/5 via-moon-blue/10 to-moon-blue-light/5 blur-md -z-10" />

            <Link href="/#providers" className="relative group px-6 py-2.5 rounded-full overflow-hidden transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-moon-blue-light/10 to-moon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <span className="relative z-10 flex items-center space-x-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 group-hover:text-moon-blue-light transition-colors">
                <Boxes className="w-3.5 h-3.5" />
                <span>{t("Providers", "Fournisseurs")}</span>
              </span>
            </Link>

            <button
              onClick={() => setIsContactOpen(true)}
              className="relative group px-6 py-2.5 rounded-full overflow-hidden transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-moon-yellow/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <span className="relative z-10 flex items-center space-x-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white/80 group-hover:text-moon-yellow transition-colors">
                <FileText className="w-3.5 h-3.5" />
                <span>{t("Contact", "Contact")}</span>
              </span>
            </button>
          </motion.nav>

          {/* Language Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center"
          >
            <LanguageToggle />
          </motion.div>
        </div>

        {/* Accent progress line */}
        <motion.div
          style={{ opacity: accentLineOpacity }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        />
      </motion.header>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactOpen(false)}
              className="absolute inset-0 bg-brand-dark/90 backdrop-blur-xl"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-brand-dark border border-white/10 rounded-3xl"
            >
              <div className="relative z-10 flex flex-col md:flex-row">
                <div className="w-full bg-transparent p-6 sm:p-10 md:p-12 flex flex-col justify-center items-center text-center backdrop-blur-sm relative min-h-max">
                  <div className="sticky top-0 right-0 w-full flex justify-end z-50 mb-4 md:absolute md:top-5 md:right-5 md:mb-0">
                    <button
                      onClick={() => setIsContactOpen(false)}
                      aria-label="Close modal"
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-moon-white via-moon-blue-light to-moon-blue mb-4 tracking-tight">
                    {t("Get in Touch", "Contactez-nous")}
                  </h2>
                  <p className="text-white/60 mb-10 max-w-md">
                    {t(
                      "Ready to revolutionize your enterprise with VR? Reach out to our executive team directly.",
                      "Prêt à révolutionner votre entreprise avec la réalité virtuelle ? Contactez directement notre équipe dirigeante."
                    )}
                  </p>

                  <div className="grid md:grid-cols-3 gap-5 w-full max-w-3xl">
                    {/* Email */}
                    <div className="relative flex flex-col items-center p-7 bg-transparent rounded-3xl border border-white/5 hover:border-moon-blue-light/40 transition-all duration-500 group overflow-hidden hover:shadow-[0_0_40px_rgba(0,122,255,0.15)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-moon-blue-light/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="w-14 h-14 rounded-2xl bg-moon-blue-dark/50 flex items-center justify-center mb-5 group-hover:shadow-[0_0_30px_rgba(0,122,255,0.4)] group-hover:scale-110 transition-all duration-500 border border-moon-blue-light/20 relative z-10">
                        <Mail className="w-6 h-6 text-moon-blue-light drop-shadow-[0_0_8px_rgba(0,122,255,0.8)]" />
                      </div>
                      <p className="text-moon-blue-light/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 relative z-10">{t("Email Us", "Envoyez un Email")}</p>
                      <a href="mailto:mohamedsaleck@moon.mr" className="text-white text-base font-medium hover:text-moon-blue-light transition-colors relative z-10 break-all">
                        mohamedsaleck@moon.mr
                      </a>
                    </div>

                    {/* Phone */}
                    <div className="relative flex flex-col items-center p-7 bg-transparent rounded-3xl border border-white/5 hover:border-moon-yellow/40 transition-all duration-500 group overflow-hidden hover:shadow-[0_0_40px_rgba(251,183,48,0.15)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-moon-yellow/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="w-14 h-14 rounded-2xl bg-amber-950/50 flex items-center justify-center mb-5 group-hover:shadow-[0_0_30px_rgba(251,183,48,0.4)] group-hover:scale-110 transition-all duration-500 border border-moon-yellow/20 relative z-10">
                        <Phone className="w-6 h-6 text-moon-yellow drop-shadow-[0_0_8px_rgba(251,183,48,0.8)]" />
                      </div>
                      <p className="text-moon-yellow/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 relative z-10">{t("Call Us", "Appelez-nous")}</p>
                      <a href="tel:+22230454777" className="text-white text-base font-medium hover:text-moon-yellow transition-colors relative z-10">
                        +222 30454777
                      </a>
                    </div>

                    {/* Location */}
                    <div className="relative flex flex-col items-center p-7 bg-transparent rounded-3xl border border-white/5 hover:border-emerald-500/40 transition-all duration-500 group overflow-hidden hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="w-14 h-14 rounded-2xl bg-emerald-950/50 flex items-center justify-center mb-5 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-all duration-500 border border-emerald-500/20 relative z-10">
                        <MapPin className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      </div>
                      <p className="text-emerald-400/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 relative z-10">{t("Location", "Emplacement")}</p>
                      <span className="text-white text-base font-medium relative z-10">Nouakchott, Mauritania</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
