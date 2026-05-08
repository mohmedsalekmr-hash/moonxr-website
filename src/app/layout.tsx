import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ScrollFeatures } from "@/components/ScrollFeatures";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "MoonXR | Connect to top VR providers",
  description: "MoonXR connects you to top Virtual Reality companies and brings you the best deals for your immersive tech needs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${outfit.variable}`} style={{ overflowX: "hidden" }}>
      <body
        className="font-sans bg-black text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-50"
        style={{ overflowX: "hidden", minHeight: "100vh" }}
      >
        <LanguageProvider>
          <ScrollFeatures />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
