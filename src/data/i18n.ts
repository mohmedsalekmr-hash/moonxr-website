export const locales = ["fr", "ar"] as const;
export type Locale = (typeof locales)[number];
export const hasLocale = (l: string): l is Locale => (locales as readonly string[]).includes(l);

/** Pick the string for the current language. */
export type T = { fr: string; ar: string };
export const t = (v: T, l: Locale) => v[l];

export const CONTACT = {
  email: "mohamedsaleck@moon.mr",
  phone: "+222 30 45 47 77",
  phoneHref: "tel:+22230454777",
};

export const ui = {
  nav: {
    home: { fr: "Accueil", ar: "الرئيسية" },
    projects: { fr: "Projets", ar: "أعمالنا" },
    services: { fr: "Services", ar: "خدماتنا" },
    partners: { fr: "Partenaires", ar: "شركاؤنا" },
    about: { fr: "À propos", ar: "من نحن" },
    contact: { fr: "Nous contacter", ar: "تواصل معنا" },
    menu: { fr: "Menu", ar: "القائمة" },
    close: { fr: "Fermer", ar: "إغلاق" },
  },
  hero: {
    kicker: { fr: "Moon Technology · Nouakchott", ar: "Moon Technology · نواكشوط" },
    l1: { fr: "La réalité virtuelle,", ar: "الواقع الافتراضي،" },
    l2a: { fr: "livrée", ar: "نوصله" },
    l2b: { fr: "en Mauritanie.", ar: "إليكم في موريتانيا." },
    sub: {
      fr: "Événements immersifs, simulateurs de formation et contenus conçus localement — installés et accompagnés sur place par notre équipe.",
      ar: "فعاليات تفاعلية، ومحاكيات للتدريب، ومحتوى مصمّم محلياً — يركّبه فريقنا ويرافقكم في الموقع.",
    },
    cta1: { fr: "Voir nos projets", ar: "شاهد أعمالنا" },
    cta2: { fr: "Voir en vidéo", ar: "شاهد الفيديوهات" },
    scroll: { fr: "Défiler", ar: "مرّر" },
  },
  trust: { fr: "Ils nous ont fait confiance", ar: "وثقوا بنا" },
  home: {
    aboutKicker: { fr: "Qui sommes-nous", ar: "من نحن" },
    statementA: { fr: "Nous concevons, installons et animons des expériences de", ar: "نصمّم ونركّب وندير تجارب" },
    statementB: { fr: "réalité virtuelle", ar: "الواقع الافتراضي" },
    statementC: {
      fr: "en Mauritanie.",
      ar: "في موريتانيا.",
    },
    workTitle: { fr: "Des projets réels, livrés sur le terrain.", ar: "مشاريع حقيقية، منفّذة في الميدان." },
    processKicker: { fr: "Notre méthode", ar: "طريقتنا" },
    processTitle: { fr: "De votre idée à une expérience qui fonctionne.", ar: "من فكرتكم إلى تجربة تعمل فعلاً." },
    explore: { fr: "Explorer le casque", ar: "استكشف النظارة" },
    ecoKicker: { fr: "Partenaires & technologies", ar: "الشركاء والتقنيات" },
    ecoTitle: { fr: "Un écosystème de confiance autour de chaque projet.", ar: "منظومة موثوقة حول كل مشروع." },
    ecoSub: {
      fr: "Des clients de premier plan, des partenaires engagés et les technologies de fournisseurs reconnus dans le monde entier.",
      ar: "عملاء بارزون، وشركاء ملتزمون، وتقنيات من مزوّدين معروفين حول العالم.",
    },
    ecoCta: { fr: "Découvrir nos partenaires", ar: "اكتشف شركاءنا" },
  },
  showcase: {
    kicker: { fr: "Nos clients", ar: "عملاؤنا" },
    title: { fr: "Deux opérateurs, deux lancements 5G.", ar: "مشغّلان، وإطلاقان للجيل الخامس." },
    sub: {
      fr: "Les deux opérateurs télécoms du pays nous ont confié l'expérience VR de leur lancement 5G.",
      ar: "أوكل إلينا مشغّلا الاتصالات في البلاد تجربة الواقع الافتراضي في إطلاق الجيل الخامس.",
    },
  },
  field: {
    kicker: { fr: "Sur le terrain", ar: "من الميدان" },
    title: { fr: "Ce qu'on a vécu, en images.", ar: "ما عشناه، بالصورة." },
    sub: {
      fr: "Des extraits courts filmés pendant nos activations 5G pour Mattel et Moov Mauritel.",
      ar: "مقاطع قصيرة صُوّرت خلال فعاليات الجيل الخامس التي نفّذناها لماتل وموريتل.",
    },
  },
  services: {
    kicker: { fr: "Ce que nous faisons", ar: "ماذا نقدّم" },
    title: { fr: "Du besoin à un système qui fonctionne, sur site.", ar: "من حاجتكم إلى نظام يعمل فعلاً، في موقعكم." },
  },
  work: {
    kicker: { fr: "Nos réalisations", ar: "إنجازاتنا" },
    title: { fr: "Nos projets", ar: "مشاريعنا" },
    all: { fr: "Tous", ar: "الكل" },
    seeAll: { fr: "Tous les projets", ar: "كل المشاريع" },
    view: { fr: "Voir le projet", ar: "عرض المشروع" },
  },
  partners: {
    kicker: { fr: "Partenaires", ar: "شركاؤنا" },
    title: { fr: "Deux partenaires, huit fournisseurs.", ar: "شريكان، وثمانية مزوّدين." },
    clients: { fr: "Clients", ar: "عملاؤنا" },
    suppliers: { fr: "Fournisseurs technologiques", ar: "المزوّدون التقنيون" },
    suppliersSub: {
      fr: "Les technologies que nous sélectionnons, installons et accompagnons en Mauritanie.",
      ar: "التقنيات التي نختارها ونركّبها ونرافقها في موريتانيا.",
    },
  },
  presence: {
    kicker: { fr: "Présence publique", ar: "حضورنا" },
    title: { fr: "Testé à Nouakchott et au GITEX Africa.", ar: "جرّبها الناس في نواكشوط وفي GITEX Africa." },
    sub: {
      fr: "Responsables, enseignants et étudiants ont essayé nos systèmes sur des casques aux couleurs de Moon — lors de salons nationaux et au GITEX Africa, au Maroc.",
      ar: "مسؤولون وأساتذة وطلاب جرّبوا أنظمتنا على نظارات تحمل شعار Moon، في معارض وطنية وفي GITEX Africa بالمغرب.",
    },
    a: { fr: "Salon national, Nouakchott", ar: "معرض وطني، نواكشوط" },
    b: { fr: "GITEX Africa, Maroc", ar: "GITEX Africa، المغرب" },
  },
  process: {
    kicker: { fr: "Comment nous intervenons", ar: "كيف نعمل" },
  },
  cta: {
    title: { fr: "Un événement ou une formation en vue ?", ar: "لديكم فعالية أو تدريب قادم؟" },
    sub: { fr: "Parlez-nous de votre projet. Réponse sous 48 h.", ar: "حدّثونا عن مشروعكم، ونرد خلال 48 ساعة." },
    btn: { fr: "Écrire un message", ar: "أرسل رسالة" },
  },
  footer: {
    tag: {
      fr: "Division technologie immersive de Moon Technology · Nouakchott, Mauritanie",
      ar: "قسم التقنيات التفاعلية في Moon Technology · نواكشوط، موريتانيا",
    },
  },
  photos: {
    kicker: { fr: "En images", ar: "بالصور" },
  },
  project: {
    client: { fr: "Client", ar: "العميل" },
    date: { fr: "Date", ar: "التاريخ" },
    place: { fr: "Lieu", ar: "المكان" },
    setup: { fr: "Dispositif", ar: "التجهيز" },
    gallery: { fr: "En images", ar: "بالصور" },
    videos: { fr: "En vidéo", ar: "بالفيديو" },
    videosSub: {
      fr: "Extraits filmés sur place · lecture automatique, sans son",
      ar: "مقاطع صُوّرت في الموقع · تشغيل تلقائي بدون صوت",
    },
    next: { fr: "Projet suivant", ar: "المشروع التالي" },
    back: { fr: "Tous les projets", ar: "كل المشاريع" },
    soon: { fr: "Bientôt", ar: "قريباً" },
  },
  contact: {
    title: { fr: "Parlons de votre projet.", ar: "لنتحدّث عن مشروعكم." },
    sub: {
      fr: "Événement, formation ou démonstration : décrivez votre besoin, nous revenons vers vous sous 48 h.",
      ar: "فعالية أو تدريب أو عرض تجريبي: صِفوا حاجتكم، ونرد عليكم خلال 48 ساعة.",
    },
    name: { fr: "Nom complet", ar: "الاسم الكامل" },
    org: { fr: "Organisation", ar: "الجهة" },
    email: { fr: "E-mail", ar: "البريد الإلكتروني" },
    phone: { fr: "Téléphone", ar: "الهاتف" },
    type: { fr: "Type de projet", ar: "نوع المشروع" },
    types: {
      fr: ["Événement VR", "Formation / simulateur", "Démonstration", "Autre"],
      ar: ["فعالية واقع افتراضي", "تدريب / محاكي", "عرض تجريبي", "أخرى"],
    },
    msg: { fr: "Votre message", ar: "رسالتكم" },
    send: { fr: "Envoyer", ar: "إرسال" },
    note: {
      fr: "Réponse sous 48 h, par e-mail ou téléphone.",
      ar: "نردّ خلال 48 ساعة عبر البريد أو الهاتف.",
    },
    direct: { fr: "Ou directement", ar: "أو مباشرة" },
    city: { fr: "Nouakchott, Mauritanie", ar: "نواكشوط، موريتانيا" },
  },
} as const;

