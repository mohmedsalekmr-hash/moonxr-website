"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const CONTACT_CARDS = [
  {
    id: "email",
    borderHover: "hover:border-moon-blue-light/40",
    shadowHover: "hover:shadow-[0_0_40px_rgba(0,122,255,0.15)]",
    gradientHover: "from-moon-blue-light/5",
    iconBg: "bg-moon-blue-dark/50",
    iconBorder: "border-moon-blue-light/20",
    iconGlow: "group-hover:shadow-[0_0_30px_rgba(0,122,255,0.4)]",
    Icon: Mail,
    iconColor: "text-moon-blue-light drop-shadow-[0_0_8px_rgba(0,122,255,0.8)]",
    labelColor: "text-moon-blue-light/80",
  },
  {
    id: "phone",
    borderHover: "hover:border-moon-yellow/40",
    shadowHover: "hover:shadow-[0_0_40px_rgba(251,183,48,0.15)]",
    gradientHover: "from-moon-yellow/5",
    iconBg: "bg-amber-950/50",
    iconBorder: "border-moon-yellow/20",
    iconGlow: "group-hover:shadow-[0_0_30px_rgba(251,183,48,0.4)]",
    Icon: Phone,
    iconColor: "text-moon-yellow drop-shadow-[0_0_8px_rgba(251,183,48,0.8)]",
    labelColor: "text-moon-yellow/80",
  },
  {
    id: "location",
    borderHover: "hover:border-emerald-500/40",
    shadowHover: "hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    gradientHover: "from-emerald-500/5",
    iconBg: "bg-emerald-950/50",
    iconBorder: "border-emerald-500/20",
    iconGlow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]",
    Icon: MapPin,
    iconColor: "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]",
    labelColor: "text-emerald-400/80",
  },
] as const;

export function ContactSection() {
  const { t, language } = useLanguage();

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="max-w-5xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <div className="w-full p-10 md:p-14 flex flex-col justify-center items-center text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight">
              {language === "en" ? (
                <><span className="text-white">Get</span> <span className="text-moon-yellow">in</span> <span className="text-gradient">Touch</span></>
              ) : (
                <><span className="text-white">Contactez</span><span className="text-moon-yellow">-</span><span className="text-gradient">nous</span></>
              )}
            </h2>
            <p className="text-white/60 mb-14 max-w-lg text-lg">
              {t(
                "Ready to revolutionize your enterprise with VR? Reach out to our executive team directly.",
                "Prêt à révolutionner votre entreprise avec la VR ? Contactez directement notre équipe de direction."
              )}
            </p>

            <div className="grid md:grid-cols-3 gap-5 w-full max-w-3xl">
              {CONTACT_CARDS.map(({ id, borderHover, shadowHover, gradientHover, iconBg, iconBorder, iconGlow, Icon, iconColor, labelColor }) => {
                const isEmail = id === "email";
                const isPhone = id === "phone";

                const label = id === "email"
                  ? t("Email Us", "Envoyez un Email")
                  : id === "phone"
                  ? t("Call Us", "Appelez-nous")
                  : t("Location", "Emplacement");

                const content = isEmail ? (
                  <a href="mailto:mohamedsaleck@moon.mr" className="text-white text-base font-medium hover:text-moon-blue-light transition-colors relative z-10 break-all">
                    mohamedsaleck@moon.mr
                  </a>
                ) : isPhone ? (
                  <a href="tel:+22230454777" className="text-white text-base font-medium hover:text-moon-yellow transition-colors relative z-10">
                    +222 30454777
                  </a>
                ) : (
                  <span className="text-white text-base font-medium relative z-10">Nouakchott, Mauritania</span>
                );

                return (
                  <div
                    key={id}
                    className={`relative flex flex-col items-center p-7 bg-transparent rounded-3xl border border-white/5 ${borderHover} ${shadowHover} transition-all duration-500 group overflow-hidden`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradientHover} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-5 ${iconGlow} group-hover:scale-110 transition-all duration-500 border ${iconBorder} relative z-10`}>
                      <Icon className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <p className={`${labelColor} text-[10px] font-bold uppercase tracking-[0.2em] mb-2 relative z-10`}>
                      {label}
                    </p>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
