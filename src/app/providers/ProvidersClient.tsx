/* eslint-disable @next/next/no-img-element */
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Partner } from "@/data/partners";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X, Globe, MapPin, Calendar, ShieldCheck, TrendingUp,
  Building2, ExternalLink, Zap, Shield, Anchor,
  GraduationCap, HeartPulse, ArrowRight
} from "lucide-react";

const SECTORS: Record<string, { label: string; labelFr: string; icon: React.ReactNode; color: string }> = {
  "Oil, Gas, and Energy Industry":            { label: "Energy",       labelFr: "Énergie",       icon: <Zap className="w-4 h-4" />,           color: "#f59e0b" },
  "Mining and Resource Extraction":           { label: "Mining",       labelFr: "Mines",          icon: <Shield className="w-4 h-4" />,        color: "#fb923c" },
  "Fisheries and Maritime Navigation":        { label: "Maritime",     labelFr: "Maritime",       icon: <Anchor className="w-4 h-4" />,        color: "#38bdf8" },
  "Construction and Engineering":             { label: "Construction", labelFr: "Construction",   icon: <Building2 className="w-4 h-4" />,     color: "#a3e635" },
  "Technical and Vocational Education (TVET)":{ label: "Education",    labelFr: "Éducation",      icon: <GraduationCap className="w-4 h-4" />, color: "#a78bfa" },
  "Medicine and Healthcare":                  { label: "Healthcare",   labelFr: "Santé",          icon: <HeartPulse className="w-4 h-4" />,    color: "#fb7185" },
};
const getSector = (name: string) => SECTORS[name] ?? { label: name, labelFr: name, icon: <Zap className="w-4 h-4" />, color: "#22d3ee" };

function Logo({ domain, name }: { domain: string; name: string }) {
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [failed, setFailed] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const srcs = [
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
  ];
  if (failed) return <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl select-none">{initials}</div>;
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {!loaded && <span className="absolute font-bold text-gray-300 text-lg select-none">{initials}</span>}
      <img key={srcs[step]} src={srcs[step]} alt={name} loading="eager" decoding="async"
        className={`w-full h-full object-contain rounded-xl transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => { if (step + 1 < srcs.length) setStep(s => s + 1); else setFailed(true); }}
      />
    </div>
  );
}

function PartnerCard({ partner, onClick, lang }: { partner: Partner; onClick: () => void; lang: string }) {
  const sector = getSector(partner.sector);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer border border-white/[0.08] bg-white/[0.03] hover:border-white/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
    >
      <div className="relative h-36 bg-white flex items-center justify-center p-6">
        <div className="absolute top-0 inset-x-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, ${sector.color}, transparent)` }} />
        <div className="w-16 h-16 transition-transform duration-300 group-hover:scale-110">
          <Logo domain={partner.domain} name={partner.name} />
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-white leading-tight line-clamp-2">{partner.name}</h3>
          <span className="text-base flex-shrink-0 mt-0.5">{partner.flag}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: `${sector.color}15`, color: sector.color, border: `1px solid ${sector.color}25` }}>
            {sector.icon}
            {lang === "en" ? sector.label : sector.labelFr}
          </span>
        </div>
        <p className="text-[13px] text-white/45 leading-relaxed line-clamp-2 flex-1">
          {lang === "en" ? partner.description.en : partner.description.fr}
        </p>
        <div className="flex items-center gap-1 text-[13px] font-medium text-white/30 group-hover:text-white/70 transition-colors pt-2 border-t border-white/[0.06]">
          <span>{lang === "en" ? "Learn more" : "En savoir plus"}</span>
          <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </motion.article>
  );
}

