/* eslint-disable @next/next/no-img-element */
"use client";

import { partnersData, Partner } from "@/data/partners";
import { getProvidersAction } from "@/app/actions";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useMemo, useEffect } from "react";





function Logo({ domain, name, logoUrl }: { domain: string; name: string; logoUrl?: string }) {
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [failed, setFailed] = useState(false);
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  
  const srcs = useMemo(() => {
    const list = [];
    if (logoUrl) list.push(logoUrl);
    list.push(`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${domain.startsWith('http') ? domain : 'https://' + domain}&size=128`);
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

function PartnerCard({ partner }: { partner: Partner }) {
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

  const rawUrl = partner.url || "";
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
      className="group relative flex flex-col items-center rounded-3xl overflow-hidden cursor-pointer border border-white/[0.08] bg-white/[0.03] hover:border-white/20 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] w-full h-[195px] p-3"
    >
      {/* Top hover accent line */}
      <div className="absolute top-0 inset-x-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-500 to-blue-500" />
      
      {/* Centered logo inside a white canvas */}
      <div className="w-full flex-1 bg-white rounded-2xl flex items-center justify-center p-4 transition-transform duration-300 group-hover:scale-[1.03] shadow-inner">
        <Logo domain={partner.url} name={partner.name} logoUrl={partner.logo_url} />
      </div>

      {/* Company Name */}
      <p
        className="w-full text-center text-[12px] font-bold text-white/70 group-hover:text-cyan-300 transition-colors mt-2.5 leading-snug truncate px-1 flex-shrink-0"
        title={partner.name}
      >
        {partner.name}
      </p>
    </motion.a>
  );
}

export function ProvidersClient({ partners: initialPartners = partnersData }: { partners?: Partner[] }) {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);

  useEffect(() => {
    async function load() {
      const data = await getProvidersAction();
      console.log("ProvidersClient loaded partners from server action:", data);
      if (data) {
        setPartners(data);
      }
    }
    load();
  }, []);

  const activePartners = useMemo(() => partners.filter(p => p.is_visible !== false), [partners]);

  return (
    <div className="space-y-12">
      {/* Grid */}
      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <AnimatePresence mode="popLayout">
          {activePartners.map(partner => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
