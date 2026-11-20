"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

/** Smooth, inertial page scrolling (off for reduced-motion users and on touch screens). */
export default function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({
      lerp: 0.11,
      anchors: { offset: -80 },
      // let the 3D headset use the wheel to zoom while it is being explored
      prevent: (node) => !!(node as HTMLElement).closest?.("section[data-explore], [data-lenis-prevent]"),
    });
    lenis.current = l;
    // the 3D headset story moves the page one part at a time through the same engine
    (window as Window & { __lenis?: Lenis }).__lenis = l;
    let raf = 0;
    const loop = (t: number) => {
      l.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
      lenis.current = null;
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // new page → start at the top
  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
