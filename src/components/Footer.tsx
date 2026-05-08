"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Globe, MessageCircle, Mail, ArrowUpRight } from "lucide-react";
import { useRef, useEffect } from "react";

/* ── Neural-network / holographic particle canvas ─────────────────────────── */
function FooterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;

    /* ── Node definition ── */
    type Node = {
      x: number; y: number;
      vx: number; vy: number;
      r: number; pulse: number; pulseSpeed: number;
    };

    const nodes: Node[] = [];
    const NODE_COUNT = 55;
    const MAX_DIST = 160;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    const spawn = () => {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.8 + 0.8,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.018 + Math.random() * 0.022,
        });
      }
    };

    resize();
    spawn();

    const ro = new ResizeObserver(() => { resize(); spawn(); });
    ro.observe(canvas);

    /* ── Colour palette matching the site ── */
    const BLUE  = "rgba(0,122,255,";
    const GOLD  = "rgba(251,183,48,";
    const WHITE = "rgba(255,255,255,";

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      /* ── Subtle horizontal scan-line grid ── */
      ctx.save();
      const gridStep = 32;
      ctx.strokeStyle = "rgba(0,122,255,0.035)";
      ctx.lineWidth = 1;
      for (let y = 0; y < H; y += gridStep) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      for (let x = 0; x < W; x += gridStep * 2) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      ctx.restore();

      /* ── Move nodes ── */
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy; n.pulse += n.pulseSpeed;
        if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
        if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
      }

      /* ── Draw edges ── */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.22;
            // alternate edge colour by index for VR-feel
            const col = (i + j) % 5 === 0 ? GOLD : BLUE;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = col + alpha + ")";
            ctx.lineWidth = (1 - dist / MAX_DIST) * 1.2;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      /* ── Draw nodes ── */
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const glow = (Math.sin(n.pulse) + 1) / 2;          // 0→1
        const baseAlpha = 0.35 + glow * 0.55;
        const col = i % 7 === 0 ? GOLD : i % 4 === 0 ? WHITE : BLUE;

        // outer glow ring
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        grad.addColorStop(0, col + (baseAlpha * 0.6).toFixed(2) + ")");
        grad.addColorStop(1, col + "0)");
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = col + baseAlpha.toFixed(2) + ")";
        ctx.fill();
      }

      /* ── Sweeping horizontal light ray ── */
      const sweep = (Date.now() * 0.00025) % 1;
      const ry = sweep * H;
      const rGrad = ctx.createLinearGradient(0, ry - 30, 0, ry + 30);
      rGrad.addColorStop(0,   "rgba(0,122,255,0)");
      rGrad.addColorStop(0.5, "rgba(0,122,255,0.06)");
      rGrad.addColorStop(1,   "rgba(0,122,255,0)");
      ctx.fillStyle = rGrad;
      ctx.fillRect(0, ry - 30, W, 60);

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.85 }}
    />
  );
}

/* ── Footer ────────────────────────────────────────────────────────────────── */
export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-10 border-t border-white/[0.06] overflow-hidden pt-16 pb-8"
      style={{ background: "linear-gradient(to bottom, rgba(2,6,23,0) 0%, rgba(2,6,23,0.7) 20%, rgba(2,6,23,0.88) 100%)" }}
    >

      {/* ── Ambient orbs ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Blue orb — left */}
        <div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,122,255,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
        />
        {/* Gold orb — right */}
        <div
          className="absolute -bottom-16 right-10 w-56 h-56 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(251,183,48,0.08) 0%, transparent 70%)", filter: "blur(35px)" }}
        />
        {/* Top accent line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-moon-blue-light/40 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-3xl font-display font-bold mb-4 lowercase flex items-center">
              <span className="text-white">m</span><span className="text-moon-yellow">o</span><span className="text-white">on</span>
              <span className="text-moon-blue-light drop-shadow-[0_0_8px_rgba(0,122,255,0.6)] uppercase ml-1.5 text-2xl">XR</span>
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              {t(
                "Connecting you to the world's top Virtual Reality providers. Elevate your enterprise with immersive technology.",
                "Nous vous connectons aux meilleurs fournisseurs de réalité virtuelle au monde. Améliorez votre entreprise avec la technologie immersive."
              )}
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Globe,         href: "#" },
                { Icon: MessageCircle, href: "#" },
                { Icon: Mail,          href: "mailto:mohamedsaleck@moon.mr" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-moon-blue/20 hover:border-moon-blue/50 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">{t("Quick Links", "Liens Rapides")}</h4>
            <ul className="space-y-3">
              {[
                { label: t("Home", "Accueil"),     href: "/" },
                { label: t("Providers", "Fournisseurs"), href: "/providers" },
                { label: t("Contact", "Contact"),  href: "#contact" },
              ].map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-moon-blue-light text-sm flex items-center gap-1 transition-colors group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5">{t("Contact Us", "Contactez-nous")}</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-white/50">Nouakchott, Mauritania</li>
              <li>
                <a href="mailto:mohamedsaleck@moon.mr" className="text-white/50 hover:text-moon-blue-light transition-colors">
                  mohamedsaleck@moon.mr
                </a>
              </li>
              <li>
                <a href="tel:+22230454777" className="text-white/50 hover:text-moon-yellow transition-colors">
                  +222 30454777
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/35 text-xs">
            &copy; {new Date().getFullYear()} MoonXR. {t("All rights reserved.", "Tous droits réservés.")}
          </p>
          <p className="text-white/35 text-xs flex items-center gap-1">
            {t("Made with", "Fait avec")} <span className="text-red-400 animate-pulse">❤️</span> {t("in Mauritania", "en Mauritanie")}
          </p>
        </div>
      </div>
    </footer>
  );
}
