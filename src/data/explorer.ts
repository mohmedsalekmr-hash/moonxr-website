import type { T } from "./i18n";

export const explorer = {
  kicker: { fr: "Découvrez le casque", ar: "اكتشف النظارة", en: "Discover the headset" },
  title: { fr: "Comment fonctionne un casque VR ?", ar: "كيف تعمل نظارة الواقع الافتراضي؟", en: "How does a VR headset work?" },
  sub: {
    fr: "Touchez un point sur le casque ou sur une manette, ou lancez la visite guidée.",
    ar: "اضغط على نقطة في النظارة أو في يد التحكم، أو ابدأ الجولة الموجّهة.", en: "Tap a point on the headset or a controller, or start the guided tour.",
  },
  intro: {
    title: { fr: "Un ordinateur complet, sur la tête", ar: "حاسوب كامل فوق رأسك", en: "A complete computer, on your head" },
    text: {
      fr: "Le casque est autonome : sans fil et sans PC. Il voit la pièce, suit vos mouvements et affiche un monde en 3D tout autour de vous.",
      ar: "النظارة مستقلة: بلا أسلاك وبلا حاسوب. ترى الغرفة، وتتبّع حركتك، وتعرض عالماً ثلاثي الأبعاد من حولك.", en: "The headset is standalone: no cables and no PC. It sees the room, tracks your movements and displays a 3D world all around you.",
    },
  },
  tour: { fr: "Visite guidée", ar: "جولة موجّهة", en: "Guided tour" },
  stop: { fr: "Arrêter", ar: "إيقاف", en: "Stop" },
  prev: { fr: "Précédent", ar: "السابق", en: "Previous" },
  next: { fr: "Suivant", ar: "التالي", en: "Next" },
  reset: { fr: "Vue d'ensemble", ar: "المنظر العام", en: "Overview" },
  hint: { fr: "Glissez pour tourner", ar: "اسحب للتدوير", en: "Drag to rotate" },
  hintDrag: { fr: "Glissez pour tourner · cliquez pour explorer", ar: "اسحب لتدويرها · اضغط لاستكشافها", en: "Drag to rotate · click to explore" },
  hintTap: { fr: "Touchez le casque pour l'explorer", ar: "المس النظارة لاستكشافها", en: "Tap the headset to explore it" },
  help: { fr: "Glissez pour tourner · molette ou pincement pour zoomer · double-clic pour recentrer", ar: "اسحب للتدوير · العجلة أو الأصابع للتكبير · نقرتان لإعادة الوضع", en: "Drag to rotate · scroll or pinch to zoom · double-click to recenter" },
  or: { fr: "ou touchez un point sur le casque", ar: "أو اضغط على أي نقطة في النظارة", en: "or tap a point on the headset" },
  introSpec: { fr: "Snapdragon XR2 Gen 2 · 8 Go de RAM · sans fil", ar: "Snapdragon XR2 Gen 2 · ذاكرة 8 GB · بلا أسلاك", en: "Snapdragon XR2 Gen 2 · 8 GB RAM · wireless" },
  groups: {
    headset: { fr: "Casque", ar: "النظارة", en: "Headset" },
    controller: { fr: "Manettes", ar: "يدا التحكم", en: "Controllers" },
  },
};

export type Step = { id: string; group: "headset" | "controller"; title: T; text: T; spec?: T };

