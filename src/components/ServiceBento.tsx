import Link from "next/link";
import { rimg } from "@/lib/img";
import { href, type Locale, type T } from "@/data/i18n";

export const SERVICE_IMG = [
  { src: "/media/photos/moov-c.webp", pos: "50% 35%" },
  { src: "/media/photos/eetfp-soldamatic.webp", pos: "50% 40%" },
  { src: "/media/photos/snim-team.webp", pos: "55% 40%" },
  { src: "/media/photos/fieldready-site.webp", pos: "50% 50%" },
];

/** What we do, as four photo tiles of real projects: one title and one short line each. */
export default function ServiceBento({ services, lang }: { services: { title: T; text: T; image?: string; pos?: string }[]; lang: Locale }) {
  const span = ["lg:col-span-2 lg:row-span-2", "lg:col-span-2", "", ""];
  return (
    <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:h-[560px] lg:grid-cols-4 lg:grid-rows-2">
      {services.map((s, i) => {
        const img = { src: s.image ?? SERVICE_IMG[i % 4].src, pos: s.pos ?? SERVICE_IMG[i % 4].pos };
        return (
          <Link
            href={`${href(lang, "services")}#s${i + 1}`}
            key={i}
            className={`veil group relative block aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden rounded-[var(--radius-lg)] bg-navy sm:aspect-[4/3] sm:w-auto lg:aspect-auto ${span[i] ?? ""}`}
          >
            <img
              {...rimg(img.src, i === 0 ? "(min-width: 1024px) 50vw, 90vw" : "(min-width: 1024px) 25vw, 90vw")}
              alt=""
              loading="lazy"
              style={{ objectPosition: img.pos }}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
            />
            <div className="absolute inset-x-0 bottom-0 z-[2] p-5 text-white md:p-7">
              <h3 className={`font-display font-bold leading-tight ${i === 0 ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"}`}>{s.title[lang]}</h3>
              <p className={`mt-2 line-clamp-2 text-white/75 ${i === 0 ? "max-w-md text-sm md:text-base" : "text-sm"}`}>{s.text[lang]}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
