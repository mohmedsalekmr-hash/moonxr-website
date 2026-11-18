import { getContent } from "@/lib/content";
import { type Locale } from "@/data/i18n";

const I = {
  mail: "M4 6h16v12H4z M4 7l8 6 8-6",
  phone: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z",
  pin: "M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3 2",
};
const L = {
  email: { fr: "E-mail", ar: "البريد الإلكتروني" },
  phone: { fr: "Téléphone", ar: "الهاتف" },
  place: { fr: "Adresse", ar: "العنوان" },
  placeV: { fr: "Nouakchott, Mauritanie", ar: "نواكشوط، موريتانيا" },
  time: { fr: "Délai de réponse", ar: "مدة الرد" },
  timeV: { fr: "Sous 48 heures", ar: "خلال 48 ساعة" },
};

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

/** Contact details as one consistent list (dark = on navy, light = on white). */
export default async function ContactList({ lang, tone = "dark" }: { lang: Locale; tone?: "dark" | "light" }) {
  const { contact: CONTACT } = await getContent();
  const dark = tone === "dark";
  const rows = [
    { icon: I.mail, label: L.email[lang], value: CONTACT.email, href: `mailto:${CONTACT.email}`, ltr: true },
    { icon: I.phone, label: L.phone[lang], value: CONTACT.phone, href: CONTACT.phoneHref, ltr: true },
    { icon: I.pin, label: L.place[lang], value: L.placeV[lang] },
    { icon: I.clock, label: L.time[lang], value: L.timeV[lang] },
  ];
  return (
    <ul className={`divide-y ${dark ? "divide-white/10 border-y border-white/10" : "divide-line border-y border-line"}`}>
      {rows.map((r) => {
        const inner = (
          <>
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${dark ? "bg-white/8 text-sun" : "bg-sky/8 text-sky"}`}>
              <Icon d={r.icon} />
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-xs ${dark ? "text-white/50" : "text-ink/50"}`}>{r.label}</span>
              <span className={`mt-0.5 block truncate font-semibold ${dark ? "text-white" : "text-ink"}`} dir={r.ltr ? "ltr" : undefined} style={r.ltr ? { textAlign: "start" } : undefined}>
                {r.value}
              </span>
            </span>
            {r.href && <span className={`transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 ${dark ? "text-white/40" : "text-ink/30"}`}>→</span>}
          </>
        );
        return (
          <li key={r.label}>
            {r.href ? (
              <a href={r.href} className="group flex items-center gap-4 py-4">
                {inner}
              </a>
            ) : (
              <div className="flex items-center gap-4 py-4">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
