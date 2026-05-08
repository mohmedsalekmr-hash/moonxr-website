"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollFeatures() {
  const { scrollYProgress, scrollY } = useScroll();
  const [showBackToTop, setShowBackToTop] = useState(false);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 32,
    restDelta: 0.001,
  });

  useEffect(() => {
    // Immediately check current scroll position on mount
    setShowBackToTop(scrollY.get() > 400);

    return scrollY.on("change", (latest) => {
      setShowBackToTop(latest > 400);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-moon-blue to-moon-blue-light origin-left pointer-events-none"
        style={{ scaleX, zIndex: 9999 }}
      />

      {/* Back to Top Button */}
      <motion.button
        initial={false}
        animate={{
          opacity: showBackToTop ? 1 : 0,
          scale: showBackToTop ? 1 : 0.8,
          y: showBackToTop ? 0 : 12,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={scrollToTop}
        aria-label="Back to top"
        style={{
          pointerEvents: showBackToTop ? "auto" : "none",
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          zIndex: 9990,
        }}
        className="p-3 rounded-full bg-moon-blue/80 backdrop-blur-md border border-moon-blue-light/30 shadow-[0_0_20px_rgba(0,122,255,0.3)] text-white hover:bg-moon-blue hover:scale-110 transition-colors"
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </>
  );
}
