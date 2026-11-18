import type { T } from "./i18n";

export type Category = "event" | "training" | "dev";

export const categories: Record<Category, T> = {
  event: { fr: "Événements", ar: "فعاليات" },
  training: { fr: "Formation", ar: "تدريب" },
  dev: { fr: "Développement", ar: "تطوير" },
};

/** The small yellow label on project images (same as the presentation deck) */
export const projectTag: Record<Category, T> = {
  event: { fr: "Événement", ar: "فعالية" },
  training: { fr: "Projet livré", ar: "مشروع منجَز" },
  dev: { fr: "Développé par Moon", ar: "من تطوير Moon" },
};

export type Photo = { src: string; alt: T; w: number; h: number; pos?: string };
export type Reel = { src: string; poster: string; label: T };
export type Fact = { k: T; v: T };

/**
 * One scene of a project story: a background (photo or looping clip, shown dimmed)
 * and the text that scrolls over it. This is the unit the back office will edit.
 */
export type Scene = {
  media: { type: "image" | "video"; src: string; w: number; h: number; poster?: string; pos?: string };
  kicker?: T;
  title: T;
  text?: T;
};

export type Project = {
  slug: string;
  category: Category;
  title: T;
  short: T;
  meta: T;
  cover: Photo;
  /** Optional looping clip shown full-width at the top of the project page */
  hero?: { video: string; poster: string; pos?: string; mobile?: string; mobilePoster?: string };
  intro: T;
  facts: Fact[];
  /** The story told on the project page: need → what we did → result */
  story: { need: T; approach: T; result: T };
  /** The story, scene by scene (4–6 scenes). The first one opens the page. */
  scenes: Scene[];
  gallery: Photo[];
  reels?: Reel[];
  /** Empty slots for media still to come (Field Ready VR) */
  placeholders?: { label: T; kind: "video" | "image" }[];
};

const p = (src: string, fr: string, ar: string, w = 1080, h = 810): Photo => ({
  src: `/media/photos/${src}.webp`,
  alt: { fr, ar },
  w,
  h,
});


/** Media keeps its real proportions and size (w × h in pixels); it is never cropped or blown up. */
const img = (src: string, w: number, h: number): Scene["media"] => ({ type: "image", src: `/media/photos/${src}.webp`, w, h });
const vid = (name: string, w: number, h: number): Scene["media"] => ({ type: "video", src: `/media/video/${name}.mp4`, poster: `/media/photos/${name}-poster.webp`, w, h });
const K = {
  need: { fr: "Le besoin", ar: "الحاجة" },
  approach: { fr: "Notre réponse", ar: "ما قدّمناه" },
  result: { fr: "Le résultat", ar: "النتيجة" },
  live: { fr: "Sur place", ar: "في الموقع" },
};


