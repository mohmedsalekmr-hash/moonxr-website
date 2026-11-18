import type { T } from "./i18n";

/** Texts of the «À propos» page (editable in /admin → نصوص الموقع). */
export const aboutPage = {
  title: {
    fr: "La division technologie immersive de Moon Technology.",
    ar: "قسم التقنيات التفاعلية في Moon Technology.",
  },
  sub: {
    fr: "Moon XR apporte la réalité virtuelle et augmentée aux entreprises, aux écoles et aux événements en Mauritanie. Nous choisissons la bonne technologie, nous l'installons et nous restons à vos côtés.",
    ar: "يقدّم Moon XR الواقع الافتراضي والمعزّز للشركات والمدارس والفعاليات في موريتانيا. نختار التقنية المناسبة، ونركّبها، ونبقى إلى جانبكم.",
  },
  sectors: { fr: "Secteurs", ar: "القطاعات" },
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
    ],
  },
  where: {
    fr: "Basés à Nouakchott, présents dans tout le pays",
    ar: "مقرّنا نواكشوط، ونعمل في كل البلاد",
  },
  whereText: {
    fr: "Notre équipe se déplace pour installer, former et accompagner sur site, partout en Mauritanie.",
    ar: "ينتقل فريقنا للتركيب والتدريب والمرافقة في الموقع، في كل أنحاء موريتانيا.",
  },
  pillars: {
    kicker: { fr: "Notre engagement", ar: "التزامنا" },
    title: {
      fr: "Une technologie de pointe, une équipe sur place, une expérience sans faille.",
      ar: "تقنية متقدمة، وفريق في الموقع، وتجربة بلا أخطاء.",
    },
    items: [
      {
        t: { fr: "Clé en main", ar: "حل متكامل" },
        d: {
          fr: "Casques, contenus, installation et animation : nous prenons tout en charge, du premier échange au dernier visiteur.",
          ar: "النظارات والمحتوى والتركيب والإدارة: نتكفّل بكل شيء، من أول لقاء إلى آخر زائر.",
        },
      },
      {
        t: { fr: "Équipe locale", ar: "فريق محلي" },
        d: {
          fr: "Basés à Nouakchott, nous installons, formons et restons joignables après la livraison.",
          ar: "مقرّنا نواكشوط: نركّب وندرّب ونبقى قريبين منكم بعد التسليم.",
        },
      },
      {
        t: { fr: "Technologies éprouvées", ar: "تقنيات موثوقة" },
        d: {
          fr: "Des solutions de constructeurs reconnus, choisies pour chaque besoin et chaque public.",
          ar: "حلول من مصنّعين معروفين، نختارها لكل حاجة ولكل جمهور.",
        },
      },
      {
        t: { fr: "Sécurité & hygiène", ar: "السلامة والنظافة" },
        d: {
          fr: "Un accompagnateur à chaque poste et des casques nettoyés entre chaque visiteur.",
          ar: "مرافق عند كل نظارة، وتنظيف النظارات بين كل زائر وآخر.",
        },
      },
    ],
  },
};

/** Titles of the «Partenaires» page. */
export const partnersPage = {
  kicker: { fr: "Notre écosystème", ar: "منظومتنا" },
  title: {
    fr: "Clients, partenaires, technologies.",
    ar: "عملاؤنا، شركاؤنا، تقنياتنا.",
  },
  sub: {
    fr: "Ceux qui nous font confiance, et ce que nous installons.",
    ar: "من وثق بنا، وما نركّبه لهم.",
  },
  clientsTitle: { fr: "Ils nous font confiance.", ar: "وثقوا بنا." },
  partnersTitle: { fr: "Nos partenaires.", ar: "شركاؤنا." },
  techTitle: {
    fr: "Nos technologies.",
    ar: "تقنياتنا.",
  },
  techSub: {
    fr: "Survolez un logo pour découvrir ce que chaque fournisseur apporte.",
    ar: "مرّر المؤشر على شعار لتعرف ما يقدّمه كل مزوّد.",
  },
  view: { fr: "Voir le projet", ar: "عرض المشروع" },
};

/** Default bullet points of each partner (editable per partner in /admin). */
export const partnerPoints: Record<string, T[]> = Object.fromEntries(
  Object.entries({
    Seabery: {
      points: [
        {
          fr: "Soldamatic : le soudage en réalité augmentée",
          ar: "Soldamatic: اللحام بالواقع المعزز",
        },
        {
          fr: "Installation et prise en main sur site",
          ar: "التركيب والتدريب على الاستخدام في الموقع",
        },
        {
          fr: "Représentation officielle en Mauritanie",
          ar: "التمثيل الرسمي في موريتانيا",
        },
      ],
    },
    MPG: {
      points: [
        { fr: "Ateliers et programmes de formation", ar: "ورشات وبرامج تدريب" },
        { fr: "Projets de R&D communs", ar: "مشاريع بحث وتطوير مشتركة" },
        {
          fr: "Présence commune aux salons et événements",
          ar: "حضور مشترك في المعارض والفعاليات",
        },
      ],
    },
  }).map(([k, v]) => [k, v.points]),
);
