import variants from "@/data/img-variants.json";

const V = variants as unknown as Record<string, [number[], number]>;

/**
 * Responsive photo attributes: phones get a 480 or 960 px copy instead of the full-size file.
 * `sizes` describes how wide the image is drawn, e.g. "(min-width: 768px) 50vw, 100vw".
 * Photos uploaded from /admin have no copies and are served as they are.
 */
export function rimg(src: string, sizes = "100vw"): { src: string; srcSet?: string; sizes?: string } {
  const v = V[src];
  if (!v) return { src };
  const base = src.slice(0, -5);
  const [ws, full] = v;
  return { src, srcSet: [...ws.map((w) => `${base}-${w}.webp ${w}w`), `${src} ${full}w`].join(", "), sizes };
}
