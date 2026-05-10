/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { partnersData, Partner } from "@/data/partners";
import { useLanguage } from "@/context/LanguageContext";
import {
  Zap, Shield, Anchor, Building2, GraduationCap, HeartPulse,
  X, Globe, ExternalLink, MapPin, Calendar, ShieldCheck, TrendingUp,
} from "lucide-react";
import { createPortal } from "react-dom";

/* ── Sector config ─────────────────────────────────────────────────────── */
const SECTORS: Record<string, { label: string; labelFr: string; icon: React.ReactNode; color: string }> = {
  "Formation Professionnelle et Technique": { label: "Vocational",   labelFr: "Formation Pro",  icon: <Building2 className="w-3.5 h-3.5" />,     color: "#a3e635" },
  "Santé et VR Médicale":                   { label: "Healthcare",   labelFr: "Santé",          icon: <HeartPulse className="w-3.5 h-3.5" />,    color: "#fb7185" },
  "Éducation des Enfants (6-16 Ans)":       { label: "Education",    labelFr: "Éducation",      icon: <GraduationCap className="w-3.5 h-3.5" />, color: "#a78bfa" },
};
const getS = (n: string) => SECTORS[n] ?? { label: n, labelFr: n, icon: <Zap className="w-3.5 h-3.5" />, color: "#22d3ee" };