export const steps: Step[] = [
  {
    id: "cameras",
    group: "headset",
    title: { fr: "Les caméras", ar: "الكاميرات", en: "The cameras" },
    text: {
      fr: "Elles filment la pièce en continu : le casque sait où vous êtes, suit vos mains et peut vous montrer le monde réel en couleur.",
      ar: "تصوّر الغرفة باستمرار: تعرف النظارة مكانك، وتتبّع يديك، ويمكنها أن تُريك العالم الحقيقي بالألوان.", en: "They film the room continuously: the headset knows where you are, tracks your hands and can show you the real world in colour.",
    },
    spec: { fr: "2 caméras couleur 4 MP · 4 caméras infrarouges · capteur de profondeur", ar: "كاميرتان ملوّنتان 4 MP · 4 كاميرات بالأشعة تحت الحمراء · مستشعر عمق", en: "2 × 4 MP colour cameras · 4 infrared cameras · depth sensor" },
  },
  {
    id: "lenses",
    group: "headset",
    title: { fr: "Les lentilles", ar: "العدسات", en: "The lenses" },
    text: {
      fr: "Une image légèrement différente devant chaque œil : votre cerveau la transforme en relief. C'est ce qui donne l'impression d'être ailleurs.",
      ar: "صورة مختلفة قليلاً أمام كل عين، يحوّلها دماغك إلى عمق وبُعد. هذا ما يمنحك الإحساس بأنك في مكان آخر.", en: "A slightly different image in front of each eye: your brain turns it into depth. That is what makes you feel you are somewhere else.",
    },
    spec: { fr: "Lentilles pancake · 2064 × 2208 px par œil · 110° de champ", ar: "عدسات Pancake · 2064 × 2208 بكسل لكل عين · مجال رؤية 110°", en: "Pancake lenses · 2064 × 2208 px per eye · 110° field of view" },
  },
  {
    id: "strap",
    group: "headset",
    title: { fr: "La sangle", ar: "الحزام", en: "The strap" },
    text: {
      fr: "Réglable, elle répartit le poids pour un port confortable. Sur nos stands, nous ajustons le casque pour chaque visiteur.",
      ar: "قابل للتعديل ويوزّع الوزن لراحة أكبر. في أجنحتنا، نضبط النظارة لكل زائر.", en: "Adjustable, it spreads the weight for a comfortable fit. On our stands, we adjust the headset for every visitor.",
    },
  },
  {
    id: "joystick",
    group: "controller",
    title: { fr: "Le joystick", ar: "عصا التحكم", en: "The joystick" },
    text: {
      fr: "Sous le pouce : poussez-le pour avancer, reculer ou tourner dans le monde virtuel.",
      ar: "تحت الإبهام: ادفعها للتقدّم أو الرجوع أو الالتفاف داخل العالم الافتراضي.", en: "Under your thumb: push it to move forward, back or turn in the virtual world.",
    },
  },
  {
    id: "buttons",
    group: "controller",
    title: { fr: "Les boutons", ar: "الأزرار", en: "The buttons" },
    text: {
      fr: "A, B, X et Y pour valider ou revenir, et un bouton menu pour faire une pause, selon l'expérience.",
      ar: "أزرار A وB وX وY للتأكيد أو الرجوع، وزر القائمة للإيقاف المؤقت، حسب التجربة.", en: "A, B, X and Y to confirm or go back, and a menu button to pause, depending on the experience.",
    },
    spec: { fr: "Manettes Meta Quest Touch Plus, sans anneau", ar: "يدا التحكم Meta Quest Touch Plus، بلا حلقات", en: "Meta Quest Touch Plus controllers, ring-free" },
  },
  {
    id: "trigger",
    group: "controller",
    title: { fr: "Gâchette et poignée", ar: "الزناد والمقبض", en: "Trigger and grip" },
    text: {
      fr: "L'index presse la gâchette pour viser ou sélectionner ; le majeur serre la poignée pour attraper un objet.",
      ar: "يضغط السبّابة على الزناد للتصويب أو الاختيار، ويضغط الإصبع الأوسط على المقبض لالتقاط الأشياء.", en: "Your index finger presses the trigger to aim or select; your middle finger squeezes the grip to grab an object.",
    },
    spec: { fr: "Retour haptique TruTouch : vous sentez ce que vous touchez", ar: "اهتزاز TruTouch: تشعر بما تلمسه", en: "TruTouch haptic feedback: you feel what you touch" },
  },
];
