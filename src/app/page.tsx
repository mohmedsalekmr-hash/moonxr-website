import { CanvasBackground } from "@/components/CanvasBackground";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { AboutPlatform } from "@/components/AboutPlatform";
import { ProvidersClient } from "./providers/ProvidersClient";
import { partnersData } from "@/data/partners";
import { ContactSection } from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <CanvasBackground />
      <Header />
      <Hero />
      <AboutPlatform />
      <Benefits />
      
      <section id="providers" className="py-24 relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Our VR <span className="text-gradient">Providers</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Connect with top virtual reality companies tailored to your industry's needs.
          </p>
        </div>
        <ProvidersClient partners={partnersData} />
      </section>

      <ContactSection />
      
      <footer className="relative z-10 border-t border-white/10 bg-brand-dark/80 backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/40 text-sm">
            © 2026 MoonXR. Connecting you to top VR providers.
          </p>
        </div>
      </footer>
    </main>
  );
}
