"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { partnersData, Partner } from "@/data/partners";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Zap, Shield, Anchor, Building2, GraduationCap, HeartPulse, X, Globe } from "lucide-react";

const getSectorIcon = (sector: string) => {
  if (sector.includes("Oil")) return <Zap className="w-5 h-5 text-amber-400" />;
  if (sector.includes("Mining")) return <Shield className="w-5 h-5 text-orange-400" />;
  if (sector.includes("Maritime")) return <Anchor className="w-5 h-5 text-blue-400" />;
  if (sector.includes("Construction")) return <Building2 className="w-5 h-5 text-yellow-400" />;
  if (sector.includes("Education")) return <GraduationCap className="w-5 h-5 text-purple-400" />;
  if (sector.includes("Medicine")) return <HeartPulse className="w-5 h-5 text-rose-400" />;
  return <Zap className="w-5 h-5 text-cyan-400" />;
};

export function Partners() {
  const { t, language } = useLanguage();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Group by sector
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
                {t("Strategic ", "Partenariats ")}<span className="text-gradient">{t("Partnerships", "Stratégiques")}</span>
              </h2>
              <p className="text-white/60 text-lg">
                {t(
                  "Exclusive access to the world's leading XR hardware and software innovators, ready for localization and deployment in Mauritania.",
                  "Accès exclusif aux principaux innovateurs mondiaux de matériel et de logiciels XR, prêts pour la localisation et le déploiement en Mauritanie."
                )}
              </p>
            </motion.div>
          </div>

          <div id="sectors" className="space-y-20 scroll-mt-24">
            {sectors.map((sectorName) => {
              const sectorPartners = partnersData.filter((p) => p.sector === sectorName);
              
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
                      {sectorName === "Oil, Gas, and Energy Industry" && t("Oil, Gas, and Energy", "Pétrole, Gaz et Énergie")}
                      {sectorName === "Mining and Resource Extraction" && t("Mining & Extraction", "Mines et Extraction")}
                      {sectorName === "Fisheries and Maritime Navigation" && t("Maritime Navigation", "Navigation Maritime")}
                      {sectorName === "Construction and Engineering" && t("Construction & Engineering", "Construction et Ingénierie")}
                      {sectorName === "Technical and Vocational Education (TVET)" && t("Technical & Vocational Ed", "Enseignement Technique (TVET)")}
                      {sectorName === "Medicine and Healthcare" && t("Medicine & Healthcare", "Médecine et Santé")}
                    </h3>
                  </motion.div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectorPartners.map((partner, index) => (
                      <motion.div
                        key={partner.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedPartner(partner)}
                        className="glass-panel p-6 rounded-2xl hover:bg-white/10 transition-all group flex flex-col h-full cursor-pointer hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-6">
                            <motion.div 
                              className="w-16 h-16 flex items-center justify-center"
                              animate={{ y: [0, -6, 0] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                            >
                              <img 
                                src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${partner.domain}&size=128`} 
                                alt={`${partner.name} logo`}
                                className="max-w-full max-h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = `<span class="text-white font-bold text-xl text-center leading-tight drop-shadow-md">${partner.name.charAt(0)}</span>`;
                                }}
                              />
                            </motion.div>
                            <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded text-white/70 border border-white/5 flex items-center gap-1">
                              <span>{partner.flag}</span> <span>{partner.country}</span>
                            </span>
                          </div>

                          <h4 className="text-xl font-bold mb-3 flex items-center group-hover:text-cyan-400 transition-colors">
                            {partner.name}
                            <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h4>

                          <p className="text-sm text-white/70 mb-6 line-clamp-3">
                            {language === "en" ? partner.description.en : partner.description.fr}
                          </p>
                          
                          <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center text-cyan-400 text-sm font-medium">
                            <span>{t("View Details", "Voir les Détails")}</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
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

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedPartner && (
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
              className="relative w-full max-w-3xl bg-[#0A0A0B] border border-white/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="relative p-8 pb-6 border-b border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <button 
                  onClick={() => setSelectedPartner(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-6">
                  <motion.div 
                    className="w-20 h-20 flex items-center justify-center shrink-0"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <img 
                      src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${selectedPartner.domain}&size=128`} 
                      alt={`${selectedPartner.name} logo`}
                      className="max-w-full max-h-full object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<span class="text-white font-bold text-3xl text-center leading-tight drop-shadow-lg">${selectedPartner.name.charAt(0)}</span>`;
                      }}
                    />
                  </motion.div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-3xl font-display font-bold text-white">{selectedPartner.name}</h3>
                      <span className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs text-white/80 flex items-center gap-2">
                        <span className="text-base">{selectedPartner.flag}</span> <span>{selectedPartner.country}</span>
                      </span>
                    </div>
                    <p className="text-cyan-400 font-medium text-sm flex items-center">
                      {getSectorIcon(selectedPartner.sector)}
                      <span className="ml-2">{selectedPartner.sector}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto space-y-8 flex-grow custom-scrollbar">
                
                {/* Metrics Bar */}
                <div className="flex flex-wrap items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex-1 min-w-[120px]">
                    <span className="block text-[10px] uppercase text-white/40 tracking-wider mb-1">HQ / Founded</span>
                    <span className="text-white/80 font-medium text-sm">{selectedPartner.headquarters || selectedPartner.country} • Est. {selectedPartner.foundedYear || "2010s"}</span>
                  </div>
                  <div className="h-8 w-px bg-white/10 hidden sm:block" />
                  <div className="flex-1 min-w-[120px]">
                    <span className="block text-[10px] uppercase text-white/40 tracking-wider mb-1">Compliance</span>
                    <span className="text-emerald-400 font-medium text-sm">{selectedPartner.compliance || "ISO 9001 / OSHA Aligned"}</span>
                  </div>
                  <div className="h-8 w-px bg-white/10 hidden sm:block" />
                  <div className="flex-1 min-w-[120px]">
                    <span className="block text-[10px] uppercase text-white/40 tracking-wider mb-1">ROI Metrics</span>
                    <span className="text-cyan-400 font-medium text-sm">
                      {language === "en" ? selectedPartner.roiMetrics?.en : selectedPartner.roiMetrics?.fr}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 mr-2" />
                    {t("Strategic Overview", "Aperçu Stratégique")}
                  </h4>
                  <p className="text-white/90 text-lg leading-relaxed bg-[#0A0A0B] p-5 rounded-2xl border border-white/5 shadow-inner">
                    {language === "en" ? selectedPartner.description.en : selectedPartner.description.fr}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors shadow-lg">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
                      {t("Financial Architecture", "Architecture Financière")}
                    </h4>
                    <p className="text-white/80 leading-relaxed text-sm">
                      {language === "en" ? selectedPartner.pricing.en : selectedPartner.pricing.fr}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-colors shadow-lg">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">
                      {t("Distribution Opportunity", "Opportunité de Distribution")}
                    </h4>
                    <p className="text-white/80 leading-relaxed text-sm">
                      {language === "en" ? selectedPartner.opportunities.en : selectedPartner.opportunities.fr}
                    </p>
                  </div>
                </div>

              </div>

              {/* Modal Footer / CTA */}
              <div className="p-6 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-white/50 text-center sm:text-left">
                  {t(
                    "Ready to engage with this partner for Mauritania?", 
                    "Prêt à engager ce partenaire pour la Mauritanie ?"
                  )}
                </p>
                <a 
                  href={`https://${selectedPartner.domain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full text-white font-bold transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] w-full sm:w-auto"
                >
                  <Globe className="w-5 h-5" />
                  <span>{t("Visit Website", "Visiter le Site Web")}</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
