/* eslint-disable react/no-unescaped-entities */
import { CanvasBackground } from "@/components/CanvasBackground";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { AboutPlatform } from "@/components/AboutPlatform";
import { OrbitalProviders } from "@/components/OrbitalProviders";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <CanvasBackground />
      <Header />
      <Hero />
      <AboutPlatform />
      <Benefits />
      <OrbitalProviders />
      <ContactSection />
      <Footer />
    </main>
  );
}