export const projects: Project[] = [
  {
    slug: "moov-mauritel",
    category: "event",
    title: { fr: "Lancement 5G — Moov Mauritel", ar: "إطلاق الجيل الخامس — موريتل" },
    short: { fr: "Activation VR · 4 casques, jeux et simulations", ar: "تجربة واقع افتراضي · 4 نظارات، ألعاب ومحاكاة" },
    meta: { fr: "Événement · Novembre 2026", ar: "فعالية · نوفمبر 2026" },
    cover: { ...p("moov-wide", "L'espace Moon x Moov Mauritel, le jour du lancement", "فضاء Moon x موريتل يوم الإطلاق", 1080, 608), pos: "60% 40%" },
    intro: {
      fr: "Pour le lancement de la 5G de Moov Mauritel, nous avons conçu et animé un espace de réalité virtuelle : jeux, simulations et une équipe Moon à chaque poste.",
      ar: "لإطلاق الجيل الخامس لموريتل، صمّمنا وأدرنا فضاءً للواقع الافتراضي: ألعاب ومحاكاة، وفريق Moon عند كل نظارة.",
    },
    facts: [
      { k: { fr: "Client", ar: "العميل" }, v: { fr: "Moov Mauritel", ar: "موريتل (Moov)" } },
      { k: { fr: "Date", ar: "التاريخ" }, v: { fr: "12 novembre 2026", ar: "12 نوفمبر 2026" } },
      { k: { fr: "Lieu", ar: "المكان" }, v: { fr: "Moov Expo, Nouakchott", ar: "Moov Expo، نواكشوط" } },
      { k: { fr: "Dispositif", ar: "التجهيز" }, v: { fr: "4 casques · 4 écrans", ar: "4 نظارات · 4 شاشات" } },
    ],
    story: {
      need: {
        fr: "Faire vivre la 5G au public le jour du lancement, de façon concrète et mémorable.",
        ar: "أن يعيش الجمهور تجربة الجيل الخامس يوم الإطلاق، بشكل ملموس لا يُنسى.",
      },
      approach: {
        fr: "Un espace VR de quatre casques et quatre écrans : jeux, Pilgrim VR et Field Ready VR, avec un membre de l'équipe à chaque poste.",
        ar: "فضاء واقع افتراضي من أربع نظارات وأربع شاشات: ألعاب وPilgrim VR وField Ready VR، مع فرد من الفريق عند كل نظارة.",
      },
      result: {
        fr: "Officiels et visiteurs ont découvert la 5G casque sur la tête, accompagnés du début à la fin.",
        ar: "اكتشف المسؤولون والزوار الجيل الخامس والنظارة على رؤوسهم، بمرافقة من البداية إلى النهاية.",
      },
    },
    scenes: [
      { media: vid("moov-officiel-hl", 480, 848), title: { fr: "Faire vivre la 5G, casque sur la tête.", ar: "أن تعيش الجيل الخامس، والنظارة على رأسك." } },
      {
        media: img("moov-wide", 1080, 608),
        kicker: K.need,
        title: { fr: "Faire vivre la 5G au public, le jour du lancement.", ar: "أن يعيش الجمهور الجيل الخامس يوم الإطلاق." },
        text: { fr: "Une expérience concrète et mémorable pour les officiels comme pour les visiteurs.", ar: "تجربة ملموسة لا تُنسى، للمسؤولين وللزوار على حدّ سواء." },
      },
      {
        media: img("moov-hq-stand", 1080, 810),
        kicker: K.approach,
        title: { fr: "Un espace VR de quatre casques et quatre écrans.", ar: "فضاء واقع افتراضي من أربع نظارات وأربع شاشات." },
        text: { fr: "Jeux, Pilgrim VR et Field Ready VR, avec un membre de l'équipe Moon à chaque poste.", ar: "ألعاب وPilgrim VR وField Ready VR، مع فرد من فريق Moon عند كل نظارة." },
      },
      {
        media: img("moov-minister", 800, 1066),
        kicker: { fr: "Visite officielle", ar: "زيارة رسمية" },
        title: { fr: "Le ministre de la Transformation numérique sur le stand.", ar: "وزير التحول الرقمي في الجناح." },
        text: { fr: "Il a exploré la Grande Mosquée de La Mecque en réalité virtuelle.", ar: "استكشف المسجد الحرام بالواقع الافتراضي." },
      },
      {
        media: img("moov-hq-kaaba", 810, 1080),
        kicker: K.live,
        title: { fr: "Face à la Kaaba, depuis Nouakchott.", ar: "أمام الكعبة، من نواكشوط." },
        text: { fr: "Pilgrim VR, l'une des expériences proposées sur le stand.", ar: "Pilgrim VR، إحدى التجارب المقدَّمة في الجناح." },
      },
      {
        media: img("moov-hq-vip", 1080, 810),
        kicker: K.result,
        title: { fr: "Officiels et visiteurs, casque sur la tête.", ar: "مسؤولون وزوار، والنظارة على رؤوسهم." },
        text: { fr: "Chacun a découvert la 5G accompagné par notre équipe, du début à la fin.", ar: "اكتشف كلٌّ منهم الجيل الخامس بمرافقة فريقنا، من البداية إلى النهاية." },
      },
    ],
    gallery: [
      p("moov-p1", "Pilgrim VR : la Kaaba, casque sur la tête", "Pilgrim VR: الكعبة أمامك والنظارة على رأسك", 810, 1080),
      p("moov-wide", "L'espace Moon x Moov Mauritel, le jour du lancement", "فضاء Moon x موريتل يوم الإطلاق", 1080, 608),
      p("moov-p2", "Une visiteuse découvre l'expérience", "زائرة تكتشف التجربة", 660, 880),
      p("moov-p3", "Immersion au cœur de La Mecque", "انغماس في رحاب مكة", 810, 1080),
      p("moov-vip", "Les officiels découvrent les casques", "المسؤولون يكتشفون النظارات"),
    ],
  },
  {
    slug: "mattel",
    category: "event",
    title: { fr: "Lancement 5G — Mattel", ar: "إطلاق الجيل الخامس — ماتل" },
    short: { fr: "Expérience VR pour le lancement de la 5G", ar: "تجربة واقع افتراضي لإطلاق الجيل الخامس" },
    meta: { fr: "Événement · Novembre 2026", ar: "فعالية · نوفمبر 2026" },
    cover: { ...p("mattel-bus-smile", "Lancement de la 5G Mattel : un visiteur en pleine expérience VR", "إطلاق الجيل الخامس لماتل: زائر في قلب تجربة الواقع الافتراضي", 940, 1175), pos: "50% 30%" },
    intro: {
      fr: "Pour le lancement de la 5G de Mattel, nous avons fait vivre la nouvelle génération au public à travers des expériences en réalité virtuelle.",
      ar: "في إطلاق الجيل الخامس لماتل، جعلنا الجمهور يعيش الجيل الجديد عبر تجارب الواقع الافتراضي.",
    },
    facts: [
      { k: { fr: "Client", ar: "العميل" }, v: { fr: "Mattel", ar: "ماتل (Mattel)" } },
      { k: { fr: "Date", ar: "التاريخ" }, v: { fr: "Novembre 2026", ar: "نوفمبر 2026" } },
      { k: { fr: "Lieu", ar: "المكان" }, v: { fr: "Nouakchott", ar: "نواكشوط" } },
    ],
    story: {
      need: {
        fr: "Rendre la 5G de Mattel tangible pour le public, au plus près des clients.",
        ar: "جعل الجيل الخامس لماتل ملموساً للجمهور، في أقرب نقطة من العملاء.",
      },
      approach: {
        fr: "Des expériences en réalité virtuelle installées et animées par notre équipe à chaque étape de la tournée de lancement.",
        ar: "تجارب واقع افتراضي يركّبها فريقنا ويديرها في كل محطة من جولة الإطلاق.",
      },
      result: {
        fr: "Un public au contact direct de la nouvelle génération, à travers une expérience immersive.",
        ar: "جمهور على تماس مباشر مع الجيل الجديد، عبر تجربة غامرة.",
      },
    },
    scenes: [
      { media: img("mattel-bus-smile", 940, 1175), title: { fr: "La 5G Mattel, en réalité virtuelle.", ar: "الجيل الخامس لماتل، بالواقع الافتراضي." } },
      {
        media: img("mattel-bus-femme", 1080, 1350),
        kicker: K.need,
        title: { fr: "La 5G Mattel, au plus près des clients.", ar: "الجيل الخامس لماتل، في أقرب نقطة من العملاء." },
        text: { fr: "Rendre la nouvelle génération tangible pour le public.", ar: "جعل الجيل الجديد ملموساً للجمهور." },
      },
      {
        media: img("mattel-bus-daraa", 1080, 1350),
        kicker: K.approach,
        title: { fr: "Des expériences VR à chaque étape.", ar: "تجارب واقع افتراضي في كل محطة." },
        text: { fr: "Installées et animées par notre équipe tout au long de la tournée de lancement.", ar: "يركّبها فريقنا ويديرها طوال جولة الإطلاق." },
      },
      {
        media: vid("mattel-bus-hl", 720, 960),
        kicker: K.live,
        title: { fr: "Chacun vit l'expérience à sa façon.", ar: "كلٌّ يعيش التجربة على طريقته." },
      },
      {
        media: img("mattel-bus-pull", 1080, 1350),
        kicker: K.result,
        title: { fr: "Le public au contact de la nouvelle génération.", ar: "الجمهور على تماس مع الجيل الجديد." },
        text: { fr: "Une découverte directe de la 5G, à travers une expérience immersive.", ar: "اكتشاف مباشر للجيل الخامس، عبر تجربة غامرة." },
      },
    ],
    gallery: [
      p("mattel-p1", "Une visiteuse plonge dans l'expérience 5G", "زائرة تنغمس في تجربة الجيل الخامس", 810, 1080),
      p("mattel-wide", "Un sourire, la 5G sous les yeux", "ابتسامة، والجيل الخامس أمام عينيه", 1150, 647),
      p("mattel-p2", "L'expérience VR avec la 5G Mattel", "تجربة الواقع الافتراضي مع الجيل الخامس لماتل", 660, 880),
      p("mattel-p3", "Immersion totale", "انغماس كامل في التجربة", 810, 1080),
    ],
  },
  {
    slug: "snim",
    category: "training",
    title: { fr: "Soldamatic à la SNIM — Zouérate", ar: "Soldamatic في SNIM — الزويرات" },
    short: { fr: "Soudage en réalité augmentée · centre de formation", ar: "لحام بالواقع المعزّز · مركز التكوين" },
    meta: { fr: "Formation · Zouérate · 2025", ar: "تدريب · الزويرات · 2025" },
    cover: { ...p("snim-team", "L'équipe et le dispositif Soldamatic installé à la SNIM", "الفريق وجهاز Soldamatic بعد تركيبه في SNIM", 1280, 960), pos: "60% 40%" },
    intro: {
      fr: "Premier client de notre représentation officielle Seabery : le centre de formation de la SNIM à Zouérate est le premier en Mauritanie à adopter Soldamatic, livré, installé et mis en service par Moon.",
      ar: "أول عميل في إطار تمثيلنا الرسمي لـ Seabery: مركز التكوين التابع لـ SNIM في الزويرات هو الأول في موريتانيا الذي يعتمد Soldamatic، وقد ورّدته Moon وركّبته وشغّلته.",
    },
    facts: [
      { k: { fr: "Client", ar: "العميل" }, v: { fr: "SNIM — centre de formation, Zouérate", ar: "SNIM — مركز التكوين، الزويرات" } },
      { k: { fr: "Solution", ar: "الحل" }, v: { fr: "Soldamatic (Seabery)", ar: "Soldamatic (Seabery)" } },
      { k: { fr: "Prestation", ar: "الخدمة" }, v: { fr: "Livraison, installation, formation des formateurs", ar: "التوريد والتركيب وتكوين المدرّبين" } },
      { k: { fr: "Année", ar: "السنة" }, v: { fr: "2025", ar: "2025" } },
    ],
    story: {
      need: { fr: "Former au soudage en sécurité et à moindre coût.", ar: "التدريب على اللحام بأمان وبتكلفة أقل." },
      approach: { fr: "Soldamatic livré, installé et calibré sur site.", ar: "توريد Soldamatic وتركيبه ومعايرته في الموقع." },
      result: { fr: "Les instructeurs de la SNIM, formés sur place, dirigent aujourd'hui le centre.", ar: "مدرّبو SNIM، بعد تكوينهم في الموقع، يديرون المركز اليوم." },
    },
    scenes: [
      { media: img("snim-team", 1280, 960), title: { fr: "Le premier centre Soldamatic de Mauritanie.", ar: "أول مركز Soldamatic في موريتانيا." } },
      {
        media: img("snim-team", 1280, 960),
        kicker: K.approach,
        title: { fr: "Livré, installé et mis en service sur site.", ar: "توريد وتركيب وتشغيل في الموقع." },
        text: {
          fr: "Simulation de soudage en réalité augmentée : angle et vitesse du geste mesurés en temps réel, sans arc ni fumée.",
          ar: "محاكاة لحام بالواقع المعزّز: زاوية الحركة وسرعتها تُقاس لحظياً، دون قوس كهربائي ولا دخان.",
        },
      },
      {
        media: img("snim-group", 1280, 960),
        kicker: K.result,
        title: { fr: "Des formateurs autonomes.", ar: "مدرّبون مستقلّون." },
        text: {
          fr: "Les instructeurs de la SNIM, formés sur place par notre équipe, dirigent aujourd'hui le centre au quotidien.",
          ar: "مدرّبو SNIM، الذين كوّنهم فريقنا في الموقع، يديرون المركز يومياً اليوم.",
        },
      },
    ],
    gallery: [p("snim-team", "L'équipe et le dispositif Soldamatic", "الفريق وجهاز Soldamatic", 1280, 960), p("snim-group", "Les stagiaires du centre de formation", "متدرّبو مركز التكوين", 1280, 960)],
  },
  {
    slug: "eetfp",
    category: "training",
    title: { fr: "3 simulateurs de soudage — EETFP", ar: "3 محاكيات لحام — EETFP" },
    short: { fr: "Soldamatic · Skillveri AURA · WAVE NG", ar: "Soldamatic · Skillveri AURA · WAVE NG" },
    meta: { fr: "Formation · Nouakchott · 2025", ar: "تدريب · نواكشوط · 2025" },
    cover: { ...p("eetfp-simulator", "Un formateur teste un simulateur de soudage à l'EETFP", "مدرّب يجرّب محاكي لحام في EETFP", 1061, 853), pos: "60% 30%" },
    intro: {
      fr: "Au lycée technique de Nouakchott (EETFP), trois simulateurs de soudage permettent aux élèves de répéter les gestes sans risque et sans consommer de matière.",
      ar: "في الثانوية الفنية بنواكشوط (EETFP)، تتيح ثلاثة محاكيات لحام للطلاب تكرار الحركات بلا خطر ودون استهلاك المواد.",
    },
    facts: [
      { k: { fr: "Client", ar: "العميل" }, v: { fr: "EETFP — lycée technique de Nouakchott", ar: "EETFP — الثانوية الفنية بنواكشوط" } },
      { k: { fr: "Prestation", ar: "الخدمة" }, v: { fr: "Fourniture et installation", ar: "التوريد والتركيب" } },
      { k: { fr: "Simulateurs", ar: "المحاكيات" }, v: { fr: "Soldamatic · Skillveri AURA · WAVE NG", ar: "Soldamatic · Skillveri AURA · WAVE NG" } },
    ],
    story: {
      need: {
        fr: "Former au soudage sans risque pour les élèves et sans gaspiller de matière.",
        ar: "التدريب على اللحام دون خطر على الطلاب ودون هدر للمواد.",
      },
      approach: {
        fr: "Trois simulateurs fournis et installés : Soldamatic, Skillveri AURA et WAVE NG.",
        ar: "ثلاثة محاكيات ورّدناها وركّبناها: Soldamatic وSkillveri AURA وWAVE NG.",
      },
      result: {
        fr: "Les élèves répètent les gestes autant que nécessaire avant de passer au poste réel.",
        ar: "يكرّر الطلاب الحركات بقدر ما يحتاجون قبل الانتقال إلى الورشة الحقيقية.",
      },
    },
    scenes: [
      { media: img("eetfp-zspace", 1600, 1200), title: { fr: "Une première pour l'enseignement professionnel.", ar: "سابقة في التعليم المهني." } },
      {
        media: img("eetfp-soldamatic", 1200, 1600),
        kicker: { fr: "Soldamatic by Seabery", ar: "Soldamatic من Seabery" },
        title: { fr: "Le soudage en réalité augmentée.", ar: "اللحام بالواقع المعزّز." },
        text: { fr: "Pratique répétée sans consommer de matière.", ar: "تمرين متكرر دون استهلاك المواد." },
      },
      {
        media: img("eetfp-skillveri", 1200, 1600),
        kicker: { fr: "Skillveri AURA", ar: "Skillveri AURA" },
        title: { fr: "La réalité mixte sur Meta Quest 3.", ar: "الواقع المختلط على Meta Quest 3." },
        text: { fr: "Gestes de soudage réels, suivis et évalués.", ar: "حركات لحام حقيقية، تُتابَع وتُقيَّم." },
      },
      {
        media: img("eetfp-wave", 1200, 1600),
        kicker: K.result,
        title: { fr: "Installation et formation intensive en deux jours.", ar: "تركيب وتكوين مكثّف في يومين." },
        text: {
          fr: "WAVE NG et la plateforme Vulcan pour suivre les résultats : les formateurs pilotent désormais les exercices.",
          ar: "WAVE NG ومنصة Vulcan لمتابعة النتائج: صار المدرّبون يديرون التمارين بأنفسهم.",
        },
      },
    ],
    gallery: [p("eetfp-simulator", "Prise en main d'un simulateur", "التعرّف على المحاكي", 1061, 853)],
  },
  {
    slug: "gitex-africa",
    category: "event",
    title: { fr: "GITEX Africa 2026 — Marrakech", ar: "GITEX Africa 2026 — مراكش" },
    short: { fr: "Démonstrations VR sur casques Moon", ar: "عروض واقع افتراضي بنظارات Moon" },
    meta: { fr: "Salon international · Avril 2026", ar: "معرض دولي · أبريل 2026" },
    cover: { ...p("gitex-visit", "Un visiteur teste un casque Moon au GITEX Africa", "زائر يجرّب نظارة Moon في GITEX Africa", 1200, 1600), pos: "50% 35%" },
    intro: {
      fr: "Du 7 au 9 avril 2026 à Marrakech, Moon Technology a présenté ses solutions au plus grand salon technologique du continent, avec des démonstrations sur casques de marque Moon.",
      ar: "من 7 إلى 9 أبريل 2026 في مراكش، عرضت Moon Technology حلولها في أكبر معرض تقني في القارة، مع عروض تجريبية بنظارات تحمل علامة Moon.",
    },
    facts: [
      { k: { fr: "Événement", ar: "الحدث" }, v: { fr: "GITEX Africa 2026", ar: "GITEX Africa 2026" } },
      { k: { fr: "Lieu", ar: "المكان" }, v: { fr: "Marrakech, Maroc", ar: "مراكش، المغرب" } },
      { k: { fr: "Dates", ar: "التاريخ" }, v: { fr: "7 – 9 avril 2026", ar: "7 – 9 أبريل 2026" } },
    ],
    story: {
      need: { fr: "Présenter nos solutions à l'échelle du continent.", ar: "تقديم حلولنا على مستوى القارة." },
      approach: { fr: "Démonstrations sur casques Moon.", ar: "عروض تجريبية بنظارات Moon." },
      result: { fr: "De nouveaux partenariats et des opportunités en Afrique.", ar: "شراكات وفرص جديدة في أفريقيا." },
    },
    scenes: [
      { media: img("gitex-sign", 1200, 1600), title: { fr: "Nos casques au plus grand salon tech d'Afrique.", ar: "نظاراتنا في أكبر معرض تقني في أفريقيا." } },
      {
        media: img("gitex-visit", 1200, 1600),
        kicker: K.live,
        title: { fr: "Des démonstrations sur casques Moon.", ar: "عروض تجريبية بنظارات Moon." },
        text: { fr: "Responsables et visiteurs ont testé nos expériences immersives sur le stand.", ar: "جرّب المسؤولون والزوار تجاربنا الغامرة في الجناح." },
      },
      {
        media: img("gitex-demo", 1200, 1600),
        kicker: { fr: "Sur le stand", ar: "في الجناح" },
        title: { fr: "Des échanges avec partenaires et clients.", ar: "لقاءات مع الشركاء والعملاء." },
      },
      {
        media: img("gitex-um6p", 800, 1066),
        kicker: K.result,
        title: { fr: "De nouveaux partenariats.", ar: "شراكات جديدة." },
        text: {
          fr: "De nombreux partenariats établis et des opportunités avec des clients en Mauritanie et sur le continent africain.",
          ar: "شراكات عديدة وفرص مع عملاء في موريتانيا وفي القارة الأفريقية.",
        },
      },
    ],
    gallery: [p("gitex-visit", "Démonstration au GITEX Africa", "عرض في GITEX Africa", 1200, 1600)],
  },
  {
    slug: "salons-nationaux",
    category: "event",
    title: { fr: "Salons et forums nationaux", ar: "المعارض والمنتديات الوطنية" },
    short: { fr: "NEF · Forum de l'Emploi et du Numérique · exposition MPG", ar: "NEF · منتدى التشغيل والرقمنة · معرض MPG" },
    meta: { fr: "Événements · Nouakchott · 2026", ar: "فعاليات · نواكشوط · 2026" },
    cover: { ...p("salon-nef", "Démonstration VR au National Energy Forum", "عرض واقع افتراضي في المنتدى الوطني للطاقة", 1600, 1195), pos: "60% 40%" },
    intro: {
      fr: "Au National Energy Forum, au Forum de l'Emploi et du Numérique et lors de l'exposition de notre partenaire MPG, responsables, étudiants et professionnels ont testé nos applications de réalité virtuelle.",
      ar: "في المنتدى الوطني للطاقة، ومنتدى التشغيل والرقمنة، ومعرض شريكنا MPG، جرّب مسؤولون وطلاب ومهنيون تطبيقاتنا للواقع الافتراضي.",
    },
    facts: [
      { k: { fr: "Événements", ar: "الفعاليات" }, v: { fr: "NEF · Forum de l'Emploi et du Numérique · Expo MPG", ar: "NEF · منتدى التشغيل والرقمنة · معرض MPG" } },
      { k: { fr: "Lieu", ar: "المكان" }, v: { fr: "Nouakchott", ar: "نواكشوط" } },
      { k: { fr: "Partenaire", ar: "الشريك" }, v: { fr: "MPG", ar: "MPG" } },
    ],
    story: {
      need: { fr: "Faire découvrir la VR au public professionnel.", ar: "تعريف الجمهور المهني بالواقع الافتراضي." },
      approach: { fr: "Applications VR et impression 3D, avec MPG.", ar: "تطبيقات واقع افتراضي وطباعة ثلاثية الأبعاد، مع MPG." },
      result: { fr: "Responsables, étudiants et professionnels ont testé nos solutions.", ar: "جرّب مسؤولون وطلاب ومهنيون حلولنا." },
    },
    scenes: [
      { media: img("salon-nef", 1600, 1195), title: { fr: "La VR au cœur des grands rendez-vous nationaux.", ar: "الواقع الافتراضي في قلب أهم المواعيد الوطنية." } },
      {
        media: img("salon-nef-2", 800, 534),
        kicker: { fr: "National Energy Forum", ar: "المنتدى الوطني للطاقة" },
        title: { fr: "Applications VR et impression 3D, aux côtés de MPG.", ar: "تطبيقات واقع افتراضي وطباعة ثلاثية الأبعاد، إلى جانب MPG." },
      },
      {
        media: img("salon-mpg", 800, 600),
        kicker: { fr: "Exposition MPG", ar: "معرض MPG" },
        title: { fr: "Partenaire VR de MPG lors de son exposition.", ar: "شريك الواقع الافتراضي لـ MPG في معرضها." },
      },
      {
        media: img("salon-forum", 800, 1066),
        kicker: { fr: "Forum de l'Emploi et du Numérique", ar: "منتدى التشغيل والرقمنة" },
        title: { fr: "À la rencontre des étudiants et des jeunes talents.", ar: "لقاء مع الطلاب والمواهب الشابة." },
        text: {
          fr: "Organisé par l'Institut supérieur du numérique avec l'Agence Techghil.",
          ar: "نظّمه المعهد العالي للرقمنة بالتعاون مع وكالة تشغيل.",
        },
      },
    ],
    gallery: [p("salon-nef", "Démonstration VR", "عرض واقع افتراضي", 1600, 1195)],
  },
  {
    slug: "field-ready-vr",
    category: "dev",
    title: { fr: "Field Ready VR", ar: "Field Ready VR" },
    short: { fr: "Application maison · sécurité industrielle", ar: "تطبيقنا · السلامة الصناعية" },
    meta: { fr: "Développement · Application maison", ar: "تطوير · تطبيقنا" },
    cover: p("fieldready-site", "Vue d'ensemble du site industriel de Field Ready VR", "منظر عام للموقع الصناعي في Field Ready VR", 1920, 1081),
    intro: {
      fr: "Formation à la sécurité industrielle dans un site réaliste : équipements de protection, feu de gaz, consignation (LOTO). Guidage pas à pas, score immédiat, interaction avec les mains.",
      ar: "تدريب على السلامة الصناعية في موقع واقعي: معدات الحماية، حريق الغاز، والإقفال الآمن (LOTO). توجيه خطوة بخطوة، ونتيجة فورية، وتفاعل باليدين.",
    },
    facts: [
      { k: { fr: "Type", ar: "النوع" }, v: { fr: "Simulation VR développée par Moon", ar: "محاكاة واقع افتراضي من تطوير Moon" } },
      { k: { fr: "Thèmes", ar: "المحاور" }, v: { fr: "EPI · Feu de gaz · LOTO", ar: "معدات الحماية · حريق الغاز · LOTO" } },
      { k: { fr: "Interaction", ar: "التفاعل" }, v: { fr: "Mains, sans manettes", ar: "باليدين، دون أذرع تحكم" } },
    ],
    story: {
      need: {
        fr: "Former à la sécurité industrielle sans exposer les équipes au danger réel.",
        ar: "التدريب على السلامة الصناعية دون تعريض الفرق للخطر الحقيقي.",
      },
      approach: {
        fr: "Une simulation développée par Moon : équipements de protection, feu de gaz et consignation (LOTO), guidée pas à pas.",
        ar: "محاكاة من تطوير Moon: معدات الحماية وحريق الغاز والإقفال الآمن (LOTO)، بتوجيه خطوة بخطوة.",
      },
      result: {
        fr: "Des réflexes de sécurité pratiqués dans un site réaliste, avec un score immédiat à la fin.",
        ar: "ردود فعل السلامة تُمارَس في موقع واقعي، مع نتيجة فورية في النهاية.",
      },
    },
    scenes: [
      { media: img("fieldready-site", 1920, 1081), title: { fr: "La sécurité industrielle, apprise en VR.", ar: "السلامة الصناعية، تُتعلَّم بالواقع الافتراضي." } },
      {
        media: img("fieldready-pompe", 1920, 1080),
        kicker: K.need,
        title: { fr: "Se former au danger, sans danger.", ar: "التدرّب على الخطر، دون خطر." },
        text: { fr: "Former à la sécurité industrielle sans exposer les équipes au danger réel.", ar: "التدريب على السلامة الصناعية دون تعريض الفرق للخطر الحقيقي." },
      },
      {
        media: img("fieldready-incendie-conduites", 1920, 1080),
        kicker: K.approach,
        title: { fr: "Une simulation développée par Moon.", ar: "محاكاة من تطوير Moon." },
        text: { fr: "EPI, feu de gaz et consignation (LOTO), dans un site industriel réaliste guidé pas à pas.", ar: "معدات الحماية وحريق الغاز والإقفال الآمن (LOTO)، في موقع صناعي واقعي بتوجيه خطوة بخطوة." },
      },
      {
        media: img("fieldready-point-incendie", 1920, 1080),
        kicker: K.result,
        title: { fr: "Des réflexes de sécurité, pratiqués.", ar: "ردود فعل السلامة، بالممارسة." },
        text: { fr: "Interaction avec les mains et score immédiat à la fin.", ar: "تفاعل باليدين، ونتيجة فورية في النهاية." },
      },
    ],
    gallery: [
      p("fieldready-pompe", "La station de pompage", "محطة الضخ", 1920, 1080),
      p("fieldready-incendie-conduites", "Feu sur les conduites de gaz", "حريق في أنابيب الغاز", 1920, 1080),
      p("fieldready-point-incendie", "Le point incendie", "نقطة مكافحة الحريق", 1920, 1080),
    ],
    placeholders: [
      { kind: "video", label: { fr: "Vidéo de la simulation — à venir", ar: "فيديو المحاكاة — قريباً" } },
      { kind: "image", label: { fr: "Captures dans le casque — à venir", ar: "لقطات من داخل النظارة — قريباً" } },
    ],
  },
];

