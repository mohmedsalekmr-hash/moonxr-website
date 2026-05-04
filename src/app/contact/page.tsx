import { CanvasBackground } from "@/components/CanvasBackground";
import { Header } from "@/components/Header";
import { Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen flex flex-col">
      <CanvasBackground />
      <Header />
      
      <div className="flex-grow flex items-center justify-center relative z-10 px-6">
        <div className="glass-panel p-10 md:p-16 rounded-3xl w-full max-w-lg text-center shadow-[0_0_50px_rgba(157,0,255,0.15)] border-t border-purple-500/30">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Contact <span className="text-gradient">Us</span>
          </h1>
          <p className="text-white/60 mb-10">
            Get in touch with our team to start your VR journey.
          </p>

          <div className="space-y-6">
            <a 
              href="mailto:contact@moonxr.com" 
              className="flex items-center justify-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-lg text-white font-medium">contact@moonxr.com</span>
            </a>

            <a 
              href="tel:+1234567890" 
              className="flex items-center justify-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            >
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-lg text-white font-medium">+1 234 567 890</span>
            </a>
          </div>
        </div>
      </div>

      <footer className="relative z-10 border-t border-white/10 bg-brand-dark/80 backdrop-blur-md py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white/40 text-sm">
            © 2026 MoonXR. Connecting you to top VR providers.
          </p>
        </div>
      </footer>
    </main>
  );
}
