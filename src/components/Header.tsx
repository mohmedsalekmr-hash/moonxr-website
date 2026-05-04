"use client";

import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "./LanguageToggle";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Boxes, Sparkles, FileText, X, Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { t } = useLanguage();
  const { scrollY } = useScroll();
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(10, 10, 11, 0)", "rgba(10, 10, 11, 0.6)"]
  );
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(16px)"]
  );

  const borderColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(0, 229, 255, 0.15)"]
  );

  return (
    <>
      <motion.header
        style={{ backgroundColor, backdropFilter: backdropBlur, borderBottomColor: borderColor }}
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Incredible Animated Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-12 h-12">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-1 rounded-full border-t border-purple-500/50"
              />
              <Boxes className="w-5 h-5 text-cyan-400 relative z-10 drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
              <motion.div
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
              </motion.div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl tracking-widest text-white leading-none">
                Moon<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">XR</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/40 mt-1">
                Virtual Reality
              </span>
            </div>
          </motion.div>

          {/* Executive Navigation */}
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center relative bg-[#0A0A0B]/80 backdrop-blur-xl px-2 py-2 rounded-full border border-cyan-500/30 shadow-[0_0_20px_rgba(0,229,255,0.15)]"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 blur-md -z-10" />

            <a href="/#providers" className="relative group px-6 py-2 rounded-full overflow-hidden transition-colors">
              <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <span className="relative z-10 flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-white/70 group-hover:text-purple-400 transition-colors">
                <Boxes className="w-3 h-3" />
                <span>{t("Providers", "Fournisseurs")}</span>
              </span>
            </a>

            <button 
              onClick={() => setIsContactOpen(true)}
              className="relative group px-6 py-2 rounded-full overflow-hidden transition-colors"
            >
              <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              <span className="relative z-10 flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest text-white/70 group-hover:text-purple-400 transition-colors">
                <FileText className="w-3 h-3" />
                <span>{t("Contact", "Contact")}</span>
              </span>
            </button>
          </motion.nav>

          {/* Right Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
          >
            <LanguageToggle />
          </motion.div>
          
        </div>
        
        <motion.div 
          style={{ opacity: useTransform(scrollY, [0, 50], [0, 1]) }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
        />
      </motion.header>

      {/* Incredible Contact Modal */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactOpen(false)}
              className="absolute inset-0 bg-[#0A0A0B]/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="relative w-full max-w-4xl bg-gradient-to-br from-[#121214] to-[#0A0A0B] border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(157,0,255,0.2)] overflow-hidden"
            >
              {/* Background Orbs */}
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row">
                
                {/* Center: Contact Info Only (No Form) */}
                <div className="w-full bg-white/5 p-12 flex flex-col justify-center items-center text-center backdrop-blur-sm relative">
                  <button 
                    onClick={() => setIsContactOpen(false)}
                    className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h2 className="text-4xl font-black text-white mb-4">{t("Get in Touch", "Contactez-nous")}</h2>
                  <p className="text-white/60 mb-12 max-w-md">{t("Ready to revolutionize your enterprise with VR? Reach out to our executive team directly.", "Prêt à révolutionner votre entreprise avec la VR ? Contactez directement notre équipe de direction.")}</p>
                  
                  <div className="grid md:grid-cols-3 gap-8 w-full max-w-3xl">
                    <div className="flex flex-col items-center p-6 bg-black/20 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                      <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6 text-purple-400" />
                      </div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">{t("Email Us", "Envoyez un Email")}</p>
                      <a href="mailto:contact@moonxr.com" className="text-white font-medium hover:text-purple-400 transition-colors">contact@moonxr.com</a>
                    </div>

                    <div className="flex flex-col items-center p-6 bg-black/20 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
                      <div className="w-14 h-14 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Phone className="w-6 h-6 text-cyan-400" />
                      </div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">{t("Call Us", "Appelez-nous")}</p>
                      <a href="tel:+2220000000" className="text-white font-medium hover:text-cyan-400 transition-colors">+222 00 00 00 00</a>
                    </div>

                    <div className="flex flex-col items-center p-6 bg-black/20 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-colors group">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6 text-emerald-400" />
                      </div>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">{t("Location", "Emplacement")}</p>
                      <span className="text-white font-medium">Nouakchott, Mauritania</span>
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
