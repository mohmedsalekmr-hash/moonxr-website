import { Header } from "@/components/Header";
import { partnersData } from "@/data/partners";
import { ProvidersClient } from "./ProvidersClient";
import { CanvasBackgroundLazy } from "./CanvasBackgroundLazy";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VR Providers | MoonXR",
  description: "Explore our global network of top Virtual Reality providers across 6 industry sectors.",
};

export default function ProvidersPage() {
  return (
    <main className="relative min-h-screen">
      <CanvasBackgroundLazy />
      <Header />

      {/* ── Page hero ── */}
      <div className="relative z-10 pt-36 pb-16 text-center px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
          <span className="w-2 h-2 rounded-full bg-moon-blue-light animate-pulse flex-shrink-0" />
          <span className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">
            Partner Ecosystem
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-5 leading-[1.08]">
          Our{" "}
          <span className="text-gradient">Providers</span>
        </h1>
        <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
          We partner with the world&apos;s leading VR and simulation companies to deliver
          industry-specific solutions for the Mauritanian market.
        </p>
      </div>

      {/* ── Providers ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 pb-28">
        <ProvidersClient partners={partnersData} />
      </div>

      <Footer />
    </main>
  );
}
