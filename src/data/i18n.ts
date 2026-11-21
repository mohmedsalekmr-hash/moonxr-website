/**
 * The site's languages. Adding one = add it here, give every text an entry for it,
 * and add its labels in LANG below. French is the default.
 */
export const locales = ["fr", "ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export const hasLocale = (l: string): l is Locale => (locales as readonly string[]).includes(l);

/** Name of each language in itself, short code for the switcher, writing direction, Open Graph locale. */
export const LANG: Record<Locale, { name: string; short: string; dir: "ltr" | "rtl"; og: string; html: string }> = {
  fr: { name: "Français", short: "FR", dir: "ltr", og: "fr_MR", html: "fr" },
  ar: { name: "العربية", short: "ع", dir: "rtl", og: "ar_MR", html: "ar" },
  en: { name: "English", short: "EN", dir: "ltr", og: "en_US", html: "en" },
};
export const isRtl = (l: Locale) => LANG[l].dir === "rtl";

/** A text in every language. Older content may miss a language: `t` then falls back to French. */
export type T = { fr: string; ar: string; en: string };
export const t = (v: Partial<T> | undefined | null, l: Locale): string => (v && (v[l] || v.fr || v.ar)) || "";

/**
 * Page addresses. The folders are named in French (/fr/projets); English visitors
 * get English addresses (/en/projects), rewritten to the same pages in next.config.ts.
 */
export type PageKey = "projets" | "services" | "partenaires" | "a-propos" | "contact";
export const SLUGS: Record<PageKey, Partial<Record<Locale, string>>> = {
  projets: { en: "projects" },
  services: {},
  partenaires: { en: "partners" },
  "a-propos": { en: "about" },
  contact: {},
};
/** Link to a page in a language: href(lang) = home, href(lang, "projets", "snim") = a project. */
export const href = (l: Locale, page?: PageKey, rest?: string) => `/${l}` + (page ? `/${SLUGS[page][l] ?? page}` : "") + (rest ? `/${rest}` : "");

export const CONTACT = {
  email: "mohamedsaleck@moon.mr",
  phone: "+222 30 45 47 77",
  phoneHref: "tel:+22230454777",
  /** WhatsApp number (international format); empty = same as the phone */
  whatsapp: "+222 30 45 47 77",
};

export const ui = {
  nav: {
    home: { fr: "Accueil", ar: "الرئيسية", en: "Home" },
    projects: { fr: "Projets", ar: "أعمالنا", en: "Projects" },
    services: { fr: "Services", ar: "خدماتنا", en: "Services" },
    partners: { fr: "Partenaires", ar: "شركاؤنا", en: "Partners" },
    about: { fr: "À propos", ar: "من نحن", en: "About" },
    contact: { fr: "Nous contacter", ar: "تواصل معنا", en: "Contact us" },
    menu: { fr: "Menu", ar: "القائمة", en: "Menu" },
    close: { fr: "Fermer", ar: "إغلاق", en: "Close" },
  },
  hero: {
    kicker: { fr: "Moon Technology · Nouakchott", ar: "Moon Technology · نواكشوط", en: "Moon Technology · Nouakchott" },
    l1: { fr: "La réalité virtuelle,", ar: "الواقع الافتراضي،", en: "Virtual reality," },
    l2a: { fr: "livrée", ar: "نوصله", en: "delivered" },
    l2b: { fr: "en Mauritanie.", ar: "إليكم في موريتانيا.", en: "in Mauritania." },
    sub: {
      fr: "Événements immersifs, simulateurs de formation et contenus conçus localement — installés et accompagnés sur place par notre équipe.",
      ar: "فعاليات تفاعلية، ومحاكيات للتدريب، ومحتوى مصمّم محلياً — يركّبه فريقنا ويرافقكم في الموقع.",
      en: "Immersive events, training simulators and locally designed content — installed and supported on site by our team.",
    },
    cta1: { fr: "Voir nos projets", ar: "شاهد أعمالنا", en: "See our projects" },
    cta2: { fr: "Voir en vidéo", ar: "شاهد الفيديوهات", en: "Watch the videos" },
    scroll: { fr: "Défiler", ar: "مرّر", en: "Scroll" },
  },
  trust: { fr: "Ils nous ont fait confiance", ar: "وثقوا بنا", en: "They trusted us" },
  home: {
    aboutKicker: { fr: "Qui sommes-nous", ar: "من نحن", en: "Who we are" },
    serviceMore: { fr: "Découvrir le service", ar: "اكتشف الخدمة", en: "Explore the service" },
    swipeHint: { fr: "Glissez vers la gauche ou la droite pour parcourir", ar: "اسحب يميناً أو يساراً لتصفّح المشاريع", en: "Swipe left or right to browse" },
    partnerLabel: { fr: "Partenaire", ar: "شريك", en: "Partner" },
    allTech: { fr: "Toutes nos technologies", ar: "كل التقنيات", en: "All our technologies" },
    statementA: { fr: "Nous concevons, installons et animons des expériences de", ar: "نصمّم ونركّب وندير تجارب", en: "We design, install and run" },
    statementB: { fr: "réalité virtuelle", ar: "الواقع الافتراضي", en: "virtual reality" },
    statementC: {
      fr: "en Mauritanie.",
      ar: "في موريتانيا.",
      en: "in Mauritania.",
    },
    workTitle: { fr: "Des projets réels, livrés sur le terrain.", ar: "مشاريع حقيقية، منفّذة في الميدان.", en: "Real projects, delivered in the field." },
    processKicker: { fr: "Notre méthode", ar: "طريقتنا", en: "Our method" },
    processTitle: { fr: "De votre idée à une expérience qui fonctionne.", ar: "من فكرتكم إلى تجربة تعمل فعلاً.", en: "From your idea to an experience that works." },
    explore: { fr: "Explorer le casque", ar: "استكشف النظارة", en: "Explore the headset" },
    ecoKicker: { fr: "Partenaires & technologies", ar: "الشركاء والتقنيات", en: "Partners & technologies" },
    ecoTitle: { fr: "Un écosystème de confiance autour de chaque projet.", ar: "منظومة موثوقة حول كل مشروع.", en: "A trusted ecosystem behind every project." },
    ecoSub: {
      fr: "Des clients de premier plan, des partenaires engagés et les technologies de fournisseurs reconnus dans le monde entier.",
      ar: "عملاء بارزون، وشركاء ملتزمون، وتقنيات من مزوّدين معروفين حول العالم.",
      en: "Leading clients, committed partners and technologies from suppliers recognised worldwide.",
    },
    ecoCta: { fr: "Découvrir nos partenaires", ar: "اكتشف شركاءنا", en: "Discover our partners" },
  },
  showcase: {
    kicker: { fr: "Nos clients", ar: "عملاؤنا", en: "Our clients" },
    title: { fr: "Deux opérateurs, deux lancements 5G.", ar: "مشغّلان، وإطلاقان للجيل الخامس.", en: "Two operators, two 5G launches." },
    sub: {
      fr: "Les deux opérateurs télécoms du pays nous ont confié l'expérience VR de leur lancement 5G.",
      ar: "أوكل إلينا مشغّلا الاتصالات في البلاد تجربة الواقع الافتراضي في إطلاق الجيل الخامس.",
      en: "The country's two telecom operators entrusted us with the VR experience of their 5G launch.",
    },
  },
  field: {
    kicker: { fr: "Sur le terrain", ar: "من الميدان", en: "In the field" },
    title: { fr: "Ce qu'on a vécu, en images.", ar: "ما عشناه، بالصورة.", en: "What we lived, in pictures." },
    sub: {
      fr: "Des extraits courts filmés pendant nos activations 5G pour Mattel et Moov Mauritel.",
      ar: "مقاطع قصيرة صُوّرت خلال فعاليات الجيل الخامس التي نفّذناها لماتل وموريتل.",
      en: "Short clips filmed during our 5G activations for Mattel and Moov Mauritel.",
    },
  },
  services: {
    kicker: { fr: "Ce que nous faisons", ar: "ماذا نقدّم", en: "What we do" },
    title: { fr: "Du besoin à un système qui fonctionne, sur site.", ar: "من حاجتكم إلى نظام يعمل فعلاً، في موقعكم.", en: "From the need to a system that works, on site." },
  },
  work: {
    kicker: { fr: "Nos réalisations", ar: "إنجازاتنا", en: "Our work" },
    title: { fr: "Nos projets", ar: "مشاريعنا", en: "Our projects" },
    all: { fr: "Tous", ar: "الكل", en: "All" },
    seeAll: { fr: "Tous les projets", ar: "كل المشاريع", en: "All projects" },
    view: { fr: "Voir le projet", ar: "عرض المشروع", en: "View project" },
    grid: { fr: "Grille", ar: "شبكة", en: "Grid" },
    list: { fr: "Liste", ar: "قائمة", en: "List" },
    featured: { fr: "Projet à la une", ar: "مشروع مميّز", en: "Featured project" },
    sub: {
      fr: "Événements, simulateurs de formation et une application maison — des projets réalisés en Mauritanie.",
      ar: "فعاليات، ومحاكيات تدريب، وتطبيق من تطويرنا — مشاريع نفّذناها في موريتانيا.",
      en: "Events, training simulators and an in-house application — projects delivered in Mauritania.",
    },
  },
  partners: {
    kicker: { fr: "Partenaires", ar: "شركاؤنا", en: "Partners" },
    title: { fr: "Deux partenaires, huit fournisseurs.", ar: "شريكان، وثمانية مزوّدين.", en: "Two partners, eight suppliers." },
    clients: { fr: "Clients", ar: "عملاؤنا", en: "Clients" },
    suppliers: { fr: "Fournisseurs technologiques", ar: "المزوّدون التقنيون", en: "Technology suppliers" },
    suppliersSub: {
      fr: "Les technologies que nous sélectionnons, installons et accompagnons en Mauritanie.",
      ar: "التقنيات التي نختارها ونركّبها ونرافقها في موريتانيا.",
      en: "The technologies we select, install and support in Mauritania.",
    },
  },
  presence: {
    kicker: { fr: "Présence publique", ar: "حضورنا", en: "Public presence" },
    title: { fr: "Testé à Nouakchott et au GITEX Africa.", ar: "جرّبها الناس في نواكشوط وفي GITEX Africa.", en: "Tested in Nouakchott and at GITEX Africa." },
    sub: {
      fr: "Responsables, enseignants et étudiants ont essayé nos systèmes sur des casques aux couleurs de Moon — lors de salons nationaux et au GITEX Africa, au Maroc.",
      ar: "مسؤولون وأساتذة وطلاب جرّبوا أنظمتنا على نظارات تحمل شعار Moon، في معارض وطنية وفي GITEX Africa بالمغرب.",
      en: "Officials, teachers and students tried our systems on Moon-branded headsets — at national fairs and at GITEX Africa, in Morocco.",
    },
    a: { fr: "Salon national, Nouakchott", ar: "معرض وطني، نواكشوط", en: "National fair, Nouakchott" },
    b: { fr: "GITEX Africa, Maroc", ar: "GITEX Africa، المغرب", en: "GITEX Africa, Morocco" },
  },
  process: {
    kicker: { fr: "Comment nous intervenons", ar: "كيف نعمل", en: "How we work" },
  },
  cta: {
    title: { fr: "Un événement ou une formation en vue ?", ar: "لديكم فعالية أو تدريب قادم؟", en: "An event or a training in mind?" },
    sub: { fr: "Parlez-nous de votre projet. Réponse sous 48 h.", ar: "حدّثونا عن مشروعكم، ونرد خلال 48 ساعة.", en: "Tell us about your project. Reply within 48 hours." },
    btn: { fr: "Écrire un message", ar: "أرسل رسالة", en: "Write a message" },
  },
  footer: {
    contact: { fr: "Contact", ar: "تواصل", en: "Contact" },
    city: { fr: "Nouakchott, Mauritanie", ar: "نواكشوط، موريتانيا", en: "Nouakchott, Mauritania" },
    whatsapp: { fr: "WhatsApp", ar: "واتساب", en: "WhatsApp" },
    tag: {
      fr: "Division technologie immersive de Moon Technology · Nouakchott, Mauritanie",
      ar: "قسم التقنيات التفاعلية في Moon Technology · نواكشوط، موريتانيا",
      en: "Immersive technology division of Moon Technology · Nouakchott, Mauritania",
    },
  },
  photos: {
    kicker: { fr: "En images", ar: "بالصور", en: "In pictures" },
  },
  project: {
    client: { fr: "Client", ar: "العميل", en: "Client" },
    date: { fr: "Date", ar: "التاريخ", en: "Date" },
    place: { fr: "Lieu", ar: "المكان", en: "Location" },
    setup: { fr: "Dispositif", ar: "التجهيز", en: "Setup" },
    gallery: { fr: "En images", ar: "بالصور", en: "In pictures" },
    videos: { fr: "En vidéo", ar: "بالفيديو", en: "On video" },
    videosSub: {
      fr: "Extraits filmés sur place · lecture automatique, sans son",
      ar: "مقاطع صُوّرت في الموقع · تشغيل تلقائي بدون صوت",
      en: "Clips filmed on site · autoplay, muted",
    },
    next: { fr: "Projet suivant", ar: "المشروع التالي", en: "Next project" },
    back: { fr: "Tous les projets", ar: "كل المشاريع", en: "All projects" },
    soon: { fr: "Bientôt", ar: "قريباً", en: "Coming soon" },
  },
  aboutPage: {
    pathK: { fr: "Notre parcours", ar: "مسيرتنا", en: "Our journey" },
    pathT: { fr: "Chaque projet, une étape.", ar: "كل مشروع خطوة.", en: "Every project, a milestone." },
    dev: { fr: "En développement", ar: "قيد التطوير", en: "In development" },
    all: { fr: "Tous les projets", ar: "كل المشاريع", en: "All projects" },
  },
  servicesPage: {
    title: { fr: "Ce que nous faisons pour vous.", ar: "ما نقدّمه لكم.", en: "What we do for you." },
    sub: {
      fr: "Quatre services, du premier échange jusqu'au suivi sur place.",
      ar: "أربع خدمات، من أول لقاء حتى المتابعة في الموقع.",
      en: "Four services, from the first conversation to on-site follow-up.",
    },
    seen: { fr: "Dans nos projets", ar: "في مشاريعنا", en: "In our projects" },
    soon: { fr: "En développement", ar: "قيد التطوير", en: "In development" },
  },
  contactPage: {
    next: { fr: "Comment ça se passe", ar: "كيف نعمل معكم", en: "How it works" },
    call: { fr: "Appeler", ar: "اتصال", en: "Call" },
    mail: { fr: "E-mail", ar: "البريد", en: "Email" },
    form: { fr: "Votre demande", ar: "طلبكم", en: "Your request" },
  },
  story: {
    sound: { fr: "Activer le son", ar: "تشغيل الصوت", en: "Turn sound on" },
    mute: { fr: "Couper le son", ar: "كتم الصوت", en: "Mute" },
    hintDesk: { fr: "Faites défiler pour la suite", ar: "انزل لمشاهدة البقية", en: "Scroll to continue" },
    hintTouch: { fr: "Glissez vers le haut", ar: "اسحب للأعلى", en: "Swipe up" },
    open: { fr: "Agrandir", ar: "تكبير", en: "Enlarge" },
    prev: { fr: "Précédente", ar: "السابقة", en: "Previous" },
    next: { fr: "Suivante", ar: "التالية", en: "Next" },
    close: { fr: "Fermer", ar: "إغلاق", en: "Close" },
    all: { fr: "Toutes les photos et vidéos", ar: "كل الصور والفيديوهات", en: "All photos and videos" },
    swipe: { fr: "Glissez pour voir la suite", ar: "اسحب لمشاهدة البقية", en: "Swipe to see more" },
  },
  contactList: {
    email: { fr: "E-mail", ar: "البريد الإلكتروني", en: "Email" },
    phone: { fr: "Téléphone", ar: "الهاتف", en: "Phone" },
    place: { fr: "Adresse", ar: "العنوان", en: "Address" },
    placeV: { fr: "Nouakchott, Mauritanie", ar: "نواكشوط، موريتانيا", en: "Nouakchott, Mauritania" },
    time: { fr: "Délai de réponse", ar: "مدة الرد", en: "Response time" },
    timeV: { fr: "Sous 48 heures", ar: "خلال 48 ساعة", en: "Within 48 hours" },
  },
  form: {
    sending: { fr: "Envoi…", ar: "جارٍ الإرسال…", en: "Sending…" },
    done: { fr: "Merci, votre demande est bien reçue.", ar: "شكراً، وصلنا طلبكم.", en: "Thank you, we have received your request." },
    doneSub: { fr: "Nous vous répondons sous 48 h.", ar: "سنرد عليكم خلال 48 ساعة.", en: "We will get back to you within 48 hours." },
    again: { fr: "Envoyer une autre demande", ar: "إرسال طلب آخر", en: "Send another request" },
    invalid: { fr: "Vérifiez le nom, l'e-mail et le message.", ar: "تأكدوا من الاسم والبريد والرسالة.", en: "Please check your name, email and message." },
    flood: {
      fr: "Trop d'envois en peu de temps. Réessayez plus tard ou écrivez-nous directement.",
      ar: "طلبات كثيرة في وقت قصير. حاولوا لاحقاً أو راسلونا مباشرة.",
      en: "Too many requests in a short time. Try again later or write to us directly.",
    },
    server: { fr: "L'envoi n'a pas abouti. Écrivez-nous directement :", ar: "لم يكتمل الإرسال. راسلونا مباشرة:", en: "Your message could not be sent. Write to us directly:" },
  },
  ctaBox: {
    write: { fr: "Écrire pour", ar: "اكتب لنا عن", en: "Write about" },
    wa: { fr: "WhatsApp", ar: "واتساب", en: "WhatsApp" },
    waSub: { fr: "La réponse la plus rapide", ar: "أسرع طريقة للرد", en: "The fastest reply" },
    mailSub: { fr: "Écrire un e-mail", ar: "راسلنا بالبريد", en: "Send an email" },
    copy: { fr: "Copier l'adresse", ar: "نسخ العنوان", en: "Copy address" },
    copied: { fr: "Copié", ar: "تم النسخ", en: "Copied" },
    call: { fr: "Appeler directement", ar: "اتصل مباشرة", en: "Call directly" },
    local: { fr: "heure locale", ar: "بالتوقيت المحلي", en: "local time" },
    ask: { fr: "Que préparez-vous ?", ar: "ماذا تحضّرون؟", en: "What are you planning?" },
    hello: { fr: "Bonjour Moon XR, je vous contacte au sujet de :", ar: "مرحباً Moon XR، أتواصل معكم بخصوص:", en: "Hello Moon XR, I am contacting you about:" },
  },
  contact: {
    title: { fr: "Parlons de votre projet.", ar: "لنتحدّث عن مشروعكم.", en: "Let's talk about your project." },
    sub: {
      fr: "Événement, formation ou démonstration : décrivez votre besoin, nous revenons vers vous sous 48 h.",
      ar: "فعالية أو تدريب أو عرض تجريبي: صِفوا حاجتكم، ونرد عليكم خلال 48 ساعة.",
      en: "Event, training or demonstration: describe your need and we will get back to you within 48 hours.",
    },
    name: { fr: "Nom complet", ar: "الاسم الكامل", en: "Full name" },
    org: { fr: "Organisation", ar: "الجهة", en: "Organisation" },
    email: { fr: "E-mail", ar: "البريد الإلكتروني", en: "Email" },
    phone: { fr: "Téléphone", ar: "الهاتف", en: "Phone" },
    type: { fr: "Type de projet", ar: "نوع المشروع", en: "Project type" },
    types: {
      fr: ["Événement VR", "Formation / simulateur", "Démonstration", "Autre"],
      ar: ["فعالية واقع افتراضي", "تدريب / محاكي", "عرض تجريبي", "أخرى"],
      en: ["VR event", "Training / simulator", "Demonstration", "Other"],
    },
    msg: { fr: "Votre message", ar: "رسالتكم", en: "Your message" },
    send: { fr: "Envoyer", ar: "إرسال", en: "Send" },
    note: {
      fr: "Réponse sous 48 h, par e-mail ou téléphone.",
      ar: "نردّ خلال 48 ساعة عبر البريد أو الهاتف.",
      en: "Reply within 48 hours, by email or phone.",
    },
    direct: { fr: "Ou directement", ar: "أو مباشرة", en: "Or directly" },
    city: { fr: "Nouakchott, Mauritanie", ar: "نواكشوط، موريتانيا", en: "Nouakchott, Mauritania" },
  },
} as const;

/** A service card. `projects` = slugs of the projects shown under it on the Services page (empty = by category). */
export type Service = { n: string; title: T; text: T; projects?: string[]; image?: string; pos?: string };

export const services: Service[] = [
  {
    n: "01",
    title: { fr: "Événements VR", ar: "فعاليات الواقع الافتراضي", en: "VR events" },
    text: {
      fr: "Activations clé en main : casques, jeux, simulations et un spécialiste à chaque poste.",
      ar: "تجارب جاهزة بالكامل: نظارات، ألعاب، محاكاة، ومختص عند كل نظارة.",
      en: "Turnkey activations: headsets, games, simulations and a specialist at every station.",
    },
  },
  {
    n: "02",
    title: { fr: "Formation & simulateurs", ar: "التدريب والمحاكيات", en: "Training & simulators" },
    text: {
      fr: "Soudage en RA et RM, sécurité industrielle : former sans risque, répéter sans limite.",
      ar: "لحام بالواقع المعزز والمختلط، وسلامة صناعية: تدرّب بلا خطر، وكرّر بلا حدود.",
      en: "AR and MR welding, industrial safety: train without risk, practise without limits.",
    },
  },
  {
    n: "03",
    title: { fr: "Installation & accompagnement", ar: "التركيب والمرافقة", en: "Installation & support" },
    text: {
      fr: "Livraison, calibrage, formation des formateurs, puis un contact local qui reste.",
      ar: "التسليم والمعايرة وتدريب المدرّبين، ثم جهة تواصل محلية تبقى معكم.",
      en: "Delivery, calibration, train-the-trainer, then a local contact who stays.",
    },
  },
  {
    n: "04",
    title: { fr: "Contenu 3D local", ar: "محتوى ثلاثي الأبعاد محلي", en: "Local 3D content" },
    text: {
      fr: "Numérisation 3D et expériences conçues pour la Mauritanie. En développement.",
      ar: "مسح ثلاثي الأبعاد وتجارب مصمّمة لموريتانيا. قيد التطوير.",
      en: "3D scanning and experiences designed for Mauritania. In development.",
    },
  },
];

export const steps = [
  {
    image: "/media/photos/step-event.webp",
    caption: { fr: "Lancement 5G Moov Mauritel", ar: "إطلاق الجيل الخامس لموريتل", en: "Moov Mauritel 5G launch" },
    title: { fr: "Votre objectif", ar: "هدفكم", en: "Your goal" },
    text: {
      fr: "Un lancement, un salon, une formation : nous partons de ce que vous voulez faire vivre, et à qui.",
      ar: "إطلاق أو معرض أو تدريب: ننطلق مما تريدون أن يعيشه جمهوركم، ومن هو هذا الجمهور.",
      en: "A launch, a fair, a training: we start from what you want people to experience, and who they are.",
    },
  },
  {
    image: "/media/photos/eetfp-simulator.webp",
    caption: { fr: "Simulateur de soudage à l'EETFP", ar: "محاكي اللحام في EETFP", en: "Welding simulator at EETFP" },
    pos: "60% 35%",
    title: { fr: "La bonne technologie", ar: "التقنية المناسبة", en: "The right technology" },
    text: {
      fr: "Casques, simulateurs, contenus : nous choisissons la solution la mieux adaptée dans notre réseau de fournisseurs.",
      ar: "نظارات أو محاكيات أو محتوى: نختار الحل الأنسب من شبكة مزوّدينا.",
      en: "Headsets, simulators, content: we choose the best-suited solution from our network of suppliers.",
    },
  },
  {
    image: "/media/photos/step-demo.webp",
    caption: { fr: "Démonstration aux officiels", ar: "عرض تجريبي للمسؤولين", en: "Demonstration for officials" },
    title: { fr: "Une démonstration", ar: "عرض تجريبي", en: "A demonstration" },
    text: {
      fr: "Vous essayez avant de décider. Nous venons sur place avec le matériel et notre recommandation.",
      ar: "تجرّبون قبل أن تقرّروا. نأتي إليكم بالمعدات وبتوصيتنا.",
      en: "You try before you decide. We come on site with the equipment and our recommendation.",
    },
  },
  {
    image: "/media/photos/step-support.webp",
    caption: { fr: "Chaque visiteur est accompagné", ar: "كل زائر يرافقه فريقنا", en: "Every visitor is accompanied" },
    pos: "50% 35%",
    title: { fr: "Livraison et suivi", ar: "التسليم والمتابعة", en: "Delivery and follow-up" },
    text: {
      fr: "Installation, animation ou formation de vos équipes, puis un contact local qui reste joignable.",
      ar: "التركيب أو إدارة التجربة أو تدريب فرقكم، ثم جهة تواصل محلية تبقى قريبة منكم.",
      en: "Installation, running the experience or training your teams, then a local contact who stays reachable.",
    },
  },
];

export const stats: { v: string; vAr?: string; l: T }[] = [
  { v: "2", l: { fr: "lancements 5G animés en VR", ar: "فعاليتا إطلاق للجيل الخامس", en: "5G launches run in VR" } },
  { v: "3", l: { fr: "simulateurs de soudage à l'EETFP", ar: "محاكيات لحام في EETFP", en: "welding simulators at EETFP" } },
  { v: "8", l: { fr: "fournisseurs technologiques", ar: "مزوّدين تقنيين", en: "technology suppliers" } },
];

const PAGE_BY_SEG: Record<string, PageKey> = Object.fromEntries((Object.keys(SLUGS) as PageKey[]).flatMap((k) => [[k, k], ...Object.values(SLUGS[k]).map((s) => [s as string, k])]));
/** The same page in another language: /fr/projets/snim → /en/projects/snim. */
export function switchPath(path: string, to: Locale) {
  const [, , seg, ...rest] = path.split("/");
  const page = seg ? PAGE_BY_SEG[seg] : undefined;
  if (!seg) return href(to);
  return page ? href(to, page, rest.join("/") || undefined) : `/${to}/${[seg, ...rest].join("/")}`;
}