export function ProvidersClient({ partners }: { partners: Partner[] }) {
  const { t, language } = useLanguage();
  const [activeSector, setActiveSector] = useState("All");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const closeModal = useCallback(() => setSelectedPartner(null), []);
  useEffect(() => {
    if (!selectedPartner) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPartner, closeModal]);

  const sectors = useMemo(() => ["All", ...Array.from(new Set(partners.map(p => p.sector)))], [partners]);
  const filteredPartners = useMemo(() => activeSector === "All" ? partners : partners.filter(p => p.sector === activeSector), [activeSector, partners]);

  return (
    <div className="space-y-12">
      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-8 text-center">
        {[
          { n: partners.length,                            label: t("Global Partners","Partenaires Mondiaux") },
          { n: Object.keys(SECTORS).length,                label: t("Industry Sectors","Secteurs Industriels") },
          { n: new Set(partners.map(p => p.country)).size, label: t("Countries","Pays") },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="text-3xl font-bold text-white">{stat.n}</div>
            <div className="text-xs text-white/40 font-medium uppercase tracking-widest mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Filter tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {sectors.map(sector => {
          const isActive = activeSector === sector;
          const s = sector !== "All" ? getSector(sector) : null;
          return (
            <button key={sector} onClick={() => setActiveSector(sector)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${isActive ? "bg-white/10 text-white border-white/20 shadow-lg" : "bg-transparent text-white/40 border-white/[0.06] hover:text-white/70 hover:bg-white/5 hover:border-white/10"}`}>
              {s && <span style={{ color: isActive ? s.color : undefined }}>{s.icon}</span>}
              {sector === "All" ? t("All Sectors","Tous les Secteurs") : (language === "en" ? (s?.label ?? sector) : (s?.labelFr ?? sector))}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredPartners.map(partner => (
            <PartnerCard key={partner.id} partner={partner} lang={language} onClick={() => setSelectedPartner(partner)} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Modal */}
      {isMounted && createPortal(
        <AnimatePresence>
          {selectedPartner && (() => {
            const sector = getSector(selectedPartner.sector);
            return (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={closeModal} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.96 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                  className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl z-10 [&::-webkit-scrollbar]:hidden"
                  style={{ background: "#0a0c14" }}
                >
                  <div className="flex items-center gap-5 p-6 pb-5 border-b border-white/[0.06]">
                    <div className="w-14 h-14 rounded-xl bg-white p-1.5 flex-shrink-0 shadow-md">
                      <Logo domain={selectedPartner.domain} name={selectedPartner.name} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl font-bold text-white truncate">{selectedPartner.name}</h2>
                        <span className="text-lg">{selectedPartner.flag}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                          style={{ background: `${sector.color}15`, color: sector.color }}>
                          {sector.icon} {language === "en" ? sector.label : sector.labelFr}
                        </span>
                        <span className="text-[11px] text-white/30">{selectedPartner.country}</span>
                      </div>
                    </div>
                    <button onClick={closeModal} aria-label="Close modal"
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors flex-shrink-0">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { icon: <MapPin className="w-3.5 h-3.5" />,      l: t("HQ","Siège"),        v: selectedPartner.headquarters || selectedPartner.country },
                        { icon: <Calendar className="w-3.5 h-3.5" />,    l: t("Founded","Fondé"),   v: selectedPartner.foundedYear || "—" },
                        { icon: <ShieldCheck className="w-3.5 h-3.5" />, l: t("Compliance","Conf."),v: selectedPartner.compliance || "—" },
                        { icon: <TrendingUp className="w-3.5 h-3.5" />,  l: "ROI",                  v: selectedPartner.roiMetrics ? (language==="en" ? selectedPartner.roiMetrics.en.split("|")[0].trim() : selectedPartner.roiMetrics.fr.split("|")[0].trim()) : "—" },
                      ].map((m, i) => (
                        <div key={i} className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-3">
                          <div className="flex items-center gap-1.5 mb-1" style={{ color: sector.color }}>
                            {m.icon}<span className="text-[9px] font-bold uppercase tracking-widest">{m.l}</span>
                          </div>
                          <p className="text-white/80 text-xs font-medium leading-snug line-clamp-2">{m.v}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2.5">{t("Overview","Aperçu")}</p>
                      <p className="text-white/70 text-sm leading-relaxed">{language === "en" ? selectedPartner.description.en : selectedPartner.description.fr}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">{t("Pricing","Tarification")}</p>
                        <p className="text-white/70 text-[13px] leading-relaxed">{language === "en" ? selectedPartner.pricing.en : selectedPartner.pricing.fr}</p>
                      </div>
                      <div className="rounded-lg p-4" style={{ background: `${sector.color}08`, border: `1px solid ${sector.color}18` }}>
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: sector.color }}>{t("Opportunities","Opportunités")}</p>
                        <p className="text-white/70 text-[13px] leading-relaxed">{language === "en" ? selectedPartner.opportunities.en : selectedPartner.opportunities.fr}</p>
                      </div>
                    </div>
                    <a href={`https://${selectedPartner.domain}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white text-sm font-semibold hover:brightness-110 transition-all"
                      style={{ background: sector.color }}>
                      <Globe className="w-4 h-4" />
                      {t("Visit Website","Visiter le site")}
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>
                  </div>
                </motion.div>
              </div>
            );
          })()}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
