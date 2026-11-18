import type { T } from "./i18n";

export const explorer = {
  kicker: { fr: "Découvrez le casque", ar: "اكتشف النظارة" },
  title: { fr: "Comment fonctionne un casque VR ?", ar: "كيف تعمل نظارة الواقع الافتراضي؟" },
  sub: {
    fr: "Touchez un point sur le casque ou sur une manette, ou lancez la visite guidée.",
    ar: "اضغط على نقطة في النظارة أو في يد التحكم، أو ابدأ الجولة الموجّهة.",
  },
  intro: {
    title: { fr: "Un ordinateur complet, sur la tête", ar: "حاسوب كامل فوق رأسك" },
    text: {
      fr: "Le casque est autonome : sans fil et sans PC. Il voit la pièce, suit vos mouvements et affiche un monde en 3D tout autour de vous.",
      ar: "النظارة مستقلة: بلا أسلاك وبلا حاسوب. ترى الغرفة، وتتبّع حركتك، وتعرض عالماً ثلاثي الأبعاد من حولك.",
    },
  },
  tour: { fr: "Visite guidée", ar: "جولة موجّهة" },
  stop: { fr: "Arrêter", ar: "إيقاف" },
  prev: { fr: "Précédent", ar: "السابق" },
  next: { fr: "Suivant", ar: "التالي" },
  reset: { fr: "Vue d'ensemble", ar: "المنظر العام" },
  hint: { fr: "Glissez pour tourner", ar: "اسحب للتدوير" },
  hintDrag: { fr: "Glissez pour tourner · cliquez pour explorer", ar: "اسحب لتدويرها · اضغط لاستكشافها" },
  hintTap: { fr: "Touchez le casque pour l'explorer", ar: "المس النظارة لاستكشافها" },
  help: { fr: "Glissez pour tourner · molette ou pincement pour zoomer · double-clic pour recentrer", ar: "اسحب للتدوير · العجلة أو الأصابع للتكبير · نقرتان لإعادة الوضع" },
  or: { fr: "ou touchez un point sur le casque", ar: "أو اضغط على أي نقطة في النظارة" },
  introSpec: { fr: "Snapdragon XR2 Gen 2 · 8 Go de RAM · sans fil", ar: "Snapdragon XR2 Gen 2 · ذاكرة 8 GB · بلا أسلاك" },
  groups: {
    headset: { fr: "Casque", ar: "النظارة" },
    controller: { fr: "Manettes", ar: "يدا التحكم" },
  },
};

export type Step = { id: string; group: "headset" | "controller"; title: T; text: T; spec?: T };

export const steps: Step[] = [
  {
    id: "cameras",
    group: "headset",
    title: { fr: "Les caméras", ar: "الكاميرات" },
    text: {
      fr: "Elles filment la pièce en continu : le casque sait où vous êtes, suit vos mains et peut vous montrer le monde réel en couleur.",
      ar: "تصوّر الغرفة باستمرار: تعرف النظارة مكانك، وتتبّع يديك، ويمكنها أن تُريك العالم الحقيقي بالألوان.",
    },
    spec: { fr: "2 caméras couleur 4 MP · 4 caméras infrarouges · capteur de profondeur", ar: "كاميرتان ملوّنتان 4 MP · 4 كاميرات بالأشعة تحت الحمراء · مستشعر عمق" },
  },
  {
    id: "lenses",
    group: "headset",
    title: { fr: "Les lentilles", ar: "العدسات" },
    text: {
      fr: "Une image légèrement différente devant chaque œil : votre cerveau la transforme en relief. C'est ce qui donne l'impression d'être ailleurs.",
      ar: "صورة مختلفة قليلاً أمام كل عين، يحوّلها دماغك إلى عمق وبُعد. هذا ما يمنحك الإحساس بأنك في مكان آخر.",
    },
    spec: { fr: "Lentilles pancake · 2064 × 2208 px par œil · 110° de champ", ar: "عدسات Pancake · 2064 × 2208 بكسل لكل عين · مجال رؤية 110°" },
  },
  {
    id: "strap",
    group: "headset",
    title: { fr: "La sangle", ar: "الحزام" },
    text: {
      fr: "Réglable, elle répartit le poids pour un port confortable. Sur nos stands, nous ajustons le casque pour chaque visiteur.",
      ar: "قابل للتعديل ويوزّع الوزن لراحة أكبر. في أجنحتنا، نضبط النظارة لكل زائر.",
    },
  },
  {
    id: "joystick",
    group: "controller",
    title: { fr: "Le joystick", ar: "عصا التحكم" },
    text: {
      fr: "Sous le pouce : poussez-le pour avancer, reculer ou tourner dans le monde virtuel.",
      ar: "تحت الإبهام: ادفعها للتقدّم أو الرجوع أو الالتفاف داخل العالم الافتراضي.",
    },
  },
  {
    id: "buttons",
    group: "controller",
    title: { fr: "Les boutons", ar: "الأزرار" },
    text: {
      fr: "A, B, X et Y pour valider ou revenir, et un bouton menu pour faire une pause, selon l'expérience.",
      ar: "أزرار A وB وX وY للتأكيد أو الرجوع، وزر القائمة للإيقاف المؤقت، حسب التجربة.",
    },
    spec: { fr: "Manettes Meta Quest Touch Plus, sans anneau", ar: "يدا التحكم Meta Quest Touch Plus، بلا حلقات" },
  },
  {
    id: "trigger",
    group: "controller",
    title: { fr: "Gâchette et poignée", ar: "الزناد والمقبض" },
    text: {
      fr: "L'index presse la gâchette pour viser ou sélectionner ; le majeur serre la poignée pour attraper un objet.",
      ar: "يضغط السبّابة على الزناد للتصويب أو الاختيار، ويضغط الإصبع الأوسط على المقبض لالتقاط الأشياء.",
    },
    spec: { fr: "Retour haptique TruTouch : vous sentez ce que vous touchez", ar: "اهتزاز TruTouch: تشعر بما تلمسه" },
  },
];
