"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Network, Target, Workflow, Zap } from "lucide-react";

export function AboutPlatform() {
  const { t, language } = useLanguage();

  return (
    <section id="about-platform" className="py-24 relative z-10 overflow-hidden">
      {/* Immersive Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-moon-blue-light/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-moon-yellow/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-moon-blue-light/10 border border-moon-blue-light/20 mb-6">
              <Network className="w-4 h-4 text-moon-blue-light flex-shrink-0" />
              <span className="text-xs font-medium text-moon-blue-light uppercase tracking-wider">
                {t("About ", "À propos de ")}
                <span className="font-bold lowercase inline-flex items-center align-middle">
                  <span className="text-white">m</span><span className="text-moon-yellow">o</span><span className="text-white">on</span>
                  <span className="text-moon-blue-light drop-shadow-[0_0_8px_rgba(0,122,255,0.6)] uppercase ml-1.5 text-[0.85em]">XR</span>
                </span>
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-white">
              {t("Pioneering the ", "Pionniers de l'")}
              <span className="text-gradient">
                {t("Immersive Future", "Futur Immersif")}
              </span>
            </h2>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(0,122,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(0,122,255,0.15)",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
            }}
          >
            {/* Internal Card Glow */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-moon-blue-light/20 rounded-full blur-3xl pointer-events-none" />

            <h3 className="text-2xl font-bold text-white mb-6 relative z-10">
              {t("Bridging Worlds Through Technology", "Relier les Mondes par la Technologie")}
            </h3>
            <div className="space-y-6 text-white/70 text-lg leading-relaxed relative z-10">
              <p>
                {language === "en" ? (
                  <>
                    <span className="font-bold lowercase inline-flex items-center align-middle">
                      <span className="text-white">m</span><span className="text-moon-yellow">o</span><span className="text-white">on</span>
                      <span className="text-moon-blue-light drop-shadow-[0_0_8px_rgba(0,122,255,0.6)] uppercase ml-1.5 text-[0.85em]">XR</span>
                    </span>{" "}
                    operates at the convergence of enterprise innovation and spatial computing. We bridge the gap between
                    global organizations and the world&apos;s most advanced Virtual Reality ecosystems.
                  </>
                ) : (
                  <>
                    <span className="font-bold lowercase inline-flex items-center align-middle">
                      <span className="text-white">m</span><span className="text-moon-yellow">o</span><span className="text-white">on</span>
                      <span className="text-moon-blue-light drop-shadow-[0_0_8px_rgba(0,122,255,0.6)] uppercase ml-1.5 text-[0.85em]">XR</span>
                    </span>{" "}
                    opère à la convergence de l&apos;innovation d&apos;entreprise et de l&apos;informatique spatiale. Nous éliminons
                    les barrières entre les organisations mondiales et les écosystèmes de réalité virtuelle les plus
                    avancés de la planète.
                  </>
                )}
              </p>
              <p>
                {language === "en"
                  ? "By meticulously curating top-tier developers and hardware manufacturers, we empower industries ranging from maritime navigation to life-saving medical training. Our platform guarantees seamless deployment pipelines and exclusive enterprise-grade deals tailored to your exact needs."
                  : "En sélectionnant rigoureusement les meilleurs développeurs et fabricants de matériel au monde, nous transformons des secteurs critiques — de la navigation maritime à la formation médicale vitale. Notre plateforme garantit un déploiement fluide et des offres exclusives taillées sur mesure pour votre organisation."}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {[
              {
                Icon: Target,
                colorCls: "bg-moon-blue-light/10 text-moon-blue-light",
                title: t("Curated Excellence", "Excellence Sélectionnée"),
                body: language === "en"
                  ? "Only partnering with proven, industry-compliant simulators and training tools."
                  : "Partenariats exclusifs avec des simulateurs et outils de formation certifiés et éprouvés à l'échelle internationale.",
              },
              {
                Icon: Zap,
                colorCls: "bg-moon-yellow/10 text-moon-yellow",
                title: t("Unbeatable Leverage", "Avantage Inégalé"),
                body: language === "en"
                  ? "Negotiating unparalleled pricing frameworks, ensuring massive reductions in TCO for our clients."
                  : "Nous négocions des conditions tarifaires d'exception, garantissant à nos clients des réductions massives du coût total de possession (TCO).",
              },
              {
                Icon: Workflow,
                colorCls: "bg-white/10 text-white",
                title: t("Streamlined Integration", "Intégration Simplifiée"),
                body: language === "en"
                  ? "Zero technical friction. We connect you straight to the implementation experts."
                  : "Zéro friction technique. Nous vous connectons directement aux experts en déploiement pour une mise en œuvre rapide et sereine.",
              },
            ].map(({ Icon, colorCls, title, body }) => (
              <div
                key={title}
                className="glass-panel p-6 rounded-2xl flex items-start space-x-4 hover:bg-white/10 transition-colors duration-300"
              >
                <div className={`p-3 rounded-xl ${colorCls} mt-1 flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
