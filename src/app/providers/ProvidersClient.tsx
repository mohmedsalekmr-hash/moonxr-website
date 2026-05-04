"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Partner } from "@/data/partners";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { X, Globe, MapPin, Calendar, ShieldCheck, TrendingUp, Building2, ExternalLink } from "lucide-react";

// Image component that falls back to Google Favicons if Clearbit fails
const CompanyLogoImage = ({ domain, alt, className }: { domain: string, alt: string, className?: string }) => {
  const [imgSrc, setImgSrc] = useState(`https://logo.clearbit.com/${domain}`);

  return (
    <img 
      src={imgSrc} 
      alt={alt}
      className={className}
      onError={(e) => {
        if (imgSrc.includes('clearbit')) {
          setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=256`);
        } else {
          // If both fail, use UI Avatars as an absolute last resort
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(alt)}&background=9D00FF&color=fff&size=256&bold=true`;
        }
      }}
    />
  );
};

export function ProvidersClient({ partners }: { partners: Partner[] }) {
  const { t, language } = useLanguage();
  const [activeSector, setActiveSector] = useState<string>("All");
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Extract unique sectors
  const sectors = useMemo(() => {
    const allSectors = partners.map(p => p.sector);
    return ["All", ...Array.from(new Set(allSectors))];
  }, [partners]);

  const filteredPartners = useMemo(() => {
    if (activeSector === "All") return partners;
    return partners.filter(p => p.sector === activeSector);
  }, [activeSector, partners]);

  return (
    <div className="flex flex-col space-y-12">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setActiveSector(sector)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeSector === sector 
                ? "bg-purple-600 text-white shadow-lg" 
                : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
            }`}
          >
            {sector === "All" ? t("All Partners", "Tous les Partenaires") : sector}
          </button>
        ))}
      </div>

      {/* Professional Logo Grid */}
      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredPartners.map((partner) => (
            <motion.div
              layout
              key={partner.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="group flex flex-col h-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 rounded-2xl overflow-hidden transition-all shadow-md hover:shadow-purple-500/20"
            >
              {/* Logo Area (White Background for Logo Clarity) */}
              <div className="bg-white/90 p-8 flex items-center justify-center h-40 relative">
                <CompanyLogoImage 
                  domain={partner.domain} 
                  alt={partner.name} 
                  className="max-w-full max-h-20 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105" 
                />
              </div>
              
              {/* Info Area */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-1">{partner.name}</h3>
                  <p className="text-xs text-purple-400 font-medium uppercase tracking-wider">{partner.sector}</p>
                </div>
                
                <div className="mt-auto">
                  <button 
                    onClick={() => setSelectedPartner(partner)}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition-colors shadow-lg"
                  >
                    {t("More Details", "Plus de détails")}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Clean Professional Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPartner(null)}
              className="absolute inset-0 bg-[#0A0A0B]/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#121214] border border-white/10 rounded-2xl shadow-2xl z-10 [&::-webkit-scrollbar]:hidden"
            >
              {/* Header */}
              <div className="sticky top-0 z-20 flex items-center justify-between p-6 bg-[#121214]/90 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner">
                    <CompanyLogoImage 
                      domain={selectedPartner.domain} 
                      alt={selectedPartner.name} 
                      className="max-w-full max-h-full object-contain" 
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                      {selectedPartner.name}
                      <span className="text-xl">{selectedPartner.flag}</span>
                    </h2>
                    <p className="text-purple-400 font-medium text-sm mt-1">{selectedPartner.sector}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPartner(null)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-10">
                <div className="grid md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-8">
                    <section>
                      <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                        <Building2 className="w-5 h-5 text-purple-400" />
                        {t("About the Partnership", "À propos du partenariat")}
                      </h4>
                      <p className="text-white/70 leading-relaxed text-base">
                        {language === "en" ? selectedPartner.description.en : selectedPartner.description.fr}
                      </p>
                    </section>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h4 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">{t("Pricing Model", "Modèle de Tarification")}</h4>
                        <p className="text-white font-medium">
                          {language === "en" ? selectedPartner.pricing.en : selectedPartner.pricing.fr}
                        </p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h4 className="text-white/50 text-xs font-bold uppercase tracking-widest mb-2">{t("Opportunities", "Opportunités")}</h4>
                        <p className="text-white font-medium">
                          {language === "en" ? selectedPartner.opportunities.en : selectedPartner.opportunities.fr}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-5">
                      {selectedPartner.roiMetrics && (
                        <div>
                          <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                            <span>{t("ROI Metrics", "Métriques de ROI")}</span>
                          </div>
                          <p className="text-white font-bold">
                            {language === "en" ? selectedPartner.roiMetrics.en : selectedPartner.roiMetrics.fr}
                          </p>
                        </div>
                      )}
                      
                      {selectedPartner.headquarters && (
                        <div>
                          <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            <span>{t("Headquarters", "Siège Social")}</span>
                          </div>
                          <p className="text-white font-medium">{selectedPartner.headquarters}</p>
                        </div>
                      )}

                      {selectedPartner.foundedYear && (
                        <div>
                          <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <span>{t("Founded", "Fondation")}</span>
                          </div>
                          <p className="text-white font-medium">{selectedPartner.foundedYear}</p>
                        </div>
                      )}

                      {selectedPartner.compliance && (
                        <div>
                          <div className="flex items-center gap-2 text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                            <ShieldCheck className="w-4 h-4 text-purple-400" />
                            <span>{t("Compliance", "Conformité")}</span>
                          </div>
                          <p className="text-white font-medium">{selectedPartner.compliance}</p>
                        </div>
                      )}
                    </div>

                    <a 
                      href={`https://${selectedPartner.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg flex items-center justify-center space-x-2"
                    >
                      <Globe className="w-5 h-5" />
                      <span>{t("Visit Website", "Visiter le site web")}</span>
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
