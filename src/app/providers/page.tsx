import { Header } from "@/components/Header";
import { OrbitalProviders } from "@/components/OrbitalProviders";
import { CanvasBackground } from "@/components/CanvasBackground";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VR Providers | MoonXR",
  description: "Explore our global network of top Virtual Reality providers across strategic industry sectors.",
};

export default function ProvidersPage() {
  return (
    <main className="relative min-h-screen">
      <CanvasBackground />
      <Header />

      <div className="pt-24">
        <OrbitalProviders />
      </div>

      <Footer />
    </main>
  );
}
