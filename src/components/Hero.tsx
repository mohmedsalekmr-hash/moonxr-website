"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight, Globe2 } from "lucide-react";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
                {t("Virtual Reality Platform", "Plateforme de Réalité Virtuelle")}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Moon<span className="text-gradient">XR</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/60 mb-8 max-w-xl leading-relaxed">
              {t(
                "We connect you to top VR providers and bring you the best deals.",
                "Nous vous connectons aux meilleurs fournisseurs de réalité virtuelle et vous proposons les meilleures offres."
              )}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center space-x-2 px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-purple-50 transition-colors">
                <span>{t("Explore VR Services", "Explorer les Services VR")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button className="flex items-center space-x-2 px-8 py-4 glass-panel rounded-full font-semibold hover:bg-white/10 transition-colors group">
                <Globe2 className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span>{t("Connect With Us", "Connectez-vous Avec Nous")}</span>
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center h-full w-full min-h-[500px]"
          >
            {/* Incredible Orbital Animations Behind */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[110%] aspect-square rounded-full border border-cyan-500/20 border-dashed"
              />
              {/* Middle Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-[80%] aspect-square rounded-full border-t border-b border-purple-500/30"
              />
              {/* Inner Glowing Core */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[50%] aspect-square rounded-full bg-gradient-to-tr from-cyan-500/40 to-purple-500/40 blur-3xl"
              />
            </div>
            
            {/* The Meta Quest 3 VR Headset Image with floating physics */}
            {/* Using a radial mask to completely feather out any black background edges, making it seamlessly transparent */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotateX: [0, 5, 0],
                rotateY: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full h-auto flex justify-center items-center"
              style={{ perspective: "1000px" }}
            >
              <img
                src="/meta_quest_3.png"
                alt="Meta Quest 3 VR Headset"
                className="w-[85%] h-auto drop-shadow-[0_0_30px_rgba(0,229,255,0.4)] object-contain"
                style={{ 
                  mixBlendMode: "screen", 
                  filter: "contrast(1.3) brightness(1.1)",
                  WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
                  maskImage: "radial-gradient(circle at center, black 40%, transparent 70%)"
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
