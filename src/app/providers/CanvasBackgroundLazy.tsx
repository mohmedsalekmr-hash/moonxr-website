"use client";

import dynamic from "next/dynamic";

const CanvasBackground = dynamic(
  () => import("@/components/CanvasBackground").then((m) => ({ default: m.CanvasBackground })),
  { ssr: false }
);

export function CanvasBackgroundLazy() {
  return <CanvasBackground />;
}
