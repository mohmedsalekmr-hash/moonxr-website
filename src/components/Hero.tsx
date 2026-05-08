/* eslint-disable @next/next/no-img-element */
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight, Globe2 } from "lucide-react";
import { TypingEffect } from "./TypingEffect";
import { memo } from "react";

/* ── Floating spec chip ──────────────────────────────────────────────────── */
const DataChip = memo(function DataChip({
  label, value, top, left, delay,
}: {
  label: string; value: string; top: string; left: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: "easeOut" }}
      className="absolute z-20 pointer-events-none"
      style={{ top, left }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        className="px-3 py-1.5 rounded-lg border border-white/[0.08] backdrop-blur-md flex items-center gap-2"
        style={{ background: "rgba(4, 8, 24, 0.85)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400/80 animate-pulse flex-shrink-0" />
        <div className="flex flex-col leading-none">
          <span className="text-[8px] uppercase tracking-[0.15em] text-blue-300/50 font-medium">{label}</span>
          <span className="text-[11px] font-bold text-white/85">{value}</span>
        </div>
      </motion.div>
    </motion.div>
  );
});

/* ── Ambient floating particle ───────────────────────────────────────────── */
const FloatingParticle = memo(function FloatingParticle({
  x, y, size, delay, color,
}: {
  x: string; y: string; size: number; delay: number; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0] }}
      transition={{ duration: 4 + delay * 2, repeat: Infinity, delay, ease: "easeInOut" }}
      className="absolute rounded-full pointer-events-none"
      style={{
        top: y,
        left: x,
        width: size,
        height: size,
        background: color,
        filter: `blur(${size > 3 ? 1 : 0}px)`,
      }}
    />
  );
});

