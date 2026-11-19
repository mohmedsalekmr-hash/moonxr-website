import type { T } from "./i18n";

export type Category = "event" | "training" | "dev";

export const categories: Record<Category, T> = {
  event: { fr: "Événements", ar: "فعاليات", en: "Events" },
  training: { fr: "Formation", ar: "تدريب", en: "Training" },
  dev: { fr: "Développement", ar: "تطوير", en: "Development" },
};

/** The small yellow label on project images (same as the presentation deck) */
export const projectTag: Record<Category, T> = {
  event: { fr: "Événement", ar: "فعالية", en: "Event" },
  training: { fr: "Projet livré", ar: "مشروع منجَز", en: "Project delivered" },
  dev: { fr: "En développement", ar: "قيد التطوير", en: "In development" },
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

const p = (src: string, fr: string, ar: string, en: string, w = 1080, h = 810): Photo => ({
  src: `/media/photos/${src}.webp`,
  alt: { fr, ar, en },
  w,
  h,
});


/** Media keeps its real proportions and size (w × h in pixels); it is never cropped or blown up. */
const img = (src: string, w: number, h: number): Scene["media"] => ({ type: "image", src: `/media/photos/${src}.webp`, w, h });
const vid = (name: string, w: number, h: number): Scene["media"] => ({ type: "video", src: `/media/video/${name}.mp4`, poster: `/media/photos/${name}-poster.webp`, w, h });
const K = {
  need: { fr: "Le besoin", ar: "الحاجة", en: "The need" },
  approach: { fr: "Notre réponse", ar: "ما قدّمناه", en: "Our response" },
  result: { fr: "Le résultat", ar: "النتيجة", en: "The result" },
  live: { fr: "Sur place", ar: "في الموقع", en: "On site" },
};


export const projects: Project[] = [
  {
    slug: "moov-mauritel",
    category: "event",
    title: { fr: "Lancement 5G — Moov Mauritel", ar: "إطلاق الجيل الخامس — موريتل", en: "5G launch — Moov Mauritel" },
    short: { fr: "Activation VR · 4 casques, jeux et simulations", ar: "تجربة واقع افتراضي · 4 نظارات، ألعاب ومحاكاة", en: "VR activation · 4 headsets, games and simulations" },
    meta: { fr: "Événement · Novembre 2026", ar: "فعالية · نوفمبر 2026", en: "Event · November 2026" },
    cover: { ...p("moov-pro-stand", "Un visiteur en pleine expérience VR sur l'espace Moon x Moov Mauritel", "زائر في قلب تجربة الواقع الافتراضي في فضاء Moon x موريتل", "A visitor in the middle of a VR experience at the Moon x Moov Mauritel space", 1188, 792), pos: "55% 35%" },
    intro: {
      fr: "Pour le lancement de la 5G de Moov Mauritel, nous avons conçu et animé un espace de réalité virtuelle : jeux, simulations et une équipe Moon à chaque poste.",
      ar: "لإطلاق الجيل الخامس لموريتل، صمّمنا وأدرنا فضاءً للواقع الافتراضي: ألعاب ومحاكاة، وفريق Moon عند كل نظارة.", en: "For the Moov Mauritel 5G launch, we designed and ran a virtual reality space: games, simulations and a Moon team member at every station.",
    },
    facts: [
      { k: { fr: "Client", ar: "العميل", en: "Client" }, v: { fr: "Moov Mauritel", ar: "موريتل (Moov)", en: "Moov Mauritel" } },
      { k: { fr: "Date", ar: "التاريخ", en: "Date" }, v: { fr: "12 novembre 2026", ar: "12 نوفمبر 2026", en: "12 November 2026" } },
      { k: { fr: "Lieu", ar: "المكان", en: "Location" }, v: { fr: "Hôtel Sheraton, Nouakchott", ar: "فندق شيراتون، نواكشوط", en: "Sheraton Hotel, Nouakchott" } },
      { k: { fr: "Dispositif", ar: "التجهيز", en: "Setup" }, v: { fr: "4 casques · 4 écrans", ar: "4 نظارات · 4 شاشات", en: "4 headsets · 4 screens" } },
    ],
    story: {
      need: {
        fr: "Faire vivre la 5G au public le jour du lancement, de façon concrète et mémorable.",
        ar: "أن يعيش الجمهور تجربة الجيل الخامس يوم الإطلاق، بشكل ملموس لا يُنسى.", en: "Bring 5G to life for the public on launch day, in a concrete and memorable way.",
      },
      approach: {
        fr: "Un espace VR de quatre casques et quatre écrans : jeux, Pilgrim VR et Field Ready VR, avec un membre de l'équipe à chaque poste.",
        ar: "فضاء واقع افتراضي من أربع نظارات وأربع شاشات: ألعاب وPilgrim VR وField Ready VR، مع فرد من الفريق عند كل نظارة.", en: "A VR space with four headsets and four screens: games, Pilgrim VR and Field Ready VR, with a team member at every station.",
      },
      result: {
        fr: "Officiels et visiteurs ont découvert la 5G casque sur la tête, accompagnés du début à la fin.",
        ar: "اكتشف المسؤولون والزوار الجيل الخامس والنظارة على رؤوسهم، بمرافقة من البداية إلى النهاية.", en: "Officials and visitors discovered 5G with a headset on, accompanied from start to finish.",
      },
    },
    scenes: [
      { media: vid("moov-officiel-hl", 480, 848), title: { fr: "Faire vivre la 5G, casque sur la tête.", ar: "أن تعيش الجيل الخامس، والنظارة على رأسك.", en: "Living 5G, headset on." } },
            {
        media: img("moov-c", 1080, 810),
        kicker: K.approach,
        title: { fr: "Un espace VR de quatre casques et quatre écrans.", ar: "فضاء واقع افتراضي من أربع نظارات وأربع شاشات.", en: "A VR space with four headsets and four screens." },
        text: { fr: "Jeux, Pilgrim VR et Field Ready VR, avec un membre de l'équipe Moon à chaque poste.", ar: "ألعاب وPilgrim VR وField Ready VR، مع فرد من فريق Moon عند كل نظارة.", en: "Games, Pilgrim VR and Field Ready VR, with a Moon team member at every station." },
      },
      {
        media: img("moov-minister", 800, 1066),
        kicker: { fr: "Visite officielle", ar: "زيارة رسمية", en: "Official visit" },
        title: { fr: "Le ministre de la Transformation numérique sur le stand.", ar: "وزير التحول الرقمي في الجناح.", en: "The Minister of Digital Transformation at the stand." },
        text: { fr: "Il a exploré la Grande Mosquée de La Mecque en réalité virtuelle.", ar: "استكشف المسجد الحرام بالواقع الافتراضي.", en: "He explored the Grand Mosque of Mecca in virtual reality." },
      },
      {
        media: img("moov-hq-kaaba", 810, 1080),
        kicker: K.live,
        title: { fr: "Face à la Kaaba, depuis Nouakchott.", ar: "أمام الكعبة، من نواكشوط.", en: "Facing the Kaaba, from Nouakchott." },
        text: { fr: "Pilgrim VR, l'une des expériences proposées sur le stand.", ar: "Pilgrim VR، إحدى التجارب المقدَّمة في الجناح.", en: "Pilgrim VR, one of the experiences offered at the stand." },
      },
      {
        media: img("moov-pro-officials", 1188, 792),
        kicker: K.result,
        title: { fr: "Officiels et visiteurs, casque sur la tête.", ar: "مسؤولون وزوار، والنظارة على رؤوسهم.", en: "Officials and visitors, headsets on." },
        text: { fr: "Chacun a découvert la 5G accompagné par notre équipe, du début à la fin.", ar: "اكتشف كلٌّ منهم الجيل الخامس بمرافقة فريقنا، من البداية إلى النهاية.", en: "Everyone discovered 5G accompanied by our team, from start to finish." },
      },
    ],
    gallery: [
      p("moov-p1", "Pilgrim VR : la Kaaba, casque sur la tête", "Pilgrim VR: الكعبة أمامك والنظارة على رأسك", "Pilgrim VR: the Kaaba, headset on", 810, 1080),
      p("moov-wide", "L'espace Moon x Moov Mauritel, le jour du lancement", "فضاء Moon x موريتل يوم الإطلاق", "The Moon x Moov Mauritel space on launch day", 1080, 608),
      p("moov-p2", "Une visiteuse découvre l'expérience", "زائرة تكتشف التجربة", "A visitor discovers the experience", 660, 880),
      p("moov-p3", "Immersion au cœur de La Mecque", "انغماس في رحاب مكة", "Immersed in the heart of Mecca", 810, 1080),
      p("moov-vip", "Les officiels découvrent les casques", "المسؤولون يكتشفون النظارات", "Officials discover the headsets"),
    ],
  },
  {
    slug: "mattel",
    category: "event",
    title: { fr: "Lancement 5G — Mattel", ar: "إطلاق الجيل الخامس — ماتل", en: "5G launch — Mattel" },
    short: { fr: "Expérience VR pour le lancement de la 5G", ar: "تجربة واقع افتراضي لإطلاق الجيل الخامس", en: "VR experience for the 5G launch" },
    meta: { fr: "Événement · Novembre 2026", ar: "فعالية · نوفمبر 2026", en: "Event · November 2026" },
    cover: { ...p("mattel-bus-femme", "Une visiteuse découvre la 5G Mattel en réalité virtuelle", "زائرة تكتشف الجيل الخامس لماتل بالواقع الافتراضي", "A visitor discovers Mattel 5G in virtual reality", 1080, 1350), pos: "50% 30%" },
    intro: {
      fr: "Pour le lancement de la 5G de Mattel, nous avons fait vivre la nouvelle génération au public à travers des expériences en réalité virtuelle.",
      ar: "في إطلاق الجيل الخامس لماتل، جعلنا الجمهور يعيش الجيل الجديد عبر تجارب الواقع الافتراضي.", en: "For the Mattel 5G launch, we let the public experience the new generation through virtual reality.",
    },
    facts: [
      { k: { fr: "Client", ar: "العميل", en: "Client" }, v: { fr: "Mattel", ar: "ماتل (Mattel)", en: "Mattel" } },
      { k: { fr: "Date", ar: "التاريخ", en: "Date" }, v: { fr: "Novembre 2026", ar: "نوفمبر 2026", en: "November 2026" } },
      { k: { fr: "Lieu", ar: "المكان", en: "Location" }, v: { fr: "Nouakchott", ar: "نواكشوط", en: "Nouakchott" } },
    ],
    story: {
      need: {
        fr: "Rendre la 5G de Mattel tangible pour le public, au plus près des clients.",
        ar: "جعل الجيل الخامس لماتل ملموساً للجمهور، في أقرب نقطة من العملاء.", en: "Make Mattel's 5G tangible for the public, as close to customers as possible.",
      },
      approach: {
        fr: "Des expériences en réalité virtuelle installées et animées par notre équipe à chaque étape de la tournée de lancement.",
        ar: "تجارب واقع افتراضي يركّبها فريقنا ويديرها في كل محطة من جولة الإطلاق.", en: "Virtual reality experiences installed and run by our team at every stage of the launch tour.",
      },
      result: {
        fr: "Un public au contact direct de la nouvelle génération, à travers une expérience immersive.",
        ar: "جمهور على تماس مباشر مع الجيل الجديد، عبر تجربة غامرة.", en: "A public in direct contact with the new generation, through an immersive experience.",
      },
    },
    scenes: [
      { media: img("mattel-bus-smile", 940, 1175), title: { fr: "La 5G Mattel, en réalité virtuelle.", ar: "الجيل الخامس لماتل، بالواقع الافتراضي.", en: "Mattel 5G, in virtual reality." } },
      {
        media: img("mattel-bus-poster", 810, 1080),
        kicker: K.need,
        title: { fr: "La 5G Mattel, au plus près des clients.", ar: "الجيل الخامس لماتل، في أقرب نقطة من العملاء.", en: "Mattel 5G, close to customers." },
        text: { fr: "Rendre la nouvelle génération tangible pour le public.", ar: "جعل الجيل الجديد ملموساً للجمهور.", en: "Making the new generation tangible for the public." },
      },
      {
        media: img("mattel-bus-daraa", 1080, 1350),
        kicker: K.approach,
        title: { fr: "Des expériences VR à chaque étape.", ar: "تجارب واقع افتراضي في كل محطة.", en: "VR experiences at every stage." },
        text: { fr: "Installées et animées par notre équipe tout au long de la tournée de lancement.", ar: "يركّبها فريقنا ويديرها طوال جولة الإطلاق.", en: "Installed and run by our team throughout the launch tour." },
      },
      {
        media: vid("mattel-bus-hl", 720, 960),
        kicker: K.live,
        title: { fr: "Chacun vit l'expérience à sa façon.", ar: "كلٌّ يعيش التجربة على طريقته.", en: "Everyone lives the experience their own way." },
      },
      {
        media: img("mattel-bus-visiteuse", 810, 1080),
        kicker: K.result,
        title: { fr: "Le public au contact de la nouvelle génération.", ar: "الجمهور على تماس مع الجيل الجديد.", en: "The public meets the new generation." },
        text: { fr: "Une découverte directe de la 5G, à travers une expérience immersive.", ar: "اكتشاف مباشر للجيل الخامس، عبر تجربة غامرة.", en: "A first-hand discovery of 5G, through an immersive experience." },
      },
    ],
    gallery: [
      p("mattel-p1", "Une visiteuse plonge dans l'expérience 5G", "زائرة تنغمس في تجربة الجيل الخامس", "A visitor dives into the 5G experience", 810, 1080),
      p("mattel-wide", "Un sourire, la 5G sous les yeux", "ابتسامة، والجيل الخامس أمام عينيه", "A smile, with 5G before their eyes", 1150, 647),
      p("mattel-p2", "L'expérience VR avec la 5G Mattel", "تجربة الواقع الافتراضي مع الجيل الخامس لماتل", "The VR experience with Mattel 5G", 660, 880),
      p("mattel-p3", "Immersion totale", "انغماس كامل في التجربة", "Total immersion", 810, 1080),
    ],
  },
  {
    slug: "snim",
    category: "training",
    title: { fr: "Soldamatic à la SNIM — Zouérate", ar: "Soldamatic في SNIM — الزويرات", en: "Soldamatic at SNIM — Zouérate" },
    short: { fr: "Soudage en réalité augmentée · centre de formation", ar: "لحام بالواقع المعزّز · مركز التكوين", en: "Augmented reality welding · training centre" },
    meta: { fr: "Formation · Zouérate · 2025", ar: "تدريب · الزويرات · 2025", en: "Training · Zouérate · 2025" },
    cover: { ...p("snim-team", "L'équipe et le dispositif Soldamatic installé à la SNIM", "الفريق وجهاز Soldamatic بعد تركيبه في SNIM", "The team and the Soldamatic setup installed at SNIM", 1280, 960), pos: "60% 40%" },
    intro: {
      fr: "Premier client de notre représentation officielle Seabery : le centre de formation de la SNIM à Zouérate est le premier en Mauritanie à adopter Soldamatic, livré, installé et mis en service par Moon.",
      ar: "أول عميل في إطار تمثيلنا الرسمي لـ Seabery: مركز التكوين التابع لـ SNIM في الزويرات هو الأول في موريتانيا الذي يعتمد Soldamatic، وقد ورّدته Moon وركّبته وشغّلته.", en: "First client of our official Seabery representation: the SNIM training centre in Zouérate is the first in Mauritania to adopt Soldamatic, delivered, installed and commissioned by Moon.",
    },
    facts: [
      { k: { fr: "Client", ar: "العميل", en: "Client" }, v: { fr: "SNIM — centre de formation, Zouérate", ar: "SNIM — مركز التكوين، الزويرات", en: "SNIM — training centre, Zouérate" } },
      { k: { fr: "Solution", ar: "الحل", en: "Solution" }, v: { fr: "Soldamatic (Seabery)", ar: "Soldamatic (Seabery)", en: "Soldamatic (Seabery)" } },
      { k: { fr: "Prestation", ar: "الخدمة", en: "Service" }, v: { fr: "Livraison, installation, formation des formateurs", ar: "التوريد والتركيب وتكوين المدرّبين", en: "Delivery, installation, train-the-trainer" } },
      { k: { fr: "Année", ar: "السنة", en: "Year" }, v: { fr: "2025", ar: "2025", en: "2025" } },
    ],
    story: {
      need: { fr: "Former au soudage en sécurité et à moindre coût.", ar: "التدريب على اللحام بأمان وبتكلفة أقل.", en: "Train welders safely and at lower cost." },
      approach: { fr: "Soldamatic livré, installé et calibré sur site.", ar: "توريد Soldamatic وتركيبه ومعايرته في الموقع.", en: "Soldamatic delivered, installed and calibrated on site." },
      result: { fr: "Les instructeurs de la SNIM, formés sur place, dirigent aujourd'hui le centre.", ar: "مدرّبو SNIM، بعد تكوينهم في الموقع، يديرون المركز اليوم.", en: "SNIM instructors, trained on site, now run the centre." },
    },
    scenes: [
      { media: img("snim-team", 1280, 960), title: { fr: "Le premier centre Soldamatic de Mauritanie.", ar: "أول مركز Soldamatic في موريتانيا.", en: "Mauritania's first Soldamatic centre." } },
      {
        media: img("snim-team", 1280, 960),
        kicker: K.approach,
        title: { fr: "Livré, installé et mis en service sur site.", ar: "توريد وتركيب وتشغيل في الموقع.", en: "Delivered, installed and commissioned on site." },
        text: {
          fr: "Simulation de soudage en réalité augmentée : angle et vitesse du geste mesurés en temps réel, sans arc ni fumée.",
          ar: "محاكاة لحام بالواقع المعزّز: زاوية الحركة وسرعتها تُقاس لحظياً، دون قوس كهربائي ولا دخان.", en: "Augmented reality welding simulation: angle and speed of the movement measured in real time, with no arc and no fumes.",
        },
      },
      {
        media: img("snim-group", 1280, 960),
        kicker: K.result,
        title: { fr: "Des formateurs autonomes.", ar: "مدرّبون مستقلّون.", en: "Self-sufficient trainers." },
        text: {
          fr: "Les instructeurs de la SNIM, formés sur place par notre équipe, dirigent aujourd'hui le centre au quotidien.",
          ar: "مدرّبو SNIM، الذين كوّنهم فريقنا في الموقع، يديرون المركز يومياً اليوم.", en: "SNIM instructors, trained on site by our team, now run the centre day to day.",
        },
      },
    ],
    gallery: [p("snim-team", "L'équipe et le dispositif Soldamatic", "الفريق وجهاز Soldamatic", "The team and the Soldamatic setup", 1280, 960), p("snim-group", "Les stagiaires du centre de formation", "متدرّبو مركز التكوين", "Trainees at the training centre", 1280, 960)],
  },
  {
    slug: "eetfp",
    category: "training",
    title: { fr: "3 simulateurs de soudage — EETFP", ar: "3 محاكيات لحام — EETFP", en: "3 welding simulators — EETFP" },
    short: { fr: "Soldamatic · Skillveri AURA · WAVE NG", ar: "Soldamatic · Skillveri AURA · WAVE NG", en: "Soldamatic · Skillveri AURA · WAVE NG" },
    meta: { fr: "Formation · Nouakchott · 2025", ar: "تدريب · نواكشوط · 2025", en: "Training · Nouakchott · 2025" },
    cover: { ...p("eetfp-soldamatic", "Exercice de soudage sur le simulateur Soldamatic à l'EETFP", "تمرين لحام على محاكي Soldamatic في EETFP", "Welding exercise on the Soldamatic simulator at EETFP", 1200, 1600), pos: "50% 40%" },
    intro: {
      fr: "Au lycée technique de Nouakchott (EETFP), trois simulateurs de soudage permettent aux élèves de répéter les gestes sans risque et sans consommer de matière.",
      ar: "في الثانوية الفنية بنواكشوط (EETFP)، تتيح ثلاثة محاكيات لحام للطلاب تكرار الحركات بلا خطر ودون استهلاك المواد.", en: "At the Nouakchott technical high school (EETFP), three welding simulators let students practise the movements without risk and without using up material.",
    },
    facts: [
      { k: { fr: "Client", ar: "العميل", en: "Client" }, v: { fr: "EETFP — lycée technique de Nouakchott", ar: "EETFP — الثانوية الفنية بنواكشوط", en: "EETFP — Nouakchott technical high school" } },
      { k: { fr: "Prestation", ar: "الخدمة", en: "Service" }, v: { fr: "Fourniture et installation", ar: "التوريد والتركيب", en: "Supply and installation" } },
      { k: { fr: "Simulateurs", ar: "المحاكيات", en: "Simulators" }, v: { fr: "Soldamatic · Skillveri AURA · WAVE NG", ar: "Soldamatic · Skillveri AURA · WAVE NG", en: "Soldamatic · Skillveri AURA · WAVE NG" } },
    ],
    story: {
      need: {
        fr: "Former au soudage sans risque pour les élèves et sans gaspiller de matière.",
        ar: "التدريب على اللحام دون خطر على الطلاب ودون هدر للمواد.", en: "Teach welding with no risk to students and no wasted material.",
      },
      approach: {
        fr: "Trois simulateurs fournis et installés : Soldamatic, Skillveri AURA et WAVE NG.",
        ar: "ثلاثة محاكيات ورّدناها وركّبناها: Soldamatic وSkillveri AURA وWAVE NG.", en: "Three simulators supplied and installed: Soldamatic, Skillveri AURA and WAVE NG.",
      },
      result: {
        fr: "Les élèves répètent les gestes autant que nécessaire avant de passer au poste réel.",
        ar: "يكرّر الطلاب الحركات بقدر ما يحتاجون قبل الانتقال إلى الورشة الحقيقية.", en: "Students repeat the movements as often as needed before moving to a real station.",
      },
    },
    scenes: [
      { media: img("eetfp-zspace", 1600, 1200), title: { fr: "Une première pour l'enseignement professionnel.", ar: "سابقة في التعليم المهني.", en: "A first for vocational education." } },
      {
        media: img("eetfp-soldamatic", 1200, 1600),
        kicker: { fr: "Soldamatic by Seabery", ar: "Soldamatic من Seabery", en: "Soldamatic by Seabery" },
        title: { fr: "Le soudage en réalité augmentée.", ar: "اللحام بالواقع المعزّز.", en: "Welding in augmented reality." },
        text: { fr: "Pratique répétée sans consommer de matière.", ar: "تمرين متكرر دون استهلاك المواد.", en: "Repeated practice without using up material." },
      },
      {
        media: img("eetfp-skillveri", 1200, 1600),
        kicker: { fr: "Skillveri AURA", ar: "Skillveri AURA", en: "Skillveri AURA" },
        title: { fr: "La réalité mixte sur Meta Quest 3.", ar: "الواقع المختلط على Meta Quest 3.", en: "Mixed reality on Meta Quest 3." },
        text: { fr: "Gestes de soudage réels, suivis et évalués.", ar: "حركات لحام حقيقية، تُتابَع وتُقيَّم.", en: "Real welding movements, tracked and assessed." },
      },
      {
        media: img("eetfp-wave", 1200, 1600),
        kicker: K.result,
        title: { fr: "Installation et formation intensive en deux jours.", ar: "تركيب وتكوين مكثّف في يومين.", en: "Installation and intensive training in two days." },
        text: {
          fr: "WAVE NG et la plateforme Vulcan pour suivre les résultats : les formateurs pilotent désormais les exercices.",
          ar: "WAVE NG ومنصة Vulcan لمتابعة النتائج: صار المدرّبون يديرون التمارين بأنفسهم.", en: "WAVE NG and the Vulcan platform to track results: the trainers now run the exercises.",
        },
      },
    ],
    gallery: [p("eetfp-simulator", "Prise en main d'un simulateur", "التعرّف على المحاكي", "Getting started on a simulator", 1061, 853)],
  },
  {
    slug: "gitex-africa",
    category: "event",
    title: { fr: "GITEX Africa 2026 — Marrakech", ar: "GITEX Africa 2026 — مراكش", en: "GITEX Africa 2026 — Marrakech" },
    short: { fr: "Démonstrations VR sur casques Moon", ar: "عروض واقع افتراضي بنظارات Moon", en: "VR demonstrations on Moon headsets" },
    meta: { fr: "Salon international · Avril 2026", ar: "معرض دولي · أبريل 2026", en: "International fair · April 2026" },
    cover: { ...p("gitex-visit", "Un visiteur teste un casque Moon au GITEX Africa", "زائر يجرّب نظارة Moon في GITEX Africa", "A visitor tries a Moon headset at GITEX Africa", 1200, 1600), pos: "50% 35%" },
    intro: {
      fr: "Du 7 au 9 avril 2026 à Marrakech, Moon Technology a présenté ses solutions au plus grand salon technologique du continent, avec des démonstrations sur casques de marque Moon.",
      ar: "من 7 إلى 9 أبريل 2026 في مراكش، عرضت Moon Technology حلولها في أكبر معرض تقني في القارة، مع عروض تجريبية بنظارات تحمل علامة Moon.", en: "From 7 to 9 April 2026 in Marrakech, Moon Technology presented its solutions at the continent's largest technology fair, with demonstrations on Moon-branded headsets.",
    },
    facts: [
      { k: { fr: "Événement", ar: "الحدث", en: "Event" }, v: { fr: "GITEX Africa 2026", ar: "GITEX Africa 2026", en: "GITEX Africa 2026" } },
      { k: { fr: "Lieu", ar: "المكان", en: "Location" }, v: { fr: "Marrakech, Maroc", ar: "مراكش، المغرب", en: "Marrakech, Morocco" } },
      { k: { fr: "Dates", ar: "التاريخ", en: "Dates" }, v: { fr: "7 – 9 avril 2026", ar: "7 – 9 أبريل 2026", en: "7 – 9 April 2026" } },
    ],
    story: {
      need: { fr: "Présenter nos solutions à l'échelle du continent.", ar: "تقديم حلولنا على مستوى القارة.", en: "Present our solutions on a continental scale." },
      approach: { fr: "Démonstrations sur casques Moon.", ar: "عروض تجريبية بنظارات Moon.", en: "Demonstrations on Moon headsets." },
      result: { fr: "De nouveaux partenariats et des opportunités en Afrique.", ar: "شراكات وفرص جديدة في أفريقيا.", en: "New partnerships and opportunities across Africa." },
    },
    scenes: [
      { media: img("gitex-sign", 1200, 1600), title: { fr: "Nos casques au plus grand salon tech d'Afrique.", ar: "نظاراتنا في أكبر معرض تقني في أفريقيا.", en: "Our headsets at Africa's largest tech fair." } },
      {
        media: img("gitex-visit", 1200, 1600),
        kicker: K.live,
        title: { fr: "Des démonstrations sur casques Moon.", ar: "عروض تجريبية بنظارات Moon.", en: "Demonstrations on Moon headsets." },
        text: { fr: "Responsables et visiteurs ont testé nos expériences immersives sur le stand.", ar: "جرّب المسؤولون والزوار تجاربنا الغامرة في الجناح.", en: "Officials and visitors tried our immersive experiences at the stand." },
      },
      {
        media: img("gitex-demo", 1200, 1600),
        kicker: { fr: "Sur le stand", ar: "في الجناح", en: "At the stand" },
        title: { fr: "Des échanges avec partenaires et clients.", ar: "لقاءات مع الشركاء والعملاء.", en: "Conversations with partners and clients." },
      },
      {
        media: img("gitex-um6p", 800, 1066),
        kicker: K.result,
        title: { fr: "De nouveaux partenariats.", ar: "شراكات جديدة.", en: "New partnerships." },
        text: {
          fr: "De nombreux partenariats établis et des opportunités avec des clients en Mauritanie et sur le continent africain.",
          ar: "شراكات عديدة وفرص مع عملاء في موريتانيا وفي القارة الأفريقية.", en: "Many partnerships established and opportunities with clients in Mauritania and across the African continent.",
        },
      },
    ],
    gallery: [p("gitex-visit", "Démonstration au GITEX Africa", "عرض في GITEX Africa", "Demonstration at GITEX Africa", 1200, 1600)],
  },
  {
    slug: "salons-nationaux",
    category: "event",
    title: { fr: "Salons et forums nationaux", ar: "المعارض والمنتديات الوطنية", en: "National fairs and forums" },
    short: { fr: "NEF · Forum de l'Emploi et du Numérique · exposition MPG", ar: "NEF · منتدى التشغيل والرقمنة · معرض MPG", en: "NEF · Employment and Digital Forum · MPG exhibition" },
    meta: { fr: "Événements · Nouakchott · 2026", ar: "فعاليات · نواكشوط · 2026", en: "Events · Nouakchott · 2026" },
    cover: { ...p("salon-nef", "Démonstration VR au National Energy Forum", "عرض واقع افتراضي في المنتدى الوطني للطاقة", "VR demonstration at the National Energy Forum", 1600, 1195), pos: "60% 40%" },
    intro: {
      fr: "Au National Energy Forum, au Forum de l'Emploi et du Numérique et lors de l'exposition de notre partenaire MPG, responsables, étudiants et professionnels ont testé nos applications de réalité virtuelle.",
      ar: "في المنتدى الوطني للطاقة، ومنتدى التشغيل والرقمنة، ومعرض شريكنا MPG، جرّب مسؤولون وطلاب ومهنيون تطبيقاتنا للواقع الافتراضي.", en: "At the National Energy Forum, the Employment and Digital Forum and our partner MPG's exhibition, officials, students and professionals tried our virtual reality applications.",
    },
    facts: [
      { k: { fr: "Événements", ar: "الفعاليات", en: "Events" }, v: { fr: "NEF · Forum de l'Emploi et du Numérique · Expo MPG", ar: "NEF · منتدى التشغيل والرقمنة · معرض MPG", en: "NEF · Employment and Digital Forum · MPG Expo" } },
      { k: { fr: "Lieu", ar: "المكان", en: "Location" }, v: { fr: "Nouakchott", ar: "نواكشوط", en: "Nouakchott" } },
      { k: { fr: "Partenaire", ar: "الشريك", en: "Partner" }, v: { fr: "MPG", ar: "MPG", en: "MPG" } },
    ],
    story: {
      need: { fr: "Faire découvrir la VR au public professionnel.", ar: "تعريف الجمهور المهني بالواقع الافتراضي.", en: "Introduce VR to a professional audience." },
      approach: { fr: "Applications VR et impression 3D, avec MPG.", ar: "تطبيقات واقع افتراضي وطباعة ثلاثية الأبعاد، مع MPG.", en: "VR applications and 3D printing, with MPG." },
      result: { fr: "Responsables, étudiants et professionnels ont testé nos solutions.", ar: "جرّب مسؤولون وطلاب ومهنيون حلولنا.", en: "Officials, students and professionals tried our solutions." },
    },
    scenes: [
      { media: img("salon-nef", 1600, 1195), title: { fr: "La VR au cœur des grands rendez-vous nationaux.", ar: "الواقع الافتراضي في قلب أهم المواعيد الوطنية.", en: "VR at the heart of major national events." } },
      {
        media: img("salon-nef-2", 800, 534),
        kicker: { fr: "National Energy Forum", ar: "المنتدى الوطني للطاقة", en: "National Energy Forum" },
        title: { fr: "Applications VR et impression 3D, aux côtés de MPG.", ar: "تطبيقات واقع افتراضي وطباعة ثلاثية الأبعاد، إلى جانب MPG.", en: "VR applications and 3D printing, alongside MPG." },
      },
      {
        media: img("salon-mpg", 800, 600),
        kicker: { fr: "Exposition MPG", ar: "معرض MPG", en: "MPG exhibition" },
        title: { fr: "Partenaire VR de MPG lors de son exposition.", ar: "شريك الواقع الافتراضي لـ MPG في معرضها.", en: "MPG's VR partner at its exhibition." },
      },
      {
        media: img("salon-forum", 800, 1066),
        kicker: { fr: "Forum de l'Emploi et du Numérique", ar: "منتدى التشغيل والرقمنة", en: "Employment and Digital Forum" },
        title: { fr: "À la rencontre des étudiants et des jeunes talents.", ar: "لقاء مع الطلاب والمواهب الشابة.", en: "Meeting students and young talent." },
        text: {
          fr: "Organisé par l'Institut supérieur du numérique avec l'Agence Techghil.",
          ar: "نظّمه المعهد العالي للرقمنة بالتعاون مع وكالة تشغيل.", en: "Organised by the Higher Institute of Digital Technology with the Techghil Agency.",
        },
      },
    ],
    gallery: [p("salon-nef", "Démonstration VR", "عرض واقع افتراضي", "VR demonstration", 1600, 1195)],
  },
  {
    slug: "field-ready-vr",
    category: "dev",
    title: { fr: "Field Ready VR", ar: "Field Ready VR", en: "Field Ready VR" },
    short: { fr: "Application maison · sécurité industrielle", ar: "تطبيقنا · السلامة الصناعية", en: "In-house application · industrial safety" },
    meta: { fr: "Développement · Application maison", ar: "تطوير · تطبيقنا", en: "Development · In-house application" },
    cover: p("fieldready-site", "Vue d'ensemble du site industriel de Field Ready VR", "منظر عام للموقع الصناعي في Field Ready VR", "Overview of the Field Ready VR industrial site", 1920, 1081),
    intro: {
      fr: "Formation à la sécurité industrielle dans un site réaliste : équipements de protection, feu de gaz, consignation (LOTO). Guidage pas à pas, score immédiat, interaction avec les mains.",
      ar: "تدريب على السلامة الصناعية في موقع واقعي: معدات الحماية، حريق الغاز، والإقفال الآمن (LOTO). توجيه خطوة بخطوة، ونتيجة فورية، وتفاعل باليدين.", en: "Industrial safety training in a realistic site: protective equipment, gas fire, lockout/tagout (LOTO). Step-by-step guidance, instant score, hand interaction.",
    },
    facts: [
      { k: { fr: "Type", ar: "النوع", en: "Type" }, v: { fr: "Simulation VR développée par Moon", ar: "محاكاة واقع افتراضي من تطوير Moon", en: "VR simulation developed by Moon" } },
      { k: { fr: "Thèmes", ar: "المحاور", en: "Topics" }, v: { fr: "EPI · Feu de gaz · LOTO", ar: "معدات الحماية · حريق الغاز · LOTO", en: "PPE · Gas fire · LOTO" } },
      { k: { fr: "Interaction", ar: "التفاعل", en: "Interaction" }, v: { fr: "Mains, sans manettes", ar: "باليدين، دون أذرع تحكم", en: "Hands, no controllers" } },
    ],
    story: {
      need: {
        fr: "Former à la sécurité industrielle sans exposer les équipes au danger réel.",
        ar: "التدريب على السلامة الصناعية دون تعريض الفرق للخطر الحقيقي.", en: "Train for industrial safety without exposing teams to real danger.",
      },
      approach: {
        fr: "Une simulation développée par Moon : équipements de protection, feu de gaz et consignation (LOTO), guidée pas à pas.",
        ar: "محاكاة من تطوير Moon: معدات الحماية وحريق الغاز والإقفال الآمن (LOTO)، بتوجيه خطوة بخطوة.", en: "A simulation developed by Moon: protective equipment, gas fire and lockout/tagout (LOTO), guided step by step.",
      },
      result: {
        fr: "Des réflexes de sécurité pratiqués dans un site réaliste, avec un score immédiat à la fin.",
        ar: "ردود فعل السلامة تُمارَس في موقع واقعي، مع نتيجة فورية في النهاية.", en: "Safety reflexes practised in a realistic site, with an instant score at the end.",
      },
    },
    scenes: [
      { media: img("fieldready-site", 1920, 1081), title: { fr: "La sécurité industrielle, apprise en VR.", ar: "السلامة الصناعية، تُتعلَّم بالواقع الافتراضي.", en: "Industrial safety, learned in VR." } },
      {
        media: img("fieldready-pompe", 1920, 1080),
        kicker: K.need,
        title: { fr: "Se former au danger, sans danger.", ar: "التدرّب على الخطر، دون خطر.", en: "Training for danger, without the danger." },
        text: { fr: "Former à la sécurité industrielle sans exposer les équipes au danger réel.", ar: "التدريب على السلامة الصناعية دون تعريض الفرق للخطر الحقيقي.", en: "Train for industrial safety without exposing teams to real danger." },
      },
      {
        media: img("fieldready-incendie-conduites", 1920, 1080),
        kicker: K.approach,
        title: { fr: "Une simulation développée par Moon.", ar: "محاكاة من تطوير Moon.", en: "A simulation developed by Moon." },
        text: { fr: "EPI, feu de gaz et consignation (LOTO), dans un site industriel réaliste guidé pas à pas.", ar: "معدات الحماية وحريق الغاز والإقفال الآمن (LOTO)، في موقع صناعي واقعي بتوجيه خطوة بخطوة.", en: "PPE, gas fire and lockout/tagout (LOTO), in a realistic industrial site guided step by step." },
      },
      {
        media: img("fieldready-point-incendie", 1920, 1080),
        kicker: K.result,
        title: { fr: "Des réflexes de sécurité, pratiqués.", ar: "ردود فعل السلامة، بالممارسة.", en: "Safety reflexes, practised." },
        text: { fr: "Interaction avec les mains et score immédiat à la fin.", ar: "تفاعل باليدين، ونتيجة فورية في النهاية.", en: "Hand interaction and an instant score at the end." },
      },
    ],
    gallery: [
      p("fieldready-pompe", "La station de pompage", "محطة الضخ", "The pumping station", 1920, 1080),
      p("fieldready-incendie-conduites", "Feu sur les conduites de gaz", "حريق في أنابيب الغاز", "Fire on the gas pipes", 1920, 1080),
      p("fieldready-point-incendie", "Le point incendie", "نقطة مكافحة الحريق", "The fire point", 1920, 1080),
    ],
    placeholders: [
      { kind: "video", label: { fr: "Vidéo de la simulation — à venir", ar: "فيديو المحاكاة — قريباً", en: "Simulation video — coming soon" } },
      { kind: "image", label: { fr: "Captures dans le casque — à venir", ar: "لقطات من داخل النظارة — قريباً", en: "In-headset captures — coming soon" } },
    ],
  },
];

export const getProject = (slug: string) => projects.find((x) => x.slug === slug);

export type Org = { name: string; logo: string; r: number; url?: string; role?: T; text?: T; points?: T[]; category?: string };

export const clients: Org[] = [
  { name: "Moov Mauritel", logo: "/media/logos/moov.webp", r: 1.66 },
  { name: "Mattel", logo: "/media/logos/mattel-logo.webp", r: 2.88 },
  { name: "MPG", logo: "/media/logos/mpg-logo.webp", r: 0.6 },
  { name: "SNIM", logo: "/media/logos/snim.webp", r: 1.05 },
];

export const partners: Org[] = [
  {
    name: "Seabery",
    logo: "/media/logos/seabery.webp",
    r: 4.88,
    url: "https://seabery.com",
    role: { fr: "Représentant officiel en Mauritanie", ar: "الممثل الرسمي في موريتانيا", en: "Official representative in Mauritania" },
    text: {
      fr: "Concepteur de Soldamatic, la plateforme de soudage en réalité augmentée, que nous installons et accompagnons en Mauritanie.",
      ar: "مطوّر Soldamatic، منصة اللحام بالواقع المعزز، التي نركّبها ونرافقها في موريتانيا.", en: "Maker of Soldamatic, the augmented reality welding platform, which we install and support in Mauritania.",
    },
  },
  {
    name: "MPG",
    logo: "/media/logos/mpg-logo.webp",
    r: 0.6,
    role: { fr: "Partenaire institutionnel", ar: "شريك مؤسسي", en: "Institutional partner" },
    text: {
      fr: "Institut de formation partenaire de Moon XR : nous portons ensemble des ateliers, des programmes de formation et des projets de R&D.",
      ar: "معهد تكوين شريك لـ Moon XR: ننفّذ معاً ورشات وبرامج تدريب ومشاريع بحث وتطوير.", en: "Training institute and Moon XR partner: together we run workshops, training programmes and R&D projects.",
    },
  },
];

export const suppliers: Org[] = [
  { name: "Seabery", logo: "/media/logos/seabery.webp", r: 4.88, role: { fr: "Soudage en RA", ar: "لحام بالواقع المعزز", en: "AR welding" }, category: "industry" },
  { name: "Skillveri", logo: "/media/logos/skillveri.webp", r: 3.35, role: { fr: "Soudage & peinture en VR", ar: "لحام وطلاء بالواقع الافتراضي", en: "VR welding & painting" }, category: "industry" },
  { name: "Mimbus", logo: "/media/logos/mimbus.webp", r: 2.67, role: { fr: "Simulateurs de formation", ar: "محاكيات تدريب", en: "Training simulators" }, category: "industry" },
  { name: "3D Organon", logo: "/media/logos/3d-organon.webp", r: 2.83, role: { fr: "Anatomie en VR", ar: "التشريح بالواقع الافتراضي", en: "VR anatomy" }, category: "education" },
  { name: "Avantis · ClassVR", logo: "/media/logos/classvr.webp", r: 5.08, role: { fr: "VR pour l'éducation", ar: "الواقع الافتراضي للتعليم", en: "VR for education" }, category: "education" },
  { name: "PIXO VR", logo: "/media/logos/pixo-vr.webp", r: 3.73, role: { fr: "Formation sécurité", ar: "تدريب السلامة", en: "Safety training" }, category: "safety" },
  { name: "Luminous XR", logo: "/media/logos/luminous-xr.webp", r: 6.44, role: { fr: "Plateforme XR", ar: "منصة XR", en: "XR platform" }, category: "platform" },
  { name: "GW Pro", logo: "/media/logos/gw-pro.webp", r: 2.12, role: { fr: "Simulateurs : soudage, BTP, sécurité", ar: "محاكيات: اللحام والبناء والسلامة", en: "Simulators: welding, construction, safety" }, category: "industry" },
];
