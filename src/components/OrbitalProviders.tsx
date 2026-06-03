/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { partnersData, Partner } from "@/data/partners";
import { getProvidersAction } from "@/app/actions";
import { useLanguage } from "@/context/LanguageContext";

/* ── Clean Elegant Card ────────────────────────────────────────────────── */
function ElegantCard({ partner }: { partner: Partner }) {
  const initials = partner.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // Sanitize and ensure direct external link has absolute prefix
  const rawUrl = partner.url || "";
  const targetUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://") 
    ? rawUrl 
    : `https://${rawUrl}`;

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center justify-between p-3 rounded-3xl cursor-pointer group flex-shrink-0 w-[180px] h-[165px] transition-all duration-300 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.background = "rgba(255,255,255,0.06)";
        el.style.borderColor = "rgba(0,122,255,0.4)";
        el.style.boxShadow = "0 12px 30px rgba(0,0,0,0.3), 0 0 20px rgba(0,122,255,0.2)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "";
        el.style.background = "rgba(255,255,255,0.03)";
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.boxShadow = "";
      }}
      title={`Visit ${partner.name}`}
    >
      {/* Logo Canvas */}
      <div className="w-full flex-1 bg-white rounded-2xl flex items-center justify-center relative overflow-hidden transition-transform duration-300 group-hover:scale-[1.03] shadow-inner mb-2">
        <span className="absolute font-bold text-slate-400 text-xl select-none z-0">{initials}</span>
        <img
          src={partner.logo_url || `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${targetUrl}&size=128`}
          alt={partner.name}
          loading="lazy"
          className="w-full h-full p-3 object-contain relative z-10 bg-white"
          onError={(e) => {
            e.currentTarget.style.opacity = '0';
          }}
          onLoad={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          style={{ opacity: 0, transition: 'opacity 0.2s' }}
        />
      </div>

      {/* Company Name */}
      <p
        className="w-full text-center text-[11px] font-bold text-white/70 group-hover:text-white transition-colors leading-tight truncate px-1 flex-shrink-0"
        title={partner.name}
      >
        {partner.name}
      </p>
    </a>
  );
}

/* ── Scrolling Row ─────────────────────────────────────────────────────── */
function ScrollRow({
  partners, reverse,
}: { partners: Partner[]; reverse: boolean }) {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(t);
  }, []);

  const CARD_PX = 204; // 180px card + 24px gap (height is now 165px but width unchanged)
  const reps = partners.length > 0 ? Math.max(Math.ceil(2500 / (partners.length * CARD_PX)), 1) : 1;
  const base = Array(reps).fill(null).flatMap(() => partners);
  const track = [...base, ...base];
  const durationSec = Math.round((base.length * CARD_PX) / 45);

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
          <ElegantCard key={`${p.id}-${i}`} partner={p} />
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export function OrbitalProviders() {
  const { t, language } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [partners, setPartners] = useState<Partner[]>(partnersData);

  useEffect(() => {
    setIsMounted(true);
    async function load() {
      const data = await getProvidersAction();
      if (data) {
        setPartners(data);
      }
    }
    load();
  }, []);

  const activePartners = useMemo(() => partners.filter(p => p.is_visible !== false), [partners]);

  const half = Math.ceil(activePartners.length / 2);
  const row1 = activePartners.slice(0, half);
  const row2 = activePartners.slice(half);

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

      {/* ── Two rows of cards ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key="marquee-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <ScrollRow partners={row1} reverse={false} />
          <ScrollRow partners={row2} reverse={true} />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