export const services = [
  {
    n: "01",
    title: { fr: "Événements VR", ar: "فعاليات الواقع الافتراضي" },
    text: {
      fr: "Activations clé en main : casques, jeux, simulations et un spécialiste à chaque poste.",
      ar: "تجارب جاهزة بالكامل: نظارات، ألعاب، محاكاة، ومختص عند كل نظارة.",
    },
  },
  {
    n: "02",
    title: { fr: "Formation & simulateurs", ar: "التدريب والمحاكيات" },
    text: {
      fr: "Soudage en RA et RM, sécurité industrielle : former sans risque, répéter sans limite.",
      ar: "لحام بالواقع المعزز والمختلط، وسلامة صناعية: تدرّب بلا خطر، وكرّر بلا حدود.",
    },
  },
  {
    n: "03",
    title: { fr: "Installation & accompagnement", ar: "التركيب والمرافقة" },
    text: {
      fr: "Livraison, calibrage, formation des formateurs, puis un contact local qui reste.",
      ar: "التسليم والمعايرة وتدريب المدرّبين، ثم جهة تواصل محلية تبقى معكم.",
    },
  },
  {
    n: "04",
    title: { fr: "Contenu 3D local", ar: "محتوى ثلاثي الأبعاد محلي" },
    text: {
      fr: "Numérisation 3D et expériences conçues pour la Mauritanie. En développement.",
      ar: "مسح ثلاثي الأبعاد وتجارب مصمّمة لموريتانيا. قيد التطوير.",
    },
  },
];

