import { Header } from "@/components/Header";
import { ProvidersClient } from "./ProvidersClient";
import { CanvasBackground } from "@/components/CanvasBackground";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VR Providers Directory | MoonXR",
  description: "Explore our global network of top Virtual Reality providers across strategic industry sectors.",
};

export default function ProvidersPage() {
  return (
    <main className="relative min-h-screen" style={{ background: "#020617" }}>
      <CanvasBackground />
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Global <span className="text-gradient">VR Directory</span>
          </h1>
          <p className="text-white/60 text-lg">
            Connect with pre-vetted, elite virtual reality providers and hardware manufacturers optimized for strategic industries.
          </p>
        </div>
        <ProvidersClient />
      </div>

      <Footer />
    </main>
  );
}
