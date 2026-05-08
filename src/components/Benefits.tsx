"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Globe2, Tag, Zap, ArrowRight } from "lucide-react";
import { useMemo } from "react";

export function Benefits() {
  const { t, language } = useLanguage();

  const benefits = useMemo(() => [
    {
      icon: <Globe2 className="w-5 h-5" />,
      color: "#007aff", // Moon Blue
      title: t("Global VR Leaders", "Leaders Mondiaux VR"),
      description: t(
        "Connect directly with vetted industry leaders and pioneers in virtual reality.",
        "Connectez-vous directement aux leaders et pionniers de la réalité virtuelle."
      ),
    },
    {
      icon: <Tag className="w-5 h-5" />,
      color: "#fbb730", // Moon Gold
      title: t("Exclusive Deals", "Offres Exclusives"),
      description: t(
        "Unlock special corporate pricing and unique offers secured just for our network.",
        "Débloquez des tarifs d'entreprise privilégiés et des offres uniques pour notre réseau."
      ),
    },
    {
      icon: <Zap className="w-5 h-5" />,
      color: "#38bdf8", // Light Blue
      title: t("Easy Connection", "Connexion Rapide"),
      description: t(
        "A completely streamlined, frictionless process to deploy VR in your organization.",
        "Un processus entièrement simplifié pour déployer la VR au sein de votre organisation."
      ),
    },
  ], [t]);

  return (
    <section id="benefits" className="py-20 relative z-10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-moon-yellow animate-pulse drop-shadow-[0_0_8px_rgba(251,183,48,0.6)]" />
            <span className="text-[10px] font-semibold text-white/50 uppercase tracking-widest">
              {t("Our Value", "Notre Valeur")}
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-display font-bold text-white mb-4"
          >
            {t("Why Choose ", "Pourquoi Choisir ")}
            <span className="inline-flex items-center lowercase align-middle">
              <span className="text-white">m</span><span className="text-moon-yellow">o</span><span className="text-white">on</span>
              <span className="text-moon-blue-light drop-shadow-[0_0_8px_rgba(0,122,255,0.6)] uppercase ml-1.5 text-[0.8em]">XR</span>
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-lg mx-auto text-[15px]"
          >
            {t(
              "We bridge the gap between global technology providers and your enterprise needs.",
              "Nous faisons le lien entre les meilleurs fournisseurs de technologie mondiaux et vos besoins."
            )}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="group relative p-7 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md transition-all duration-300 hover:bg-white/[0.04] overflow-hidden"
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.2)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${benefit.color}40`;
                e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.3), 0 0 20px ${benefit.color}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
              }}
            >
              {/* Subtle background glow */}
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: benefit.color }}
              />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${benefit.color}15`,
                    color: benefit.color,
                    border: `1px solid ${benefit.color}30`
                  }}
                >
                  {benefit.icon}
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <ArrowRight className="w-4 h-4 text-white/70" />
                </div>
              </div>

              <h3 className="text-[17px] font-bold text-white mb-2.5 relative z-10 group-hover:text-white transition-colors">
                {benefit.title}
              </h3>
              <p className="text-[13px] text-white/50 leading-relaxed relative z-10 group-hover:text-white/70 transition-colors">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
