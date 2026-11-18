"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/data/i18n";
import { explorer, steps } from "@/data/explorer";

type Api = { enter: () => void; exit: () => void; focus: (id: string | null) => void };

/**
 * Hero 3D scene: a real Meta Quest 3 (CC BY 4.0, Roberto Domínguez) with the Moon XR logo.
 * Idle: it turns slowly and can be dragged. Click it → explore mode: the page copy fades,
 * the headset comes to the centre, the controllers fly in, callouts appear on each part,
 * and the visitor can rotate, zoom (wheel / pinch) and read what every part does.
 */
export default function Hero3D({ rtl = false, lang }: { rtl?: boolean; lang: Locale }) {
  const host = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const api = useRef<Api | null>(null);
  const [ready, setReady] = useState(false);
  const [explore, setExplore] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const select = useCallback((id: string | null) => {
    setActive(id);
    api.current?.focus(id);
  }, []);
  const enter = useCallback(() => {
    if (!api.current) return; // 3D scene still loading
    setExplore(true);
    setActive(null);
    api.current?.enter();
  }, []);
  const exit = useCallback(() => {
    setExplore(false);
    setActive(null);
    api.current?.exit();
  }, []);

  // the hero's "Explorer le casque" button
  useEffect(() => {
    const on = () => enter();
    window.addEventListener("mx-explore", on);
    return () => window.removeEventListener("mx-explore", on);
  }, [enter]);

  // page copy fades out while exploring; Escape closes
  useEffect(() => {
    const section = host.current?.closest("section");
    if (!section) return;
    if (explore) section.setAttribute("data-explore", "");
    else section.removeAttribute("data-explore");
    if (!explore) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && exit();
    window.addEventListener("keydown", onKey);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    return () => window.removeEventListener("keydown", onKey);
  }, [explore, exit]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const { loadQuest, HOTSPOTS, PART } = await import("./three/quest");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: the page still works without the 3D scene
      }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const touch = window.matchMedia("(pointer: coarse)").matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, touch ? 1.5 : 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;cursor:pointer";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
      scene.environment = env;
      const key = new THREE.DirectionalLight(0xffffff, 1.2);
      key.position.set(1, 2, 2);
      scene.add(key);

      let model: import("three").Group;
      try {
        model = await loadQuest();
      } catch {
        return;
      }
      if (disposed) return;
      scene.add(model);
      model.updateMatrixWorld(true);

      // headset-only framing vs full set (with controllers)
      const controllers: { node: import("three").Object3D; pos: import("three").Vector3 }[] = [];
      model.traverse((o) => {
        if (o.name === PART.controllerLeft || o.name === PART.controllerRight) {
          const node = o.parent ?? o;
          controllers.push({ node, pos: node.position.clone() });
        }
      });
      const headBox = new THREE.Box3();
      model.traverse((o) => {
        const m = o as import("three").Mesh;
        if (m.isMesh && m.name !== PART.controllerLeft && m.name !== PART.controllerRight) headBox.expandByObject(m);
      });
      const headCenter = headBox.getCenter(new THREE.Vector3());
      const allCenter = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
      let ctrlShow = 0, ctrlGoal = 0; // controllers fly in when exploring
      const applyControllers = () => {
        controllers.forEach(({ node, pos }) => {
          node.visible = ctrlShow > 0.01;
          node.scale.setScalar(Math.max(0.001, ctrlShow));
          node.position.set(pos.x, pos.y - 0.12 * (1 - ctrlShow), pos.z);
        });
      };
      applyControllers();

      const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 20);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minDistance = 0.22;
      controls.maxDistance = 1.4;
      controls.rotateSpeed = 0.7;
      controls.autoRotate = !reduce;
      controls.autoRotateSpeed = 0.9;
      if (touch) {
        // on phones the idle hero must not block page scrolling: tap to explore
        controls.enabled = false;
        renderer.domElement.style.touchAction = "pan-y";
      }

      // view offset slides the headset to the side in idle mode, centred when exploring
      let shiftX = 0, shiftY = 0, shiftGoalX = 0, shiftGoalY = 0;
      let wide = true, fit = 1;
      const sph = (target: import("three").Vector3, az: number, el: number, d: number) =>
        new THREE.Vector3(target.x + d * Math.sin(az) * Math.cos(el), target.y + d * Math.sin(el), target.z + d * Math.cos(az) * Math.cos(el));

      let exploring = false;
      const idleView = () => ({ target: headCenter.clone(), pos: sph(headCenter, 0.6 * (rtl ? -1 : 1), 0.12, (wide ? 0.62 : 0.78) * fit) });
      const overview = () => ({ target: allCenter.clone(), pos: sph(allCenter, 0.5, 0.22, 0.86 * fit) });

      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        wide = w >= 768;
        fit = Math.max(1, 1.2 / (w / h));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        shiftGoalX = exploring ? (wide ? 0.1 * w : 0) : wide ? (rtl ? 0.22 : -0.22) * w : 0;
        shiftGoalY = exploring ? (wide ? 0 : 0.13 * h) : wide ? 0 : 0.24 * h;
        camera.updateProjectionMatrix();
      };
      resize();
      shiftX = shiftGoalX;
      shiftY = shiftGoalY;
      const start = idleView();
      camera.position.copy(start.pos);
      controls.target.copy(start.target);
      controls.update();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      // smooth camera moves along a sphere (never through the model)
      let anim: { target: import("three").Vector3; pos: import("three").Vector3 } | null = null;
      const curS = new THREE.Spherical(), goalS = new THREE.Spherical();
      const off = new THREE.Vector3();
      const focus = (id: string | null) => {
        controls.autoRotate = false;
        if (!id || !HOTSPOTS[id]) {
          anim = overview();
          return;
        }
        const h = HOTSPOTS[id];
        const p = new THREE.Vector3(...h.point);
        anim = { target: p, pos: sph(p, h.view[0], h.view[1], h.view[2] * fit) };
      };
      api.current = {
        enter: () => {
          exploring = true;
          ctrlGoal = 1;
          controls.enabled = true;
          controls.enableZoom = true;
          controls.autoRotate = false;
          renderer.domElement.style.touchAction = "none";
          renderer.domElement.style.cursor = "grab";
          resize();
          anim = overview();
        },
        exit: () => {
          exploring = false;
          ctrlGoal = 0;
          controls.enableZoom = false;
          controls.autoRotate = !reduce;
          if (touch) {
            controls.enabled = false;
            renderer.domElement.style.touchAction = "pan-y";
          }
          renderer.domElement.style.cursor = "pointer";
          resize();
          anim = idleView();
        },
        focus,
      };

      controls.addEventListener("start", () => {
        anim = null;
        if (exploring) renderer.domElement.style.cursor = "grabbing";
      });
      controls.addEventListener("end", () => {
        if (exploring) renderer.domElement.style.cursor = "grab";
      });

      // click: idle → enter explore; exploring → open the part that was clicked
      let downX = 0, downY = 0;
      const ray = new THREE.Raycaster();
      const onDown = (e: PointerEvent) => {
        downX = e.clientX;
        downY = e.clientY;
      };
      const onUp = (e: PointerEvent) => {
        if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
        const r = renderer.domElement.getBoundingClientRect();
        ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
        const hit = ray.intersectObject(model, true).find((h) => h.object.visible && (h.object.parent?.visible ?? true));
        if (!hit) return;
        if (!exploring) {
          enter();
          return;
        }
        const name = hit.object.name;
        const cands = name === PART.controllerLeft ? ["joystick", "buttons"] : name === PART.controllerRight ? ["trigger"] : ["cameras", "lenses", "strap"];
        let best = cands[0], bd = Infinity;
        for (const c of cands) {
          const d = hit.point.distanceTo(new THREE.Vector3(...HOTSPOTS[c].point));
          if (d < bd) {
            bd = d;
            best = c;
          }
        }
        select(best);
      };
      renderer.domElement.addEventListener("pointerdown", onDown);
      renderer.domElement.addEventListener("pointerup", onUp);
      // hover cursor only over the model in idle mode
      const onHover = (e: PointerEvent) => {
        if (exploring || touch) return;
        const r = renderer.domElement.getBoundingClientRect();
        ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
        renderer.domElement.style.cursor = ray.intersectObject(model, true).length ? "pointer" : "grab";
      };
      renderer.domElement.addEventListener("pointermove", onHover);

      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(el);

      // callouts: dot on the part + label pushed outward from the model's centre
      const ids = Object.keys(HOTSPOTS);
      const pts = ids.map((id) => new THREE.Vector3(...HOTSPOTS[id].point));
      const occluded: Record<string, boolean> = {};
      const v = new THREE.Vector3(), c2 = new THREE.Vector3(), dir = new THREE.Vector3();
      const clock = new THREE.Clock();
      let frameN = 0, raf = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        const dt = Math.min(clock.getDelta(), 0.1);
        const k = 1 - Math.exp(-dt * 3.2);

        shiftX += (shiftGoalX - shiftX) * k;
        shiftY += (shiftGoalY - shiftY) * k;
        const w = el.clientWidth, h = el.clientHeight;
        camera.setViewOffset(w, h, shiftX, shiftY, w, h);

        if (ctrlShow !== ctrlGoal) {
          ctrlShow += (ctrlGoal - ctrlShow) * (1 - Math.exp(-dt * 4));
          if (Math.abs(ctrlGoal - ctrlShow) < 0.002) ctrlShow = ctrlGoal;
          applyControllers();
        }

        if (anim) {
          off.copy(camera.position).sub(controls.target);
          curS.setFromVector3(off);
          goalS.setFromVector3(off.copy(anim.pos).sub(anim.target));
          let dTheta = goalS.theta - curS.theta;
          dTheta = Math.atan2(Math.sin(dTheta), Math.cos(dTheta));
          curS.theta += dTheta * k;
          curS.phi += (goalS.phi - curS.phi) * k;
          curS.radius += (goalS.radius - curS.radius) * k;
          controls.target.lerp(anim.target, k);
          camera.position.copy(controls.target).add(off.setFromSpherical(curS));
          if (Math.abs(dTheta) < 0.003 && Math.abs(goalS.radius - curS.radius) < 0.002 && controls.target.distanceTo(anim.target) < 0.001) anim = null;
        }
        controls.update();
        renderer.render(scene, camera);

        if (exploring) {
          frameN++;
          c2.copy(allCenter).project(camera);
          const cx = ((c2.x + 1) / 2) * w, cy = ((1 - c2.y) / 2) * h;
          ids.forEach((id, i) => {
            const lab = labelRefs.current[id];
            if (!lab) return;
            if (frameN % 8 === 1) {
              dir.copy(pts[i]).sub(camera.position);
              const dist = dir.length();
              ray.set(camera.position, dir.normalize());
              const hit = ray.intersectObject(model, true)[0];
              occluded[id] = !!hit && hit.distance < dist - 0.006;
            }
            v.copy(pts[i]).project(camera);
            const x = ((v.x + 1) / 2) * w, y = ((1 - v.y) / 2) * h;
            let ax = x - cx, ay = y - cy;
            const len = Math.hypot(ax, ay) || 1;
            ax /= len;
            ay /= len;
            lab.style.transform = `translate(${x}px, ${y}px)`;
            lab.style.setProperty("--dx", `${ax * 54}px`);
            lab.style.setProperty("--dy", `${ay * 54}px`);
            lab.style.setProperty("--ang", `${Math.atan2(ay, ax)}rad`);
            lab.dataset.side = ax < 0 ? "l" : "r";
            lab.style.opacity = occluded[id] ? "0.18" : "1";
            lab.style.visibility = v.z > 1 ? "hidden" : "visible";
          });
        }
      };
      tick();
      setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        controls.dispose();
        renderer.domElement.removeEventListener("pointerdown", onDown);
        renderer.domElement.removeEventListener("pointerup", onUp);
        renderer.domElement.removeEventListener("pointermove", onHover);
        env.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        api.current = null;
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [rtl, enter, select]);

  const idx = active ? steps.findIndex((s) => s.id === active) : -1;
  const step = idx >= 0 ? steps[idx] : null;
  const move = (d: number) => {
    const n = idx < 0 ? (d > 0 ? 0 : steps.length - 1) : (idx + d + steps.length) % steps.length;
    select(steps[n].id);
  };

  return (
    <div className="absolute inset-0" dir="ltr">
      <div ref={host} aria-label={explorer.title[lang]} className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />

      {/* idle hint */}
      {ready && !explore && (
        <button
          type="button"
          onClick={enter}
          className="hero-hint absolute bottom-24 end-6 hidden items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-sm font-semibold text-ink shadow-lg ring-1 ring-ink/5 backdrop-blur transition hover:bg-white md:inline-flex rtl:end-auto rtl:start-6"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky" />
          </span>
          <span dir={rtl ? "rtl" : "ltr"}>{lang === "fr" ? "Cliquez sur le casque pour l'explorer" : "اضغط على النظارة لاستكشافها"}</span>
        </button>
      )}
      {ready && !explore && (
        <button
          type="button"
          onClick={enter}
          className="absolute left-1/2 top-[44%] -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-ink shadow-lg ring-1 ring-ink/5 md:hidden"
        >
          <span dir={rtl ? "rtl" : "ltr"}>{lang === "fr" ? "Toucher pour explorer" : "اضغط للاستكشاف"}</span>
        </button>
      )}

      {/* callouts on the model */}
      {explore &&
        steps.map((s, i) => (
          <div
            key={s.id}
            ref={(n) => {
              labelRefs.current[s.id] = n;
            }}
            className="callout pointer-events-none absolute left-0 top-0 transition-opacity duration-300"
          >
            <span className="callout-line" />
            <button
              type="button"
              onClick={() => select(s.id)}
              className={`callout-dot pointer-events-auto ${active === s.id ? "is-active" : ""}`}
              aria-label={s.title[lang]}
            />
            <button
              type="button"
              onClick={() => select(s.id)}
              className={`callout-label pointer-events-auto ${active === s.id ? "is-active" : ""}`}
            >
              <span className="callout-num">{i + 1}</span>
              <span dir={rtl ? "rtl" : "ltr"}>{s.title[lang]}</span>
            </button>
          </div>
        ))}

      {/* explore UI */}
      {explore && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-20 z-10 md:top-24">
            <div className="wrap flex items-start justify-between gap-4">
              <div dir={rtl ? "rtl" : "ltr"}>
                <div className="kicker">{explorer.kicker[lang]}</div>
                <div className="mt-1 hidden text-sm text-ink/55 md:block">
                  {lang === "fr" ? "Glissez pour tourner · molette ou pincement pour zoomer" : "اسحب للتدوير · العجلة أو الأصابع للتكبير"}
                </div>
              </div>
              <button type="button" onClick={exit} className="pointer-events-auto btn btn-ghost !py-2 text-sm shadow-sm">
                ✕ {lang === "fr" ? "Fermer" : "إغلاق"}
              </button>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-4 z-10 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
            <div className="wrap">
              <div
                dir={rtl ? "rtl" : "ltr"}
                className="explore-panel mx-auto w-full max-w-md rounded-3xl border border-white/60 bg-white/85 p-5 shadow-[0_20px_60px_-20px_rgba(11,27,63,0.35)] backdrop-blur-xl md:me-0 md:ms-auto md:max-w-[340px] md:p-6"
                aria-live="polite"
              >
                <div className="text-xs font-semibold text-sky">
                  {step ? `${explorer.groups[step.group][lang]} · ${idx + 1}/${steps.length}` : "Meta Quest 3"}
                </div>
                <h3 className="font-display mt-1.5 text-xl font-semibold md:text-2xl">{step ? step.title[lang] : explorer.intro.title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70 md:text-[0.95rem]">{step ? step.text[lang] : explorer.intro.text[lang]}</p>
                <div className="mt-4 flex items-center gap-2">
                  <button type="button" onClick={() => move(-1)} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 hover:border-ink/40" aria-label={explorer.prev[lang]}>
                    <span className="rtl:rotate-180">←</span>
                  </button>
                  <button type="button" onClick={() => move(1)} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 hover:border-ink/40" aria-label={explorer.next[lang]}>
                    <span className="rtl:rotate-180">→</span>
                  </button>
                  <div className="ms-2 flex gap-1.5">
                    {steps.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => select(s.id)}
                        aria-label={s.title[lang]}
                        className={`h-1.5 rounded-full transition-all ${active === s.id ? "w-6 bg-sky" : "w-1.5 bg-ink/20 hover:bg-ink/40"}`}
                      />
                    ))}
                  </div>
                  {step && (
                    <button type="button" onClick={() => select(null)} className="ms-auto text-xs font-semibold text-ink/55 hover:text-ink">
                      {explorer.reset[lang]}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
