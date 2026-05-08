/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { partnersData, Partner } from "@/data/partners";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Zap, Shield, Anchor, Building2, GraduationCap, HeartPulse, X, Globe } from "lucide-react";

// ── Sector theme config ────────────────────────────────────────────────────────
const SECTOR_THEMES: Record<string, { gradient: string; accent: string; iconColor: string; glowColor: string }> = {
  "Oil, Gas, and Energy Industry": {
    gradient: "from-amber-600/30 via-orange-700/20 to-yellow-900/10",
    accent: "#f59e0b",
    iconColor: "text-amber-400",
    glowColor: "rgba(245,158,11,0.4)",
  },
  "Mining and Resource Extraction": {
    gradient: "from-orange-700/30 via-red-800/20 to-stone-900/10",
    accent: "#fb923c",
    iconColor: "text-orange-400",
    glowColor: "rgba(251,146,60,0.4)",
  },
  "Fisheries and Maritime Navigation": {
    gradient: "from-blue-600/30 via-cyan-700/20 to-sky-900/10",
    accent: "#38bdf8",
    iconColor: "text-sky-400",
    glowColor: "rgba(56,189,248,0.4)",
  },
  "Construction and Engineering": {
    gradient: "from-yellow-600/30 via-lime-700/20 to-green-900/10",
    accent: "#a3e635",
    iconColor: "text-lime-400",
    glowColor: "rgba(163,230,53,0.4)",
  },
  "Technical and Vocational Education (TVET)": {
    gradient: "from-purple-600/30 via-violet-700/20 to-indigo-900/10",
    accent: "#a78bfa",
    iconColor: "text-purple-400",
    glowColor: "rgba(167,139,250,0.4)",
  },
  "Medicine and Healthcare": {
    gradient: "from-rose-600/30 via-pink-700/20 to-red-900/10",
    accent: "#fb7185",
    iconColor: "text-rose-400",
    glowColor: "rgba(251,113,133,0.4)",
  },
};

function getTheme(sector: string) {
  return SECTOR_THEMES[sector] ?? {
    gradient: "from-cyan-600/30 via-blue-700/20 to-indigo-900/10",
    accent: "#22d3ee",
    iconColor: "text-cyan-400",
    glowColor: "rgba(34,211,238,0.4)",
  };
}

const getSectorIcon = (sector: string) => {
  if (sector.includes("Oil")) return <Zap className="w-5 h-5 text-amber-400" />;
  if (sector.includes("Mining")) return <Shield className="w-5 h-5 text-orange-400" />;
  if (sector.includes("Maritime")) return <Anchor className="w-5 h-5 text-blue-400" />;
  if (sector.includes("Construction")) return <Building2 className="w-5 h-5 text-yellow-400" />;
  if (sector.includes("Education")) return <GraduationCap className="w-5 h-5 text-purple-400" />;
  if (sector.includes("Medicine")) return <HeartPulse className="w-5 h-5 text-rose-400" />;
  return <Zap className="w-5 h-5 text-cyan-400" />;
};

// ── Beautiful partner card logo / cover ───────────────────────────────────────
function PartnerCover({ partner, size = "card" }: { partner: Partner; size?: "card" | "modal" }) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const theme = getTheme(partner.sector);

  const isModal = size === "modal";
  const coverH = isModal ? "h-32" : "h-28";
  const logoW  = isModal ? "w-16 h-16" : "w-12 h-12";

  // Build initials from name (up to 2 chars)
  const initials = partner.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={`relative w-full ${coverH} rounded-xl overflow-hidden flex-shrink-0 mb-4`}>
      {/* Gradient background always visible */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(${theme.accent}22 1px, transparent 1px), linear-gradient(90deg, ${theme.accent}22 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Corner glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-50"
        style={{ background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)` }}
      />

      {/* Centered logo or initials */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div
          className={`${logoW} rounded-xl flex items-center justify-center bg-black/30 border border-white/10 backdrop-blur-sm overflow-hidden`}
        >
          {!logoFailed ? (
            <>
              {/* Initials shown until real logo loads */}
              {!logoLoaded && (
                <span className="text-white font-bold text-lg leading-none select-none absolute z-0">{initials}</span>
              )}
              <Image
                src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${partner.domain}&size=128`}
                alt={partner.name}
                width={128}
                height={128}
                loading="eager"
                decoding="async"
                className={`w-full h-full object-contain relative z-10 ${logoLoaded ? "opacity-100" : ""}`}
                onLoad={() => setLogoLoaded(true)}
                onError={() => setLogoFailed(true)}
              />
            </>
          ) : (
            <span className="text-white font-bold text-lg leading-none select-none">{initials}</span>
          )}
        </div>

        {/* Company name on cover */}
        <span
          className="text-xs font-bold tracking-wider uppercase px-3 py-0.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10"
          style={{ color: theme.accent }}
        >
          {partner.country}
        </span>
      </div>

      {/* Bottom fade into card body */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}