export const steps = [
  {
    image: "/media/photos/step-event.webp",
    caption: { fr: "Lancement 5G Moov Mauritel", ar: "إطلاق الجيل الخامس لموريتل" },
    title: { fr: "Votre objectif", ar: "هدفكم" },
    text: {
      fr: "Un lancement, un salon, une formation : nous partons de ce que vous voulez faire vivre, et à qui.",
      ar: "إطلاق أو معرض أو تدريب: ننطلق مما تريدون أن يعيشه جمهوركم، ومن هو هذا الجمهور.",
    },
  },
  {
    image: "/media/photos/eetfp-simulator.webp",
    caption: { fr: "Simulateur de soudage à l'EETFP", ar: "محاكي اللحام في EETFP" },
    pos: "60% 35%",
    title: { fr: "La bonne technologie", ar: "التقنية المناسبة" },
    text: {
      fr: "Casques, simulateurs, contenus : nous choisissons la solution la mieux adaptée dans notre réseau de fournisseurs.",
      ar: "نظارات أو محاكيات أو محتوى: نختار الحل الأنسب من شبكة مزوّدينا.",
    },
  },
  {
    image: "/media/photos/step-demo.webp",
    caption: { fr: "Démonstration aux officiels", ar: "عرض تجريبي للمسؤولين" },
    title: { fr: "Une démonstration", ar: "عرض تجريبي" },
    text: {
      fr: "Vous essayez avant de décider. Nous venons sur place avec le matériel et notre recommandation.",
      ar: "تجرّبون قبل أن تقرّروا. نأتي إليكم بالمعدات وبتوصيتنا.",
    },
  },
  {
    image: "/media/photos/step-support.webp",
    caption: { fr: "Chaque visiteur est accompagné", ar: "كل زائر يرافقه فريقنا" },
    pos: "50% 35%",
    title: { fr: "Livraison et suivi", ar: "التسليم والمتابعة" },
    text: {
      fr: "Installation, animation ou formation de vos équipes, puis un contact local qui reste joignable.",
      ar: "التركيب أو إدارة التجربة أو تدريب فرقكم، ثم جهة تواصل محلية تبقى قريبة منكم.",
    },
  },
];


export const stats: { v: string; vAr?: string; l: T }[] = [
  { v: "2", l: { fr: "lancements 5G animés en VR", ar: "فعاليتا إطلاق للجيل الخامس" } },
  { v: "3", l: { fr: "simulateurs de soudage à l'EETFP", ar: "محاكيات لحام في EETFP" } },
  { v: "8", l: { fr: "fournisseurs technologiques", ar: "مزوّدين تقنيين" } },
];
