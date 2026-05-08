"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const Counter = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const incrementTime = 30;
      const step = Math.ceil(value / (duration / incrementTime));

      const timer = setInterval(() => {
        start += step;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">
      {count}{suffix}
    </span>
  );
};

export function ImpactMetrics() {
  const { t } = useLanguage();
  return (
    <section className="py-20 relative z-10 border-t border-b border-white/5 bg-gradient-to-b from-transparent to-brand-dark/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6">
            <Counter value={75} suffix="%" />
            <p className="text-cyan-400 font-semibold mt-4 tracking-widest uppercase text-sm">
              {t("Knowledge Retention", "Rétention des Connaissances")}
            </p>
            <p className="text-white/50 text-sm mt-2">{t("Compared to 20% in traditional training", "Comparé à 20% en formation classique")}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="p-6">
            <Counter value={45} suffix="%" />
            <p className="text-purple-400 font-semibold mt-4 tracking-widest uppercase text-sm">
              {t("Safety Risk Reduction", "Réduction des Risques")}
            </p>
            <p className="text-white/50 text-sm mt-2">{t("Immediate drop in workplace incidents", "Baisse immédiate des accidents de travail")}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="p-6">
            <Counter value={50} suffix="%" />
            <p className="text-emerald-400 font-semibold mt-4 tracking-widest uppercase text-sm">
              {t("TCO Savings", "Économies TCO")}
            </p>
            <p className="text-white/50 text-sm mt-2">{t("Lower infrastructure and travel costs", "Baisse des coûts d'infrastructure et de voyage")}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
