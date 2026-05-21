/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { partnersData, Partner, Category } from "@/data/partners";
import { getProvidersAction, getCategoriesAction } from "@/app/actions";
import { useLanguage } from "@/context/LanguageContext";
import { Zap, Building2, HeartPulse, GraduationCap } from "lucide-react";

/* ── Clean Elegant Card ────────────────────────────────────────────────── */
function ElegantCard({ partner, lang, categories }: { partner: Partner; lang: string; categories: Category[] }) {
  const initials = partner.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  // Dynamically resolve sector config from database/fallback sectors
  const matched = categories.find(c => c.nameFr === partner.sector || c.nameEn === partner.sector || c.id === partner.sector);
  const sColor = matched?.color || "#3b82f6";
  const sLabel = lang === 'en' ? (matched?.nameEn || partner.sector) : (matched?.nameFr || partner.sector);
  const sIconStr = matched?.icon || "🌐";

  // Sanitize and ensure direct external link has absolute prefix
  const rawUrl = partner.domain || "";
  const targetUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://") 
    ? rawUrl 
    : `https://${rawUrl}`;

  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-5 p-4 rounded-3xl cursor-pointer group flex-shrink-0 w-[340px] transition-all duration-300 block text-left"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-4px)";
        el.style.background = "rgba(255,255,255,0.06)";
        el.style.borderColor = `${sColor}50`;
        el.style.boxShadow = `0 12px 30px rgba(0,0,0,0.3), 0 0 20px ${sColor}20`;
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
          <span className="text-[14px]">{partner.flag}</span> {partner.country || "GLOBAL"}
        </p>
        <div 
          className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider" 
          style={{ color: sColor, background: `${sColor}15`, border: `1px solid ${sColor}25` }}
        >
          <span className="text-xs">{sIconStr}</span> {sLabel}
        </div>
      </div>
    </a>
  );
}

/* ── Scrolling Row ─────────────────────────────────────────────────────── */
function ScrollRow({
  partners, reverse, lang, categories,
}: { partners: Partner[]; reverse: boolean; lang: string; categories: Category[] }) {
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
          <ElegantCard key={`${p.id}-${i}`} partner={p} lang={lang} categories={categories} />
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */
export function OrbitalProviders() {
  const { t, language } = useLanguage();
  const [active, setActive] = useState("All");
  const [isMounted, setIsMounted] = useState(false);
  const [partners, setPartners] = useState<Partner[]>(partnersData);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setIsMounted(true);
    async function load() {
      const data = await getProvidersAction();
      if (data && data.length > 0) {
        setPartners(data);
      }
    }
    async function loadCats() {
      const data = await getCategoriesAction();
      setCategories(data);
    }
    load();
    loadCats();
  }, []);

  const activePartners = useMemo(() => partners.filter(p => p.isVisible !== false), [partners]);
  
  // Resolve unique sector names dynamically matching active partners
  const sectorNames = useMemo(() => {
    return Array.from(new Set(activePartners.map(p => p.sector)));
  }, [activePartners]);

  const visiblePartners = useMemo(() =>
    active === "All" ? activePartners : activePartners.filter(p => p.sector === active),
    [active, activePartners]
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
          const matched = categories.find(c => c.nameFr === sec || c.nameEn === sec || c.id === sec);
          const sColor = matched?.color || "#3b82f6";
          const sIconStr = matched?.icon || "🌐";
          const sLabel = language === 'en' ? (matched?.nameEn || sec) : (matched?.nameFr || sec);
          
          return (
            <button
              key={sec}
              onClick={() => setActive(sec)}
              className="px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-300 flex items-center gap-2"
              style={isActive ? {
                background: `${sColor}15`,
                color: sColor,
                border: `1px solid ${sColor}`,
                boxShadow: `0 0 20px ${sColor}20`
              } : {
                background: "rgba(255,255,255,0.03)",
                color: "rgba(255,255,255,0.4)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span className={isActive ? "opacity-100" : "opacity-60"}>{sIconStr}</span>
              {sec === "All" 
                ? t("All Categories", "Toutes les Catégories") 
                : sLabel}
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
            <ScrollRow partners={row1} reverse={false} lang={language} categories={categories} />
            <ScrollRow partners={row2} reverse={true} lang={language} categories={categories} />
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
                  <ElegantCard partner={p} lang={language} categories={categories} />
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
                    <ElegantCard partner={p} lang={language} categories={categories} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
