/* eslint-disable @next/next/no-img-element */
"use client";

import { useLanguage } from "@/context/LanguageContext";
import { partnersData, Partner, Category } from "@/data/partners";
import { getProvidersAction, getCategoriesAction } from "@/app/actions";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import * as Icons from "lucide-react";

const resolveSector = (sectorName: string, categories: Category[], lang: string) => {
  const matched = categories.find(c => c.nameFr === sectorName || c.nameEn === sectorName || c.id === sectorName);
  
  const sColor = matched?.color || "#3b82f6";
  const sLabel = lang === 'en' ? (matched?.nameEn || sectorName) : (matched?.nameFr || sectorName);
  const sIconStr = matched?.icon || "🌐";

  return {
    color: sColor,
    label: sLabel,
    iconStr: sIconStr
  };
};

const renderSectorIcon = (iconStr: string, className = "w-4 h-4") => {
  if (!iconStr) return <Icons.Zap className={className} />;
  // Emojis
  if (iconStr.length <= 2 || !/^[A-Za-z]+$/.test(iconStr)) {
    return <span className="text-sm leading-none flex items-center justify-center">{iconStr}</span>;
  }
  const IconComponent = (Icons as any)[iconStr];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  return <Icons.Zap className={className} />;
};

function Logo({ domain, name, logoUrl }: { domain: string; name: string; logoUrl?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [failed, setFailed] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  
  const srcs = useMemo(() => {
    const list = [];
    if (logoUrl) list.push(logoUrl);
    list.push(`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`);
    list.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    return list;
  }, [logoUrl, domain]);

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

function PartnerCard({ partner, lang, categories }: { partner: Partner; lang: string; categories: Category[] }) {
  const sector = useMemo(() => resolveSector(partner.sector, categories, lang), [partner.sector, categories, lang]);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const rawUrl = partner.domain || "";
  const targetUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://") 
    ? rawUrl 
    : `https://${rawUrl}`;

  return (
    <motion.a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer border border-white/[0.08] bg-white/[0.03] hover:border-white/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] text-left"
    >
      <div className="relative h-36 bg-white flex items-center justify-center p-6">
        <div className="absolute top-0 inset-x-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, ${sector.color}, transparent)` }} />
        <div className="w-16 h-16 transition-transform duration-300 group-hover:scale-110">
          <Logo domain={partner.domain} name={partner.name} logoUrl={partner.logoUrl} />
        </div>
      </div>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-white leading-tight line-clamp-2">{partner.name}</h3>
          <span className="text-base flex-shrink-0 mt-0.5">{partner.flag}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: `${sector.color}15`, color: sector.color, border: `1px solid ${sector.color}25` }}>
            {renderSectorIcon(sector.iconStr)}
            {sector.label}
          </span>
        </div>
        {partner.description && (partner.description.en || partner.description.fr) ? (
          <p className="text-[13px] text-white/45 leading-relaxed line-clamp-2 flex-1">
            {lang === "en" ? partner.description.en : partner.description.fr}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        <div className="flex items-center gap-1 text-[13px] font-medium text-white/30 group-hover:text-white/70 transition-colors pt-2 border-t border-white/[0.06]">
          <span>{lang === "en" ? "Visit Website" : "Visiter le site"}</span>
          <Icons.ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </motion.a>
  );
}

export function ProvidersClient({ partners: initialPartners = partnersData }: { partners?: Partner[] }) {
  const { t, language } = useLanguage();
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeSector, setActiveSector] = useState("All");

  useEffect(() => {
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
  const sectors = useMemo(() => ["All", ...Array.from(new Set(activePartners.map(p => p.sector)))], [activePartners]);
  const filteredPartners = useMemo(() => activeSector === "All" ? activePartners : activePartners.filter(p => p.sector === activeSector), [activeSector, activePartners]);

  return (
    <div className="space-y-12">
      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-8 text-center">
        {[
          { n: activePartners.length,                      label: t("Global Partners","Partenaires Mondiaux") },
          { n: categories.length || sectors.length - 1,   label: t("Industry Sectors","Secteurs Industriels") },
          { n: new Set(activePartners.map(p => p.country)).size, label: t("Countries","Pays") },
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
          const s = sector !== "All" ? resolveSector(sector, categories, language) : null;
          return (
            <button key={sector} onClick={() => setActiveSector(sector)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${isActive ? "bg-white/10 text-white border-white/20 shadow-lg" : "bg-transparent text-white/40 border-white/[0.06] hover:text-white/70 hover:bg-white/5 hover:border-white/10"}`}>
              {s && <span style={{ color: isActive ? s.color : undefined }}>{renderSectorIcon(s.iconStr)}</span>}
              {sector === "All" ? t("All Sectors","Tous les Secteurs") : (s?.label ?? sector)}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredPartners.map(partner => (
            <PartnerCard key={partner.id} partner={partner} lang={language} categories={categories} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