export const getProject = (slug: string) => projects.find((x) => x.slug === slug);

export type Org = { name: string; logo: string; r: number; url?: string; role?: T; text?: T; points?: T[] };

export const clients: Org[] = [
  { name: "Moov Mauritel", logo: "/media/logos/moov.png", r: 1.66 },
  { name: "Mattel", logo: "/media/logos/mattel-logo.png", r: 2.88 },
  { name: "MPG", logo: "/media/logos/mpg-logo.png", r: 0.6 },
];

export const partners: Org[] = [
  {
    name: "Seabery",
    logo: "/media/logos/seabery.png",
    r: 4.88,
    url: "https://seabery.com",
    role: { fr: "Représentant officiel en Mauritanie", ar: "الممثل الرسمي في موريتانيا" },
    text: {
      fr: "Concepteur de Soldamatic, la plateforme de soudage en réalité augmentée, que nous installons et accompagnons en Mauritanie.",
      ar: "مطوّر Soldamatic، منصة اللحام بالواقع المعزز، التي نركّبها ونرافقها في موريتانيا.",
    },
  },
  {
    name: "MPG",
    logo: "/media/logos/mpg-logo.png",
    r: 0.6,
    role: { fr: "Partenaire institutionnel", ar: "شريك مؤسسي" },
    text: {
      fr: "Institut de formation partenaire de Moon XR : nous portons ensemble des ateliers, des programmes de formation et des projets de R&D.",
      ar: "معهد تكوين شريك لـ Moon XR: ننفّذ معاً ورشات وبرامج تدريب ومشاريع بحث وتطوير.",
    },
  },
];