/* ── Clean Elegant Card ────────────────────────────────────────────────── */
function ElegantCard({ partner, lang, onClick }: { partner: Partner; lang: string; onClick: () => void }) {
  const s = getS(partner.sector);
  const initials = partner.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-5 p-4 rounded-3xl cursor-pointer group flex-shrink-0 w-[340px] transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.background = "rgba(255,255,255,0.06)";
        el.style.borderColor = `${s.color}50`;
        el.style.boxShadow = `0 12px 30px rgba(0,0,0,0.3), 0 0 20px ${s.color}20`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "";
        el.style.background = "rgba(255,255,255,0.03)";
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.boxShadow = "";
      }}
    >
      {/* Large Beautiful Icon Container */}
      <div className="w-[84px] h-[84px] bg-white rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-inner">
        <span className="absolute font-bold text-slate-400 text-xl select-none z-0">{initials}</span>
        <img
          src={partner.logoUrl || `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${partner.domain}&size=128`}
          alt={partner.name}
          loading="lazy"
          className="w-full h-full p-2.5 object-contain relative z-10 bg-white"
          onError={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
          onLoad={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          style={{ opacity: 0, transition: 'opacity 0.2s' }}
        />
      </div>

      {/* Simplified Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-[16px] leading-tight truncate group-hover:text-white transition-colors duration-300">
          {partner.name}
        </h3>
        <p className="text-white/40 text-[12px] mt-1 flex items-center gap-1.5">
          <span className="text-[14px]">{partner.flag}</span> {partner.country}
        </p>
        <div 
          className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider" 
          style={{ color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}25` }}
        >
          {s.icon} {lang === 'en' ? s.label : s.labelFr}
        </div>
      </div>
    </div>
  );
}

/* ── Scrolling Row ─────────────────────────────────────────────────────── */
function ScrollRow({
  partners, reverse, lang, onSelect,
}: { partners: Partner[]; reverse: boolean; lang: string; onSelect: (p: Partner) => void }) {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  const CARD_PX = 364; // 340px card + 24px gap
  const reps = partners.length > 0 ? Math.max(Math.ceil(2500 / (partners.length * CARD_PX)), 1) : 1;
  const base = Array(reps).fill(null).flatMap(() => partners);
  const track = [...base, ...base];
  const durationSec = Math.round((base.length * CARD_PX) / 60);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #020617, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg, #020617, transparent)" }} />

      <div
        className="flex gap-6 py-4 px-2"
        style={{
          width: "max-content",
          ...(mounted ? {
            animation: `${reverse ? "marquee-reverse" : "marquee"} ${durationSec}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
            willChange: "transform",
          } : {
            transform: "translateX(0)",
          })
        }}
      >
        {track.map((p, i) => (
          <ElegantCard key={`${p.id}-${i}`} partner={p} lang={lang} onClick={() => onSelect(p)} />
        ))}
      </div>
    </div>
  );
}

/* ── Detail modal ──────────────────────────────────────────────────────── */
function Modal({ partner, onClose }: { partner: Partner; onClose: () => void }) {
  const { t, language } = useLanguage();
  const s = getS(partner.sector);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl z-10 [&::-webkit-scrollbar]:hidden"
        style={{ background: "#0a0d14", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 50px rgba(0,0,0,0.5)" }}
      >
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
        
        <div className="flex items-center gap-5 p-6 border-b border-white/[0.04]">
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg">
            <Image
              src={partner.logoUrl || `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${partner.domain}&size=128`}
              alt={partner.name}
              width={128}
              height={128}
              className="w-[60px] h-[60px] object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <h3 className="text-2xl font-bold text-white truncate">{partner.name}</h3>
              <span className="text-xl">{partner.flag}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider"
                style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}25` }}>
                {s.icon} {language === "en" ? s.label : s.labelFr}
              </span>
              <span className="text-[13px] text-white/40 font-medium">{partner.country}</span>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <MapPin className="w-4 h-4" />,      l: t("HQ","Siège"),        v: partner.headquarters || partner.country },
              { icon: <Calendar className="w-4 h-4" />,    l: t("Founded","Fondé"),   v: partner.foundedYear || "—" },
              { icon: <ShieldCheck className="w-4 h-4" />, l: t("Compliance","Conf."),v: partner.compliance || "—" },
              { icon: <TrendingUp className="w-4 h-4" />,  l: "ROI",                  v: partner.roiMetrics ? (language === "en" ? partner.roiMetrics.en.split("|")[0].trim() : partner.roiMetrics.fr.split("|")[0].trim()) : "—" },
            ].map((m, i) => (
              <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/[0.04] p-3.5">
                <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>
                  {m.icon}<span className="text-[10px] font-bold uppercase tracking-widest">{m.l}</span>
                </div>
                <p className="text-white/80 text-[13px] font-medium leading-snug">{m.v}</p>
              </div>
            ))}
          </div>
          
          <p className="text-[15px] text-white/60 leading-relaxed">
            {language === "en" ? partner.description.en : partner.description.fr}
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.04] p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">{t("Pricing","Tarification")}</p>
              <p className="text-white/70 text-[14px] leading-relaxed">{language === "en" ? partner.pricing.en : partner.pricing.fr}</p>
            </div>
            <div className="rounded-2xl p-5" style={{ background: `${s.color}05`, border: `1px solid ${s.color}15` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: s.color }}>{t("Opportunities","Opportunités")}</p>
              <p className="text-white/70 text-[14px] leading-relaxed">{language === "en" ? partner.opportunities.en : partner.opportunities.fr}</p>
            </div>
          </div>

          <a href={`https://${partner.domain}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-xl text-white font-bold hover:brightness-110 transition-all text-[15px]"
            style={{ background: s.color, boxShadow: `0 8px 20px ${s.color}30` }}>
            <Globe className="w-4 h-4" />
            {t("Visit Website","Visiter le site")}
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────────────────── */
export function OrbitalProviders() {
  const { t, language } = useLanguage();
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<Partner | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);
  const close = useCallback(() => setSelected(null), []);

  const sectorNames = useMemo(() => Array.from(new Set(partnersData.map(p => p.sector))), []);

  const visiblePartners = useMemo(() =>
    active === "All" ? partnersData : partnersData.filter(p => p.sector === active),
    [active]
  );

  const half = Math.ceil(visiblePartners.length / 2);
  const row1 = visiblePartners.slice(0, half);
  const row2 = visiblePartners.slice(half);

  return (
    <section id="providers" className="py-24 relative z-10 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-12 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] mb-6">
            <span className="w-2 h-2 rounded-full bg-moon-blue-light animate-pulse" />
            <span className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">
              {t("Partner Ecosystem","Écosystème Partenaires")}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">
            {language === "en" ? (
              <>Our <span className="text-moon-yellow">VR</span> <span className="text-gradient">Providers</span></>
            ) : (
              <>Nos <span className="text-gradient">Fournisseurs</span> <span className="text-moon-yellow">VR</span></>
            )}
          </h2>
        </motion.div>
      </div>

      {/* ── Clean Minimal Categories ── */}
      <div className="flex flex-wrap justify-center gap-3 px-6 mb-14 max-w-4xl mx-auto">
        {["All", ...sectorNames].map(sec => {
          const isActive = active === sec;
          const s = sec !== "All" ? getS(sec) : null;
          
          return (
            <button
              key={sec}
              onClick={() => setActive(sec)}
              className="px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 flex items-center gap-2"
              style={isActive ? {
                background: s ? `${s.color}15` : "rgba(255,255,255,0.1)",
                color: s ? s.color : "white",
                border: `1px solid ${s ? s.color : "rgba(255,255,255,0.3)"}`,
                boxShadow: `0 0 20px ${s ? `${s.color}20` : "rgba(255,255,255,0.1)"}`
              } : {
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {s && <span className={isActive ? "opacity-100" : "opacity-60"}>{s.icon}</span>}
              {sec === "All" 
                ? t("All Categories", "Toutes les Catégories") 
                : (language === "en" ? (s?.label ?? sec) : (s?.labelFr ?? sec))}
            </button>
          );
        })}
      </div>

      {/* ── Two rows of cards ── */}
      <AnimatePresence mode="wait">
        {active === "All" ? (
          <motion.div
            key="all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <ScrollRow partners={row1} reverse={false} lang={language} onSelect={setSelected} />
            <ScrollRow partners={row2} reverse={true} lang={language} onSelect={setSelected} />
          </motion.div>
        ) : (
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 px-6"
          >
            <div className="flex flex-wrap justify-center gap-6">
              {row1.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                >
                  <ElegantCard partner={p} lang={language} onClick={() => setSelected(p)} />
                </motion.div>
              ))}
            </div>
            {row2.length > 0 && (
              <div className="flex flex-wrap justify-center gap-6 mt-6">
                {row2.map((p, i) => (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (row1.length + i) * 0.05, duration: 0.4, ease: "easeOut" }}
                  >
                    <ElegantCard partner={p} lang={language} onClick={() => setSelected(p)} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      {isMounted && createPortal(
        <AnimatePresence>
          {selected && <Modal partner={selected} onClose={close} />}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