// ── Main Partners component ────────────────────────────────────────────────────
export function Partners() {
  const { t, language } = useLanguage();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const sectors = Array.from(new Set(partnersData.map((p) => p.sector)));

  return (
    <>
      <section id="partners" className="py-24 relative z-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                {t("Strategic ", "Partenariats ")}
                <span className="text-gradient">{t("Partnerships", "Stratégiques")}</span>
              </h2>
              <p className="text-white/60 text-lg">
                {t(
                  "Exclusive access to the world's leading XR hardware and software innovators, ready for localization and deployment in Mauritania.",
                  "Accès exclusif aux innovateurs mondiaux de premier plan en matériel et logiciels XR, prêts pour la localisation et le déploiement en Mauritanie."
                )}
              </p>
            </motion.div>
          </div>

          <div id="sectors" className="space-y-20 scroll-mt-24">
            {sectors.map((sectorName) => {
              const sectorPartners = partnersData.filter((p) => p.sector === sectorName);
              const theme = getTheme(sectorName);

              return (
                <div key={sectorName} className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3 pb-4 border-b border-white/10"
                  >
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                      {getSectorIcon(sectorName)}
                    </div>
                    <h3 className="text-2xl font-semibold text-white/90">
                      {sectorName === "Oil, Gas, and Energy Industry"            && t("Oil, Gas, and Energy",          "Pétrole, Gaz et Énergie")}
                      {sectorName === "Mining and Resource Extraction"            && t("Mining & Extraction",           "Mines et Extraction")}
                      {sectorName === "Fisheries and Maritime Navigation"         && t("Maritime Navigation",           "Navigation Maritime")}
                      {sectorName === "Construction and Engineering"              && t("Construction & Engineering",    "Construction et Ingénierie")}
                      {sectorName === "Technical and Vocational Education (TVET)" && t("Technical & Vocational Ed",     "Enseignement Technique (TVET)")}
                      {sectorName === "Medicine and Healthcare"                  && t("Medicine & Healthcare",         "Médecine et Santé")}
                    </h3>
                  </motion.div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectorPartners.map((partner, index) => (
                      <motion.div
                        key={partner.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.3 }}
                        onClick={() => setSelectedPartner(partner)}
                        className="glass-panel rounded-2xl flex flex-col cursor-pointer group relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_32px_rgba(0,122,255,0.18)]"
                        style={{ willChange: "transform, opacity",
                          ["--hover-border" as string]: theme.accent,
                        }}
                      >
                        {/* Hover border glow */}
                        <div
                          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                          style={{ boxShadow: `inset 0 0 0 1px ${theme.accent}55` }}
                        />

                        {/* Cover image / gradient */}
                        <div className="px-4 pt-4">
                          <PartnerCover partner={partner} size="card" />
                        </div>

                        {/* Card body */}
                        <div className="px-5 pb-5 flex flex-col flex-1">
                          <h4 className="text-lg font-bold mb-2 flex items-center transition-colors group-hover:text-cyan-300">
                            {partner.name}
                            <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h4>

                          <p className="text-sm text-white/60 mb-4 line-clamp-3 leading-relaxed flex-1">
                            {language === "en" ? partner.description.en : partner.description.fr}
                          </p>

                          <div className="pt-3 border-t border-white/10 flex justify-between items-center"
                            style={{ color: theme.accent }}>
                            <span className="text-xs font-semibold uppercase tracking-widest">
                              {t("View Details", "Voir les Détails")}
                            </span>
                            <span className="group-hover:translate-x-1 transition-transform text-sm">→</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Modal ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedPartner && (() => {
          const theme = getTheme(selectedPartner.sector);
          return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedPartner(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="relative w-full max-w-3xl bg-brand-dark border border-white/20 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col max-h-[90vh]"
              >
                {/* Modal Cover */}
                <div className="relative w-full h-36 overflow-hidden flex-shrink-0">
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `linear-gradient(${theme.accent}22 1px, transparent 1px), linear-gradient(90deg, ${theme.accent}22 1px, transparent 1px)`,
                      backgroundSize: "32px 32px",
                    }}
                  />
                  <div
                    className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-50"
                    style={{ background: `radial-gradient(circle, ${theme.glowColor} 0%, transparent 70%)` }}
                  />
                  <div className="absolute inset-0 flex items-center px-8 gap-5">
                    {/* Logo box */}
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-black/40 border border-white/10 backdrop-blur-sm overflow-hidden flex-shrink-0">
                      <PartnerLogoOnly partner={selectedPartner} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-2xl font-display font-bold text-white">{selectedPartner.name}</h3>
                        <span className="px-2 py-0.5 bg-black/30 border border-white/10 rounded-full text-xs text-white/80 flex items-center gap-1.5">
                          <span>{selectedPartner.flag}</span><span>{selectedPartner.country}</span>
                        </span>
                      </div>
                      <p className="text-sm flex items-center gap-1.5" style={{ color: theme.accent }}>
                        {getSectorIcon(selectedPartner.sector)}
                        <span>{selectedPartner.sector}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPartner(null)}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/30 transition-colors text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-brand-dark to-transparent" />
                </div>

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto space-y-6 flex-grow custom-scrollbar">
                  {/* Metrics Bar */}
                  <div className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex-1 min-w-[120px]">
                      <span className="block text-[10px] uppercase text-white/40 tracking-wider mb-1">HQ / Founded</span>
                      <span className="text-white/80 font-medium text-sm">
                        {selectedPartner.headquarters || selectedPartner.country} • Est. {selectedPartner.foundedYear || "2010s"}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-white/10 hidden sm:block" />
                    <div className="flex-1 min-w-[120px]">
                      <span className="block text-[10px] uppercase text-white/40 tracking-wider mb-1">Compliance</span>
                      <span className="text-emerald-400 font-medium text-sm">{selectedPartner.compliance || "ISO 9001 / OSHA"}</span>
                    </div>
                    <div className="h-8 w-px bg-white/10 hidden sm:block" />
                    <div className="flex-1 min-w-[120px]">
                      <span className="block text-[10px] uppercase text-white/40 tracking-wider mb-1">ROI Metrics</span>
                      <span className="font-medium text-sm" style={{ color: theme.accent }}>
                        {language === "en" ? selectedPartner.roiMetrics?.en : selectedPartner.roiMetrics?.fr}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center">
                      <span className="w-2 h-2 rounded-full mr-2" style={{ background: theme.accent }} />
                      {t("Strategic Overview", "Aperçu Stratégique")}
                    </h4>
                    <p className="text-white/85 text-base leading-relaxed bg-white/3 p-5 rounded-2xl border border-white/5">
                      {language === "en" ? selectedPartner.description.en : selectedPartner.description.fr}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-5">
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: theme.accent }}>
                        {t("Financial Architecture", "Architecture Financière")}
                      </h4>
                      <p className="text-white/75 text-sm leading-relaxed">
                        {language === "en" ? selectedPartner.pricing.en : selectedPartner.pricing.fr}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-5">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">
                        {t("Distribution Opportunity", "Opportunité de Distribution")}
                      </h4>
                      <p className="text-white/75 text-sm leading-relaxed">
                        {language === "en" ? selectedPartner.opportunities.en : selectedPartner.opportunities.fr}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="p-6 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-sm text-white/50">
                    {t("Ready to engage with this partner for Mauritania?", "Prêt à engager ce partenaire pour la Mauritanie ?")}
                  </p>
                  <a
                    href={`https://${selectedPartner.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold transition-all hover:opacity-90 w-full sm:w-auto justify-center"
                    style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}99)` }}
                  >
                    <Globe className="w-4 h-4" />
                    {t("Visit Website", "Visiter le Site Web")}
                  </a>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}

// Small helper: just the logo image/initial for modal header box
function PartnerLogoOnly({ partner }: { partner: Partner }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const initials = partner.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  if (failed) return <span className="text-white font-bold text-xl">{initials}</span>;

  return (
    <>
      {!loaded && <span className="text-white font-bold text-xl absolute z-0">{initials}</span>}
      <Image
        src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${partner.domain}&size=128`}
        alt={partner.name}
        width={128}
        height={128}
        loading="eager"
        decoding="async"
        className={`w-full h-full object-contain relative z-10 ${loaded ? "opacity-100" : ""}`}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  );
}
