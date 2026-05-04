"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Globe2, Tag, Zap, ChevronRight } from "lucide-react";

export function Benefits() {
  const { t } = useLanguage();
  
  const benefits = [
    {
      icon: <Globe2 className="w-8 h-8 text-cyan-400" />,
      bgIcon: "bg-cyan-500/10",
      glow: "group-hover:bg-cyan-500/20",
      border: "hover:border-cyan-500/50",
      title: t("Access Top VR Companies", "Accès aux entreprises VR"),
      description: t("Connect directly with vetted industry leaders and pioneers in virtual reality.", "Connectez-vous directement aux leaders et pionniers de la réalité virtuelle.")
    },
    {
      icon: <Tag className="w-8 h-8 text-purple-400" />,
      bgIcon: "bg-purple-500/10",
      glow: "group-hover:bg-purple-500/20",
      border: "hover:border-purple-500/50",
      title: t("Exclusive Deals", "Offres Exclusives"),
      description: t("Unlock special corporate pricing and unique offers secured just for our network.", "Débloquez des prix d'entreprise spéciaux et des offres uniques sécurisées.")
    },
    {
      icon: <Zap className="w-8 h-8 text-emerald-400" />,
      bgIcon: "bg-emerald-500/10",
      glow: "group-hover:bg-emerald-500/20",
      border: "hover:border-emerald-500/50",
      title: t("Easy Connection", "Connexion Facile"),
      description: t("A completely streamlined, frictionless process to deploy VR in your organization.", "Un processus totalement fluide pour déployer la VR dans votre organisation.")
    }
  ];

  return (
    <section id="benefits" className="py-32 relative z-10 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-6"
          >
            {t("Why Choose ", "Pourquoi Choisir ")}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">MoonXR</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/60 max-w-2xl mx-auto text-lg"
          >
            {t("We bridge the gap between global technology providers and your enterprise needs.", "Nous comblons le fossé entre les fournisseurs de technologie et vos besoins.")}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className={`p-10 rounded-3xl bg-white/5 border border-white/10 ${benefit.border} transition-all duration-300 group shadow-lg hover:shadow-2xl hover:bg-white/10 relative overflow-hidden backdrop-blur-sm`}
            >
              {/* Background Glow Orb on Hover */}
              <div className={`absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-[80px] transition-colors duration-500 ${benefit.glow} opacity-0 group-hover:opacity-100`} />

              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className={`w-16 h-16 rounded-2xl ${benefit.bgIcon} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-inner border border-white/5`}>
                  {benefit.icon}
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                  <ChevronRight className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">{benefit.title}</h3>
              <p className="text-white/60 leading-relaxed relative z-10 group-hover:text-white/80 transition-colors">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
