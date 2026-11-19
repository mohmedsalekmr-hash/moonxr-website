import type { T } from "./i18n";

/** Texts of the «À propos» page (editable in /admin → نصوص الموقع). */
export const aboutPage = {
  title: {
    fr: "La division technologie immersive de Moon Technology.",
    ar: "قسم التقنيات التفاعلية في Moon Technology.", en: "The immersive technology division of Moon Technology.",
  },
  sub: {
    fr: "Moon XR apporte la réalité virtuelle et augmentée aux entreprises, aux écoles et aux événements en Mauritanie. Nous choisissons la bonne technologie, nous l'installons et nous restons à vos côtés.",
    ar: "يقدّم Moon XR الواقع الافتراضي والمعزّز للشركات والمدارس والفعاليات في موريتانيا. نختار التقنية المناسبة، ونركّبها، ونبقى إلى جانبكم.", en: "Moon XR brings virtual and augmented reality to companies, schools and events in Mauritania. We choose the right technology, install it and stay by your side.",
  },
  sectors: { fr: "Secteurs", ar: "القطاعات", en: "Sectors" },
  sectorList: {
    fr: [
      "Télécoms & marques",
      "Industrie & sécurité",
      "Formation professionnelle",
      "Éducation",
    ],
    ar: [
      "الاتصالات والعلامات التجارية",
      "الصناعة والسلامة",
      "التكوين المهني",
      "التعليم",
    ], en: ["Telecoms & brands", "Industry & safety", "Vocational training", "Education"],
  },
  where: {
    fr: "Basés à Nouakchott, présents dans tout le pays",
    ar: "مقرّنا نواكشوط، ونعمل في كل البلاد", en: "Based in Nouakchott, active across the country",
  },
  whereText: {
    fr: "Notre équipe se déplace pour installer, former et accompagner sur site, partout en Mauritanie.",
    ar: "ينتقل فريقنا للتركيب والتدريب والمرافقة في الموقع، في كل أنحاء موريتانيا.", en: "Our team travels to install, train and support on site, anywhere in Mauritania.",
  },
  pillars: {
    kicker: { fr: "Notre engagement", ar: "التزامنا", en: "Our commitment" },
    title: {
      fr: "Une technologie de pointe, une équipe sur place, une expérience sans faille.",
      ar: "تقنية متقدمة، وفريق في الموقع، وتجربة بلا أخطاء.", en: "Cutting-edge technology, a team on site, a flawless experience.",
    },
    items: [
      {
        t: { fr: "Clé en main", ar: "حل متكامل", en: "Turnkey" },
        d: {
          fr: "Casques, contenus, installation et animation : nous prenons tout en charge, du premier échange au dernier visiteur.",
          ar: "النظارات والمحتوى والتركيب والإدارة: نتكفّل بكل شيء، من أول لقاء إلى آخر زائر.", en: "Headsets, content, installation and hosting: we handle everything, from the first conversation to the last visitor.",
        },
      },
      {
        t: { fr: "Équipe locale", ar: "فريق محلي", en: "Local team" },
        d: {
          fr: "Basés à Nouakchott, nous installons, formons et restons joignables après la livraison.",
          ar: "مقرّنا نواكشوط: نركّب وندرّب ونبقى قريبين منكم بعد التسليم.", en: "Based in Nouakchott, we install, train and stay reachable after delivery.",
        },
      },
      {
        t: { fr: "Technologies éprouvées", ar: "تقنيات موثوقة", en: "Proven technologies" },
        d: {
          fr: "Des solutions de constructeurs reconnus, choisies pour chaque besoin et chaque public.",
          ar: "حلول من مصنّعين معروفين، نختارها لكل حاجة ولكل جمهور.", en: "Solutions from recognised manufacturers, chosen for each need and each audience.",
        },
      },
      {
        t: { fr: "Sécurité & hygiène", ar: "السلامة والنظافة", en: "Safety & hygiene" },
        d: {
          fr: "Un accompagnateur à chaque poste et des casques nettoyés entre chaque visiteur.",
          ar: "مرافق عند كل نظارة، وتنظيف النظارات بين كل زائر وآخر.", en: "A guide at every station and headsets cleaned between visitors.",
        },
      },
    ],
  },
};

/** Titles of the «Partenaires» page. */
export const partnersPage = {
  kicker: { fr: "Notre écosystème", ar: "منظومتنا", en: "Our ecosystem" },
  title: {
    fr: "Clients, partenaires, technologies.",
    ar: "عملاؤنا، شركاؤنا، تقنياتنا.", en: "Clients, partners, technologies.",
  },
  sub: {
    fr: "Ceux qui nous font confiance, et ce que nous installons.",
    ar: "من وثق بنا، وما نركّبه لهم.", en: "Those who trust us, and what we install.",
  },
  clientsTitle: { fr: "Ils nous font confiance.", ar: "وثقوا بنا.", en: "They trust us." },
  partnersTitle: { fr: "Nos partenaires.", ar: "شركاؤنا.", en: "Our partners." },
  techTitle: {
    fr: "Nos technologies.",
    ar: "تقنياتنا.", en: "Our technologies.",
  },
  techSub: {
    fr: "Survolez un logo pour découvrir ce que chaque fournisseur apporte.",
    ar: "مرّر المؤشر على شعار لتعرف ما يقدّمه كل مزوّد.", en: "Hover over a logo to see what each supplier brings.",
  },
  view: { fr: "Voir le projet", ar: "عرض المشروع", en: "View project" },
};

/** Default bullet points of each partner (editable per partner in /admin). */
export const partnerPoints: Record<string, T[]> = Object.fromEntries(
  Object.entries({
    Seabery: {
      points: [
        {
          fr: "Soldamatic : le soudage en réalité augmentée",
          ar: "Soldamatic: اللحام بالواقع المعزز", en: "Soldamatic: augmented reality welding",
        },
        {
          fr: "Installation et prise en main sur site",
          ar: "التركيب والتدريب على الاستخدام في الموقع", en: "On-site installation and onboarding",
        },
        {
          fr: "Représentation officielle en Mauritanie",
          ar: "التمثيل الرسمي في موريتانيا", en: "Official representation in Mauritania",
        },
      ],
    },
    MPG: {
      points: [
        { fr: "Ateliers et programmes de formation", ar: "ورشات وبرامج تدريب", en: "Workshops and training programmes" },
        { fr: "Projets de R&D communs", ar: "مشاريع بحث وتطوير مشتركة", en: "Joint R&D projects" },
        {
          fr: "Présence commune aux salons et événements",
          ar: "حضور مشترك في المعارض والفعاليات", en: "Joint presence at fairs and events",
        },
      ],
    },
  }).map(([k, v]) => [k, v.points]),
);
