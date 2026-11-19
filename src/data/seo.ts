import type { PageKey, T } from "./i18n";

/**
 * How each page appears in Google and when its link is shared (WhatsApp, LinkedIn…).
 * Edited in the admin («الظهور والمشاركة»). Project pages use their own title, intro and cover.
 */
export type SeoPage = "home" | PageKey;
export type SeoEntry = { title: T; desc: T; image?: string };
export type Seo = Record<SeoPage, SeoEntry>;

/** The picture used when a page has none of its own (1200 × 630). */
export const DEFAULT_SHARE_IMAGE = "/media/og/moonxr-share.png";

export const seo: Seo = {
  home: {
    title: {
      fr: "Moon XR — La réalité virtuelle en Mauritanie",
      ar: "Moon XR — الواقع الافتراضي في موريتانيا",
      en: "Moon XR — Virtual reality in Mauritania",
    },
    desc: {
      fr: "Division technologie immersive de Moon Technology : événements VR, simulateurs de formation et accompagnement sur site, à Nouakchott.",
      ar: "قسم التقنيات التفاعلية في Moon Technology: فعاليات الواقع الافتراضي، ومحاكيات التدريب، والمرافقة في الموقع.",
      en: "The immersive technology division of Moon Technology: VR events, training simulators and on-site support, in Nouakchott.",
    },
  },
  projets: {
    title: { fr: "Projets", ar: "أعمالنا", en: "Projects" },
    desc: {
      fr: "Événements, simulateurs de formation et une application maison — des projets réalisés en Mauritanie.",
      ar: "فعاليات، ومحاكيات تدريب، وتطبيق من تطويرنا — مشاريع نفّذناها في موريتانيا.",
      en: "Events, training simulators and an in-house application — projects delivered in Mauritania.",
    },
  },
  services: {
    title: { fr: "Services", ar: "خدماتنا", en: "Services" },
    desc: {
      fr: "Quatre services, du premier échange jusqu'au suivi sur place.",
      ar: "أربع خدمات، من أول لقاء حتى المتابعة في الموقع.",
      en: "Four services, from the first conversation to on-site follow-up.",
    },
  },
  partenaires: {
    title: { fr: "Partenaires", ar: "شركاؤنا", en: "Partners" },
    desc: {
      fr: "Des clients de premier plan, des partenaires engagés et les technologies de fournisseurs reconnus dans le monde entier.",
      ar: "عملاء بارزون، وشركاء ملتزمون، وتقنيات من مزوّدين معروفين حول العالم.",
      en: "Leading clients, committed partners and technologies from suppliers recognised worldwide.",
    },
  },
  "a-propos": {
    title: { fr: "À propos", ar: "من نحن", en: "About" },
    desc: {
      fr: "La division technologie immersive de Moon Technology.",
      ar: "قسم التقنيات التفاعلية في Moon Technology.",
      en: "The immersive technology division of Moon Technology.",
    },
  },
  contact: {
    title: { fr: "Contact", ar: "تواصل معنا", en: "Contact" },
    desc: {
      fr: "Parlez-nous de votre projet. Réponse sous 48 h.",
      ar: "حدّثونا عن مشروعكم، ونرد خلال 48 ساعة.",
      en: "Tell us about your project. Reply within 48 hours.",
    },
  },
};
