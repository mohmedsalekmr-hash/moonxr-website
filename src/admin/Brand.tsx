"use client";

import { useState } from "react";

const COLORS = [
  { name: "أزرق الشعار", hex: "#253C80", use: "الكلمات المميزة، الأرقام، الروابط على الخلفية البيضاء" },
  { name: "أصفر الشعار", hex: "#FAB62D", use: "الأزرار الرئيسية، العناوين الصغيرة على الخلفية الداكنة" },
  { name: "كحلي", hex: "#142454", use: "الأقسام الداكنة، التذييل، فوق الصور" },
  { name: "كحلي عميق", hex: "#0A1431", use: "القائمة فوق الداكن، استوديو النظارة 3D" },
  { name: "أزرق فاتح", hex: "#6F8AD6", use: "لمسات زرقاء فوق الخلفيات الداكنة فقط" },
  { name: "خلفية زرقاء خفيفة", hex: "#EEF1F9", use: "خلفيات الأقسام الفاتحة والأيقونات" },
  { name: "أصفر غامق", hex: "#B97A00", use: "العناوين الصغيرة فوق الأبيض (لأن الأصفر العادي لا يُقرأ عليه)" },
  { name: "لون النص", hex: "#0A0F1F", use: "كل النصوص" },
];

const RULES = [
  "لونان فقط للهوية: أزرق الشعار والأصفر. كل الألوان الأخرى مشتقة منهما.",
  "الأصفر للزر الأهم في الصفحة فقط، لا تضع زرّين أصفرين جنباً إلى جنب.",
  "الأزرق للتمييز داخل النص (كلمة أو رقم)، وليس لفقرات كاملة.",
  "النص بثلاث درجات فقط: عنوان (كامل)، نص عادي (75%)، نص ثانوي (60%).",
  "زاويتان فقط: صغيرة للبطاقات الصغيرة والحقول، كبيرة للصور والبطاقات الكبيرة.",
  "الخطوط: Sora للعناوين الفرنسية، Inter للنص الفرنسي، IBM Plex Sans Arabic للعربية.",
];

function Swatch({ name, hex, use }: { name: string; hex: string; use: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="card overflow-hidden text-start transition hover:shadow-md"
      onClick={() => {
        navigator.clipboard?.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      <div className="h-20 border-b border-black/5" style={{ background: hex }} />
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{name}</span>
          <span className="font-mono text-xs text-black/55" dir="ltr">{copied ? "✓ نُسخ" : hex}</span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-black/50">{use}</p>
      </div>
    </button>
  );
}

/** Brand guide: the colours, rules and logos the site uses, for posts and presentations too. */
export default function BrandTab() {
  return (
    <div>
      <h1 className="text-2xl font-bold">دليل الهوية</h1>
      <p className="mt-1 text-sm text-black/55">
        الألوان والقواعد التي يستعملها الموقع. استعملها أيضاً في منشورات LinkedIn والعروض حتى يبقى كل شيء بنفس الهوية. اضغط على أي لون لنسخ رمزه.
      </p>

      <h2 className="mt-8 text-lg font-bold">الألوان</h2>
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        {COLORS.map((c) => (
          <Swatch key={c.hex} {...c} />
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold">الشعار</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {[
          { src: "/media/logos/moonxr-l.svg", bg: "#ffffff", label: "على خلفية فاتحة" },
          { src: "/media/logos/moonxr-d.svg", bg: "#142454", label: "على خلفية داكنة" },
        ].map((l) => (
          <div key={l.src} className="card overflow-hidden">
            <div className="grid h-36 place-items-center" style={{ background: l.bg }}>
              <img src={l.src} alt="Moon XR" className="h-10 w-auto" />
            </div>
            <div className="flex items-center justify-between p-3 text-sm">
              <span>{l.label}</span>
              <a className="btn btn-light" href={l.src} download>
                تحميل SVG
              </a>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-bold">الأزرار والعناصر كما تظهر في الموقع</h2>
      <div className="card mt-3 space-y-6 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#FAB62D] px-5 py-3 text-sm font-semibold text-[#0A0F1F]">الزر الرئيسي</span>
          <span className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold">زر ثانوي</span>
          <span className="rounded-full bg-[#142454] px-4 py-3">
            <span className="rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white">زر على الداكن</span>
          </span>
          <span className="rounded-full bg-[#EEF1F9] px-3 py-1 text-xs font-semibold text-[#253C80]">وسم</span>
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#B97A00]">
            <span className="h-0.5 w-6 rounded bg-current" /> عنوان صغير
          </div>
          <div className="mt-2 text-3xl font-bold leading-snug">
            عنوان القسم مع <span className="text-[#253C80]">كلمة مميزة</span>
          </div>
          <p className="mt-2 max-w-xl text-black/60">نص ثانوي يشرح القسم في سطر أو سطرين.</p>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-bold">القواعد</h2>
      <ol className="card mt-3 list-decimal space-y-2 p-6 ps-10 text-sm leading-relaxed">
        {RULES.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ol>
    </div>
  );
}