export const suppliers: Org[] = [
  { name: "Seabery", logo: "/media/logos/seabery.png", r: 4.88, role: { fr: "Soudage en RA", ar: "لحام بالواقع المعزز" } },
  { name: "Skillveri", logo: "/media/logos/skillveri.png", r: 3.35, role: { fr: "Soudage & peinture en VR", ar: "لحام وطلاء بالواقع الافتراضي" } },
  { name: "Mimbus", logo: "/media/logos/mimbus.png", r: 2.67, role: { fr: "Simulateurs de formation", ar: "محاكيات تدريب" } },
  { name: "3D Organon", logo: "/media/logos/3d-organon.png", r: 2.83, role: { fr: "Anatomie en VR", ar: "التشريح بالواقع الافتراضي" } },
  { name: "Avantis · ClassVR", logo: "/media/logos/classvr.png", r: 5.08, role: { fr: "VR pour l'éducation", ar: "الواقع الافتراضي للتعليم" } },
  { name: "PIXO VR", logo: "/media/logos/pixo-vr.png", r: 3.73, role: { fr: "Formation sécurité", ar: "تدريب السلامة" } },
  { name: "Luminous XR", logo: "/media/logos/luminous-xr.png", r: 6.44, role: { fr: "Plateforme XR", ar: "منصة XR" } },
  { name: "GW Pro", logo: "/media/logos/gw-pro.png", r: 2.12 },
];
