"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="flex-grow flex items-center justify-center relative z-10 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-10 md:p-16 rounded-3xl w-full max-w-lg text-center shadow-[0_0_50px_rgba(157,0,255,0.15)] border-t border-purple-500/30 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {t("Contact ", "Contactez ")}<span className="text-gradient">{t("Us", "Nous")}</span>
          </h2>
          <p className="text-white/60 mb-10">
            {t("Get in touch with our team to start your VR journey.", "Contactez notre équipe pour commencer votre voyage VR.")}
          </p>

          <div className="space-y-6">
            <a 
              href="mailto:contact@moonxr.com" 
              className="flex items-center justify-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-lg text-white font-medium">contact@moonxr.com</span>
            </a>

            <a 
              href="tel:+1234567890" 
              className="flex items-center justify-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-lg text-white font-medium">+1 234 567 890</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
