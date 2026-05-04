"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 relative z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative w-full overflow-hidden"
        >
          {/* Background Orbs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-600/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="w-full p-12 md:p-16 flex flex-col justify-center items-center text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              {t("Get in Touch", "Contactez-nous")}
            </h2>
            <p className="text-white/60 mb-16 max-w-lg text-lg">
              {t("Ready to revolutionize your enterprise with VR? Reach out to our executive team directly.", "Prêt à révolutionner votre entreprise avec la VR ? Contactez directement notre équipe de direction.")}
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 w-full max-w-4xl">
              <div className="flex flex-col items-center p-8 bg-black/40 rounded-2xl border border-white/5 hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300 group shadow-lg">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(157,0,255,0.4)] transition-all duration-300">
                  <Mail className="w-7 h-7 text-purple-400" />
                </div>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-2">{t("Email Us", "Envoyez un Email")}</p>
                <a href="mailto:contact@moonxr.com" className="text-white font-medium hover:text-purple-400 transition-colors text-lg">contact@moonxr.com</a>
              </div>

              <div className="flex flex-col items-center p-8 bg-black/40 rounded-2xl border border-white/5 hover:border-cyan-500/50 hover:bg-white/5 transition-all duration-300 group shadow-lg">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all duration-300">
                  <Phone className="w-7 h-7 text-cyan-400" />
                </div>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-2">{t("Call Us", "Appelez-nous")}</p>
                <a href="tel:+2220000000" className="text-white font-medium hover:text-cyan-400 transition-colors text-lg">+222 00 00 00 00</a>
              </div>

              <div className="flex flex-col items-center p-8 bg-black/40 rounded-2xl border border-white/5 hover:border-emerald-500/50 hover:bg-white/5 transition-all duration-300 group shadow-lg">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300">
                  <MapPin className="w-7 h-7 text-emerald-400" />
                </div>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-2">{t("Location", "Emplacement")}</p>
                <span className="text-white font-medium text-lg">Nouakchott, Mauritania</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
