"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/data/i18n";
import { explorer, steps } from "@/data/explorer";

type Api = { enter: () => void; exit: () => void; focus: (id: string | null, group?: "headset" | "controller" | null) => void };

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
  const [tour, setTour] = useState(false);
  const [hint, setHint] = useState(false);
  const hintRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLSpanElement>(null);
  const userAct = useRef<() => void>(() => {});

  const select = useCallback((id: string | null) => {
    setActive(id);
    api.current?.focus(id, id ? (steps.find((s) => s.id === id)?.group ?? null) : null);
  }, []);
  const enter = useCallback(() => {
    if (!api.current) return; // 3D scene still loading
    setExplore(true);
    setActive(null);
    setHint(false);
    api.current?.enter();
  }, []);
  const exit = useCallback(() => {
    setExplore(false);
    setActive(null);
    setTour(false);
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
    window.dispatchEvent(new CustomEvent("mx-studio", { detail: explore }));
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
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;cursor:grab";
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

      // own materials per mesh, so one part can fade while another is in focus
      const isCtrl = (o: import("three").Object3D) => {
        for (let p: import("three").Object3D | null = o; p; p = p.parent) if (p.name === PART.controllerLeft || p.name === PART.controllerRight) return true;
        return false;
      };
      const groupMats: Record<"headset" | "controller", import("three").Material[]> = { headset: [], controller: [] };
      model.traverse((o) => {
        const m = o as import("three").Mesh;
        if (!m.isMesh) return;
        const mats = (Array.isArray(m.material) ? m.material : [m.material]).map((x) => x.clone());
        m.material = Array.isArray(m.material) ? mats : mats[0];
        groupMats[isCtrl(m) ? "controller" : "headset"].push(...mats);
      });
      const dim = { headset: 1, controller: 1 }, dimGoal = { headset: 1, controller: 1 };
      const groupMeshes: Record<"headset" | "controller", import("three").Object3D[]> = { headset: [], controller: [] };
      model.traverse((o) => (o as import("three").Mesh).isMesh && groupMeshes[isCtrl(o) ? "controller" : "headset"].push(o));
      const applyDim = (g: "headset" | "controller") => {
        groupMeshes[g].forEach((o) => (o.visible = dim[g] > 0.02));
        groupMats[g].forEach((mat) => {
          mat.transparent = dim[g] < 0.999;
          mat.opacity = dim[g];
          mat.depthWrite = dim[g] > 0.6;
        });
      };

      // headset-only framing vs full set (with controllers)
      const controllers: { node: import("three").Object3D; pos: import("three").Vector3; rotY: number; side: number }[] = [];
      model.traverse((o) => {
        if (o.name === PART.controllerLeft || o.name === PART.controllerRight) {
          const node = o.parent ?? o;
          controllers.push({ node, pos: node.position.clone(), rotY: node.rotation.y, side: 0 });
        }
      });
      const headBox = new THREE.Box3();
      model.traverse((o) => {
        const m = o as import("three").Mesh;
        if (m.isMesh && m.name !== PART.controllerLeft && m.name !== PART.controllerRight) headBox.expandByObject(m);
      });
      const headCenter = headBox.getCenter(new THREE.Vector3());
      const allCenter = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
      controllers.forEach((c) => {
        const b = new THREE.Box3().setFromObject(c.node);
        c.side = Math.sign(b.getCenter(new THREE.Vector3()).x - headCenter.x) || 1;
      });
      // the controllers slide in from each side, the second one a beat later, with a little spin
      let ctrlClock = 0, ctrlGoal = 0;
      const easeOutBack = (x: number) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
      const applyControllers = () => {
        controllers.forEach(({ node, pos, rotY, side }, i) => {
          const p = Math.min(1, Math.max(0, (ctrlClock - 0.25 - i * 0.22) / 0.9));
          const e = p >= 1 ? 1 : easeOutBack(p);
          node.visible = p > 0;
          node.scale.setScalar(Math.max(0.001, Math.min(1, p * 2.5)));
          node.position.set(pos.x + side * 0.42 * (1 - e), pos.y + 0.06 * (1 - e), pos.z - 0.1 * (1 - e));
          node.rotation.y = rotY + side * 1.7 * (1 - e);
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
      let wiggle = reduce ? 0 : 1; // idle sway, until the first touch
      const idleView = () => ({ target: headCenter.clone(), pos: sph(headCenter, 0.6 * (rtl ? -1 : 1), 0.12, (wide ? 0.62 : 0.78) * fit) });
      const overview = () => ({ target: allCenter.clone(), pos: sph(allCenter, 0.5, 0.22, 0.86 * fit) });

      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        wide = w >= 768;
        fit = Math.max(1, 1.2 / (w / h));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        shiftGoalX = exploring ? (wide ? (rtl ? -0.12 : 0.12) * w : 0) : wide ? (rtl ? 0.22 : -0.22) * w : 0;
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
      const focus = (id: string | null, group?: "headset" | "controller" | null) => {
        controls.autoRotate = false;
        // the part in focus stays alone on stage, the rest fades away
        dimGoal.headset = group === "controller" ? 0 : 1;
        dimGoal.controller = group === "headset" ? 0 : 1;
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
          wiggle = 0;
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
          dimGoal.headset = dimGoal.controller = 1;
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
        wiggle = 0;
        userAct.current();
      };
      const onDbl = () => {
        if (exploring) select(null);
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
      renderer.domElement.addEventListener("dblclick", onDbl);
      // hover cursor only over the model in idle mode
      const onHover = (e: PointerEvent) => {
        if (exploring || touch) return;
        const r = renderer.domElement.getBoundingClientRect();
        ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), camera);
        renderer.domElement.style.cursor = ray.intersectObject(model, true).length ? "grab" : "default";
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
      let frameN = 0, raf = 0, t = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        const dt = Math.min(clock.getDelta(), 0.1);
        const k = 1 - Math.exp(-dt * 3.2);

        shiftX += (shiftGoalX - shiftX) * k;
        shiftY += (shiftGoalY - shiftY) * k;
        const w = el.clientWidth, h = el.clientHeight;
        camera.setViewOffset(w, h, shiftX, shiftY, w, h);

        const ctrlEnd = 0.25 + (controllers.length - 1) * 0.22 + 0.9;
        if (ctrlGoal && ctrlClock < ctrlEnd) {
          ctrlClock = Math.min(ctrlEnd, ctrlClock + dt);
          applyControllers();
        } else if (!ctrlGoal && ctrlClock > 0) {
          ctrlClock = Math.max(0, ctrlClock - dt * 3);
          applyControllers();
        }
        (["headset", "controller"] as const).forEach((g) => {
          if (Math.abs(dim[g] - dimGoal[g]) > 0.002) {
            dim[g] += (dimGoal[g] - dim[g]) * (1 - Math.exp(-dt * 9));
            applyDim(g);
          }
        });

        // idle hint: the headset sways with the hand drawn over it
        t += dt;
        if (!exploring) {
          const ph = t % 5; // two swings, then a pause
          const sway = ph < 2 ? Math.sin(ph * Math.PI) * wiggle : 0;
          model.rotation.y = sway * 0.35;
          controls.autoRotate = !reduce && wiggle < 0.05;
          if (hintRef.current) {
            c2.copy(headCenter).project(camera);
            hintRef.current.style.transform = `translate(${((c2.x + 1) / 2) * w}px, ${((1 - c2.y) / 2) * h}px)`;
          }
          if (handRef.current) handRef.current.style.transform = `translateX(${sway * 34}px) rotate(${sway * 10}deg)`;
        } else if (model.rotation.y !== 0) model.rotation.y *= 1 - k;

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
      setTimeout(() => !disposed && !exploring && setHint(true), 1200);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        controls.dispose();
        renderer.domElement.removeEventListener("pointerdown", onDown);
        renderer.domElement.removeEventListener("pointerup", onUp);
        renderer.domElement.removeEventListener("dblclick", onDbl);
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
  const move = useCallback(
    (d: number) => {
      const i = active ? steps.findIndex((s) => s.id === active) : -1;
      const n = i < 0 ? (d > 0 ? 0 : steps.length - 1) : (i + d + steps.length) % steps.length;
      select(steps[n].id);
    },
    [active, select],
  );

  // any touch on the scene stops the idle hint and the guided tour
  useEffect(() => {
    userAct.current = () => {
      setHint(false);
      setTour(false);
    };
  }, []);

  // guided tour: one part every 5 s, then back to the overview
  const TOUR_MS = 5200;
  useEffect(() => {
    if (!tour) return;
    const t = setTimeout(() => {
      if (idx === steps.length - 1) {
        setTour(false);
        select(null);
      } else move(1);
    }, idx < 0 ? 400 : TOUR_MS);
    return () => clearTimeout(t);
  }, [tour, idx, move, select]);

  // keyboard: arrows move between parts
  useEffect(() => {
    if (!explore) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      setTour(false);
      move((e.key === "ArrowRight") !== rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [explore, move, rtl]);

  const t = (v: { fr: string; ar: string }) => v[lang];

  return (
    <div className="absolute inset-0" dir="ltr">
      {/* dark studio behind the headset while exploring */}
      <div aria-hidden className={`studio pointer-events-none absolute inset-0 transition-opacity duration-700 ${explore ? "opacity-100" : "opacity-0"}`} />

      <div ref={host} aria-label={explorer.title[lang]} className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />

      {/* idle hint: a hand over the headset, swaying it */}
      {ready && !explore && (
        <div ref={hintRef} className="pointer-events-none absolute left-0 top-0 z-10" aria-hidden={!hint}>
          <div className={`drag-hint ${hint ? "is-on" : ""}`}>
            <span className="drag-hint-arc" />
            <span ref={handRef} className="drag-hint-hand">
              <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#fff" stroke="#0b1b3f" strokeWidth="1.3" strokeLinejoin="round" aria-hidden>
                <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10m0-.5V4.5a1.5 1.5 0 0 1 3 0V10m0-.5V6a1.5 1.5 0 0 1 3 0v7.5c0 3.6-2.4 6.5-6 6.5h-.6a6 6 0 0 1-4.6-2.2L4.3 14.6a1.5 1.5 0 0 1 2.2-2L9 15V11Z" />
              </svg>
            </span>
            <button type="button" onClick={enter} className="drag-hint-cap pointer-events-auto md:hidden" dir={rtl ? "rtl" : "ltr"}>
              {t(explorer.hintTap)}
            </button>
          </div>
        </div>
      )}
      {ready && !explore && (
        <button
          type="button"
          onClick={enter}
          className={`drag-hint-label absolute bottom-24 left-1/2 z-10 -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-sm font-semibold text-ink shadow-lg ring-1 ring-ink/5 backdrop-blur transition hover:bg-white md:bottom-20 md:left-auto md:translate-x-0 ${rtl ? "md:left-[22%]" : "md:right-[22%]"} hidden md:inline-flex`}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sky" />
          </span>
          <span dir={rtl ? "rtl" : "ltr"}>
            {t(explorer.hintDrag)}

          </span>
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
            data-dim={step && step.id !== s.id ? "" : undefined}
            data-hide={step && step.group !== s.group ? "" : undefined}
            className="callout pointer-events-none absolute left-0 top-0"
            style={{ animationDelay: `${0.9 + i * 0.08}s` }}
          >
            <span className="callout-line" />
            <button type="button" onClick={() => { setTour(false); select(s.id); }} className={`callout-dot pointer-events-auto ${active === s.id ? "is-active" : ""}`} aria-label={s.title[lang]} />
            <button type="button" onClick={() => { setTour(false); select(s.id); }} className={`callout-label pointer-events-auto ${active === s.id ? "is-active" : ""}`}>
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
                <div className="kicker !text-sun">{explorer.kicker[lang]}</div>
                <div className="mt-1 hidden text-sm text-white/55 md:block">{t(explorer.help)}</div>
              </div>
              <button type="button" onClick={exit} className="pointer-events-auto btn border border-white/25 !py-2 text-sm text-white hover:border-white/60">
                ✕ {lang === "fr" ? "Fermer" : "إغلاق"}
              </button>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-4 z-10 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
            <div className="wrap">
              <div
                key={active ?? "intro"}
                dir={rtl ? "rtl" : "ltr"}
                className="explore-panel relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-white/12 bg-white/[0.07] p-5 text-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl md:me-0 md:ms-auto md:max-w-[350px] md:p-6"
                aria-live="polite"
              >
                <div className="text-xs font-semibold text-sun">
                  {step ? `${explorer.groups[step.group][lang]} · ${idx + 1}/${steps.length}` : "Meta Quest 3"}
                </div>
                <h3 className="font-display mt-1.5 text-xl font-semibold md:text-2xl">{step ? step.title[lang] : explorer.intro.title[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-[0.95rem]">{step ? step.text[lang] : explorer.intro.text[lang]}</p>
                {(step ? step.spec : explorer.introSpec) && (
                  <div className="mt-3 rounded-xl bg-white/[0.08] px-3 py-2 text-xs font-medium leading-relaxed text-white/85 ring-1 ring-white/10">
                    {t((step ? step.spec : explorer.introSpec)!)}
                  </div>
                )}

                {!step && !tour ? (
                  <div className="mt-5">
                    <button type="button" onClick={() => setTour(true)} className="btn w-full justify-center bg-sun text-ink hover:brightness-105">
                      ▶ {t(explorer.tour)}
                    </button>
                    <p className="mt-2 text-center text-xs text-white/50">{t(explorer.or)}</p>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2">
                    <button type="button" onClick={() => { setTour(false); move(-1); }} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 hover:border-white/60" aria-label={explorer.prev[lang]}>
                      <span className="rtl:rotate-180">←</span>
                    </button>
                    <button type="button" onClick={() => { setTour(false); move(1); }} className="grid h-9 w-9 place-items-center rounded-full border border-white/20 hover:border-white/60" aria-label={explorer.next[lang]}>
                      <span className="rtl:rotate-180">→</span>
                    </button>
                    <div className="ms-2 flex gap-1.5">
                      {steps.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => { setTour(false); select(s.id); }}
                          aria-label={s.title[lang]}
                          className={`h-1.5 rounded-full transition-all ${active === s.id ? "w-6 bg-sun" : "w-1.5 bg-white/25 hover:bg-white/50"}`}
                        />
                      ))}
                    </div>
                    <button type="button" onClick={() => (tour ? setTour(false) : (setTour(false), select(null)))} className="ms-auto text-xs font-semibold text-white/60 hover:text-white">
                      {tour ? `❚❚ ${t(explorer.stop)}` : explorer.reset[lang]}
                    </button>
                  </div>
                )}
                {tour && step && <span key={`bar-${active}`} className="tour-bar" style={{ animationDuration: `${TOUR_MS}ms` }} />}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