/* ── Hero Section ────────────────────────────────────────────────────────── */
export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="about"
      className="relative flex items-center pt-20"
      style={{ minHeight: "100svh" }}
    >
      {/* ── Ambient atmospheric layer ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="absolute top-[10%] right-[15%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #007aff 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #fbb730 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[40%] left-[40%] w-[600px] h-[600px] rounded-full opacity-[0.025]"
          style={{ background: "radial-gradient(circle, #4400cc 0%, transparent 65%)" }}
        />
      </div>

      {/* ── Floating ambient particles ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <FloatingParticle x="12%" y="20%" size={2}   delay={0}   color="rgba(0,122,255,0.5)"   />
        <FloatingParticle x="85%" y="15%" size={3}   delay={1.5} color="rgba(0,122,255,0.4)"   />
        <FloatingParticle x="70%" y="65%" size={2}   delay={0.8} color="rgba(168,85,247,0.4)"  />
        <FloatingParticle x="25%" y="75%" size={2.5} delay={2}   color="rgba(251,183,48,0.4)"  />
        <FloatingParticle x="50%" y="30%" size={1.5} delay={3}   color="rgba(255,255,255,0.3)" />
        <FloatingParticle x="35%" y="55%" size={2}   delay={1}   color="rgba(0,122,255,0.35)"  />
        <FloatingParticle x="90%" y="80%" size={2}   delay={2.5} color="rgba(168,85,247,0.3)"  />
        <FloatingParticle x="8%"  y="50%" size={1.5} delay={0.5} color="rgba(255,255,255,0.25)"/>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full" style={{ position: "relative", zIndex: 10 }}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ===== LEFT — Text content ===== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse flex-shrink-0" />
              <span className="text-[11px] font-medium text-white/45 uppercase tracking-widest">
                {t("Virtual Reality Platform", "Plateforme de Réalité Virtuelle")}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.08] mb-6 lowercase flex items-center">
              <span className="text-white">m</span><span className="text-moon-yellow">o</span><span className="text-white">on</span>
              <span className="text-moon-blue-light drop-shadow-[0_0_20px_rgba(0,122,255,0.35)] uppercase ml-3 text-[0.85em]">XR</span>
            </h1>

            <p className="text-lg md:text-xl text-white/45 mb-10 max-w-xl leading-relaxed" style={{ minHeight: "4rem" }}>
              <TypingEffect
                text={t(
                  "Connecting Mauritania to the Future of VR. We bring you the best deals from top global providers.",
                  "Connecter la Mauritanie à l'avenir de la VR. Nous vous apportons les meilleures offres des fournisseurs mondiaux."
                )}
              />
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.a
                href="#providers"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center space-x-2 px-8 py-4 bg-white text-black rounded-full font-semibold shadow-[0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-shadow duration-300"
              >
                <span>{t("Explore Our Providers", "Explorer nos Fournisseurs")}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => window.dispatchEvent(new Event("openContactModal"))}
                className="flex items-center space-x-2 px-8 py-4 rounded-full font-semibold border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-300 group"
              >
                <Globe2 className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <span className="text-white/80">{t("Connect With Us", "Contactez-nous")}</span>
              </motion.button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-12 pt-8 border-t border-white/[0.05]">
              {[
                { value: "18+", label: t("Global Partners", "Partenaires") },
                { value: "6",   label: t("Industries", "Secteurs") },
                { value: "12+", label: t("Countries", "Pays") },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                >
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-widest font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ===== RIGHT — Headset visual ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative hidden lg:flex items-center justify-center h-full w-full"
            style={{ minHeight: "560px" }}
          >
            {/* Outer orbit ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              className="absolute w-[380px] h-[380px] rounded-full"
              style={{ border: "1px solid rgba(0,122,255,0.08)", willChange: "transform" }}
            >
              <div
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
                style={{ background: "#007aff", boxShadow: "0 0 10px 3px rgba(0,122,255,0.6)" }}
              />
            </motion.div>

            {/* Inner counter-ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute w-[260px] h-[260px] rounded-full"
              style={{ border: "1px solid rgba(255,255,255,0.04)", willChange: "transform" }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                style={{ background: "#a855f7", boxShadow: "0 0 8px 2px rgba(168,85,247,0.5)" }}
              />
            </motion.div>

            {/* Ambient glow behind headset */}
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3], scale: [0.96, 1.06, 0.96] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 340,
                height: 340,
                background: "radial-gradient(circle, rgba(0,122,255,0.18) 0%, rgba(80,0,220,0.08) 45%, transparent 72%)",
                willChange: "opacity, transform",
              }}
            />

            {/* Light ray left */}
            <motion.div
              animate={{ opacity: [0.08, 0.18, 0.08], scaleX: [0.9, 1.1, 0.9] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
              className="absolute pointer-events-none"
              style={{
                zIndex: 5,
                width: 500,
                height: 2,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%) rotate(-15deg)",
                background: "linear-gradient(90deg, transparent, rgba(0,122,255,0.3), transparent)",
                filter: "blur(2px)",
              }}
            />

            {/* Light ray right */}
            <motion.div
              animate={{ opacity: [0.06, 0.14, 0.06], scaleX: [1.1, 0.9, 1.1] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
              className="absolute pointer-events-none"
              style={{
                zIndex: 5,
                width: 450,
                height: 1.5,
                left: "50%",
                top: "48%",
                transform: "translate(-50%, -50%) rotate(10deg)",
                background: "linear-gradient(90deg, transparent, rgba(168,85,247,0.25), transparent)",
                filter: "blur(1.5px)",
              }}
            />

            {/* Headset — CSS float */}
            <div
              className="relative z-10 w-full flex justify-center items-center"
              style={{ animation: "headsetFloat 7s ease-in-out infinite", willChange: "transform" }}
            >
              <img
                src="/meta_quest_3_transparent.png"
                alt="Meta Quest 3 VR Headset"
                className="w-[82%] h-auto object-contain select-none"
                draggable={false}
                style={{
                  mixBlendMode: "screen",
                  filter: "brightness(1.5) contrast(1.4) saturate(1.3)",
                  WebkitFilter: "brightness(1.5) contrast(1.4) saturate(1.3)",
                  WebkitMaskImage: "radial-gradient(ellipse 70% 65% at 50% 50%, black 55%, transparent 100%)",
                  maskImage: "radial-gradient(ellipse 70% 65% at 50% 50%, black 55%, transparent 100%)",
                }}
              />
            </div>

            {/* Ground shadow */}
            <div
              className="absolute pointer-events-none"
              style={{
                zIndex: 10,
                bottom: 28,
                left: "50%",
                transform: "translateX(-50%)",
                width: "50%",
                height: 20,
                background: "radial-gradient(ellipse, rgba(0,122,255,0.22) 0%, transparent 70%)",
                filter: "blur(8px)",
                animation: "headsetFloat 7s ease-in-out infinite",
              }}
            />

            {/* Data chips */}
            <DataChip label="Refresh Rate" value="120 Hz" top="8%"  left="0%"  delay={0.6} />
            <DataChip label="FOV"          value="110°"   top="52%" left="-6%" delay={0.9} />
            <DataChip label="Resolution"   value="2K/eye" top="84%" left="8%"  delay={1.2} />
            <DataChip label="Latency"      value="< 10ms" top="6%"  left="72%" delay={0.8} />
            <DataChip label="Tracking"     value="6DoF"   top="80%" left="74%" delay={1.1} />
          </motion.div>
        </div>
      </div>

      {/* Section bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-brand-dark to-transparent pointer-events-none"
        style={{ zIndex: 5 }}
      />
    </section>
  );
}
