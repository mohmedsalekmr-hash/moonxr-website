import { getContent } from "@/lib/content";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/data/i18n";
import Page from "@/components/Page";
import ContactForm from "@/components/ContactForm";
import ContactList from "@/components/ContactList";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "تواصل معنا" : "Contact" };
}

const T = {
  next: { fr: "Comment ça se passe", ar: "كيف نعمل معكم" },
  call: { fr: "Appeler", ar: "اتصال" },
  mail: { fr: "E-mail", ar: "البريد" },
  form: { fr: "Votre demande", ar: "طلبكم" },
};

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  const { ui, steps, contact: CONTACT } = await getContent();
  if (!hasLocale(lang)) notFound();
  const c = ui.contact;
  return (
    <Page>
      <section className="relative pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(50%_80%_at_80%_0%,rgba(37,60,128,0.10),transparent_70%),linear-gradient(180deg,#eef1f9,#ffffff)]" />
        <div className="wrap">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white shadow-[0_30px_80px_-40px_rgba(20,36,84,0.45)] lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* brand panel */}
            <aside className="relative overflow-hidden bg-navy p-7 text-white md:p-10">
              <div className="pointer-events-none absolute -top-24 end-[-6rem] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(111,138,214,0.35),transparent_70%)]" />
              <div className="kicker relative !text-sun">{ui.nav.contact[lang]}</div>
              <h1 className="font-display relative mt-4 text-[1.75rem] font-bold leading-tight md:text-[2.6rem]">{c.title[lang]}</h1>
              <p className="relative mt-4 max-w-md text-white/75">{c.sub[lang]}</p>

              {/* phone: big quick actions */}
              <div className="relative mt-7 grid grid-cols-2 gap-3 lg:hidden">
                <a href={CONTACT.phoneHref} className="btn btn-sun justify-center">{T.call[lang]}</a>
                <a href={`mailto:${CONTACT.email}`} className="btn btn-line justify-center">{T.mail[lang]}</a>
              </div>

              <div className="relative mt-8 hidden lg:block">
                <ContactList lang={lang} tone="dark" />
              </div>

              <div className="relative mt-10 hidden lg:block">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60 rtl:tracking-normal">{T.next[lang]}</div>
                <ol className="mt-4 space-y-3">
                  {steps.map((s, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-semibold text-sun">{i + 1}</span>
                      <span className="text-white/90">{s.title[lang]}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            {/* form */}
            <div>
              <div className="px-6 pt-7 md:px-10 md:pt-10">
                <h2 className="font-display text-xl font-bold">{T.form[lang]}</h2>
              </div>
              <ContactForm lang={lang} bare />
            </div>
          </div>

          {/* phone: details under the form */}
          <div className="mt-10 lg:hidden">
            <div className="kicker">{c.direct[lang]}</div>
            <div className="mt-4">
              <ContactList lang={lang} tone="light" />
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
