import { CanvasBackground } from "@/components/CanvasBackground";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | MoonXR",
  description: "Get in touch with the MoonXR team to start your VR journey.",
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <CanvasBackground />
      <Header />

      <div className="flex-grow flex items-center justify-center relative z-10 px-6 py-32">
        <div className="glass-panel p-10 md:p-16 rounded-3xl w-full max-w-lg text-center shadow-[0_0_50px_rgba(0,122,255,0.12)] border-t border-moon-blue/30">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="text-white/60 mb-10 text-lg leading-relaxed">
            Get in touch with our team to start your VR journey.
          </p>

          <div className="space-y-4">
            <a
              href="mailto:mohamedsaleck@moon.mr"
              className="flex items-center space-x-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-moon-blue-light/30 transition-all duration-300 group"
            >
              <div className="p-3 bg-moon-blue/20 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                <Mail className="w-6 h-6 text-moon-blue-light" />
              </div>
              <span className="text-lg text-white font-medium break-all text-left">
                mohamedsaleck@moon.mr
              </span>
            </a>

            <a
              href="tel:+22230454777"
              className="flex items-center space-x-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-moon-yellow/30 transition-all duration-300 group"
            >
              <div className="p-3 bg-amber-900/30 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                <Phone className="w-6 h-6 text-moon-yellow" />
              </div>
              <span className="text-lg text-white font-medium">+222 30454777</span>
            </a>

            <div className="flex items-center space-x-4 p-5 rounded-2xl bg-white/5 border border-white/10">
              <div className="p-3 bg-emerald-900/30 rounded-xl flex-shrink-0">
                <MapPin className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-lg text-white font-medium">Nouakchott, Mauritania</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
