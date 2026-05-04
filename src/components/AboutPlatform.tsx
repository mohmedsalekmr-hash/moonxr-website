"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Network, Target, Workflow, Zap } from "lucide-react";

export function AboutPlatform() {
  const { t, language } = useLanguage();

  return (
    <section id="about-platform" className="py-24 relative z-10 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Network className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
                {t("About MoonXR", "À propos de MoonXR")}
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-white">
              {t("Pioneering the ", "Pionnier de l'")}<span className="text-gradient">Immersive Future</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-8 md:p-12 rounded-3xl h-full border-t border-purple-500/30 shadow-[0_0_40px_rgba(157,0,255,0.1)] relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />
            <h3 className="text-2xl font-bold text-white mb-6">
              {t("Bridging Worlds Through Technology", "Relier les mondes par la technologie")}
            </h3>
            <div className="space-y-6 text-white/70 text-lg leading-relaxed">
              <p>
                {language === "en" 
                  ? "MoonXR operates at the convergence of enterprise innovation and spatial computing. We bridge the gap between global organizations and the world's most advanced Virtual Reality ecosystems." 
                  : "MoonXR opère à la convergence de l'innovation d'entreprise et de l'informatique spatiale. Nous comblons le fossé entre les organisations mondiales et les écosystèmes de réalité virtuelle les plus avancés."}
              </p>
              <p>
                {language === "en"
                  ? "By meticulously curating top-tier developers and hardware manufacturers, we empower industries ranging from maritime navigation to life-saving medical training. Our platform guarantees seamless deployment pipelines and exclusive enterprise-grade deals tailored to your exact needs."
                  : "En sélectionnant méticuleusement des développeurs et fabricants de matériel de premier plan, nous renforçons des industries allant de la navigation maritime à la formation médicale vitale. Notre plateforme garantit des déploiements fluides et des offres exclusives."}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass-panel p-6 rounded-2xl flex items-start space-x-4 hover:bg-white/10 transition-colors">
              <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 mt-1">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">{t("Curated Excellence", "Excellence Sélectionnée")}</h4>
                <p className="text-white/60 text-sm">
                  {language === "en" ? "Only partnering with proven, industry-compliant simulators and training tools." : "Partenariat uniquement avec des simulateurs et outils de formation éprouvés et conformes."}
                </p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-start space-x-4 hover:bg-white/10 transition-colors">
              <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 mt-1">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">{t("Unbeatable Leverage", "Levier Imbattable")}</h4>
                <p className="text-white/60 text-sm">
                  {language === "en" ? "Negotiating unparalleled pricing frameworks, ensuring massive reductions in TCO for our clients." : "Négociation de cadres tarifaires inégalés, assurant des réductions massives du TCO pour nos clients."}
                </p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex items-start space-x-4 hover:bg-white/10 transition-colors">
              <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 mt-1">
                <Workflow className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">{t("Streamlined Integration", "Intégration Simplifiée")}</h4>
                <p className="text-white/60 text-sm">
                  {language === "en" ? "Zero technical friction. We connect you straight to the implementation experts." : "Zéro friction technique. Nous vous connectons directement aux experts en implémentation."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
