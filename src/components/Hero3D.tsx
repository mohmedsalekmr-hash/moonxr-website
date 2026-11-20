"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/data/i18n";
import { explorer as defExplorer, steps as defSteps, type Explorer } from "@/data/explorer";

type Api = { enter: () => void; exit: () => void; focus: (id: string | null, group?: "headset" | "controller" | null) => void; drift: (on: boolean) => void };

/**
 * Hero 3D scene: a real Meta Quest 3 (CC BY 4.0, Roberto Domínguez) with the Moon XR logo.
 * Idle: it turns slowly and can be dragged. Click it → explore mode: the page copy fades,
 * the headset comes to the centre, the controllers fly in, callouts appear on each part,
 * and the visitor can rotate, zoom (wheel / pinch) and read what every part does.
 */
export default function Hero3D({ rtl = false, lang, data }: { rtl?: boolean; lang: Locale; data?: Explorer }) {
  // texts of the headset tour, edited in the admin (site texts → 3D headset)
  const explorer = data?.explorer ?? defExplorer;
  const steps = data?.steps ?? defSteps;
  const host = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const api = useRef<Api | null>(null);
  const [ready, setReady] = useState(false);
  const [explore, setExplore] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [tour, setTour] = useState(false);
  const [hint, setHint] = useState(false);
  const hintRef = useRef<HTMLDivElement>(null);
  const userAct = useRef<() => void>(() => {});
  /** «choose»: the start card (tour or free); «tour»: guided; «free»: the visitor drives */
  const [mode, setMode] = useState<"choose" | "tour" | "free">("choose");
  const [paused, setPaused] = useState(false);
  const activeRef = useRef<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const shownAt = useRef(0);
  const chapters = useRef<HTMLDivElement>(null);

  const select = useCallback((id: string | null) => {
    setActive(id);
    activeRef.current = id;
    api.current?.focus(id, id ? (steps.find((s) => s.id === id)?.group ?? null) : null);
  }, []);
  const enter = useCallback(() => {
    if (!api.current) return; // 3D scene still loading
    setExplore(true);
    setActive(null);
    setHint(false);
    api.current?.enter();
    setMode("choose"); // a short start card: guided tour or explore alone
    setTour(false);
  }, []);
  const exit = useCallback(() => {
    setExplore(false);
    setActive(null);
    activeRef.current = null;
    setMode("choose");
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
    const phone = window.matchMedia("(max-width: 767px)").matches;
    if (phone) {
      document.documentElement.style.overflow = "hidden";
      document.documentElement.setAttribute("data-explore-full", "");
    }
    else section.scrollIntoView({ behavior: "smooth", block: "start" });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      document.documentElement.removeAttribute("data-explore-full");
    };
  }, [explore, exit]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      // let the page paint and settle first; the scene starts when the browser is idle
      await new Promise<void>((r) => {
        const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
        if (ric) ric(() => r(), { timeout: 1500 });
        else setTimeout(r, 400);
      });
      if (disposed) return;
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
        const mats = (Array.isArray(m.material) ? m.material : [m.material]).map((x) => {
          const c = x.clone();
          c.userData.baseTransparent = c.transparent;
          c.userData.baseOpacity = c.opacity;
          return c;
        });
        m.material = Array.isArray(m.material) ? mats : mats[0];
        groupMats[isCtrl(m) ? "controller" : "headset"].push(...mats);
      });
      const dim = { headset: 1, controller: 1 }, dimGoal = { headset: 1, controller: 1 };
      const groupMeshes: Record<"headset" | "controller", import("three").Object3D[]> = { headset: [], controller: [] };
      model.traverse((o) => (o as import("three").Mesh).isMesh && groupMeshes[isCtrl(o) ? "controller" : "headset"].push(o));
      const applyDim = (g: "headset" | "controller") => {
        groupMeshes[g].forEach((o) => (o.visible = dim[g] > 0.02));
        groupMats[g].forEach((mat) => {
          mat.transparent = mat.userData.baseTransparent || dim[g] < 0.999;
          mat.opacity = (mat.userData.baseOpacity ?? 1) * dim[g];
          mat.depthWrite = mat.userData.baseTransparent ? mat.depthWrite : dim[g] > 0.6;
        });
      };

      // product-shot layout: the headset in the middle, one controller standing on each side
      const V = () => new THREE.Vector3();
      const headBox = new THREE.Box3();
      model.traverse((o) => (o as import("three").Mesh).isMesh && !isCtrl(o) && headBox.expandByObject(o));
      const headCenter = headBox.getCenter(V());
      const headSize = headBox.getSize(V());
      const flatR = (b: import("three").Box3) => { const z = b.getSize(new THREE.Vector3()); return 0.5 * Math.hypot(z.x, z.y, z.z * 0.4); };
      const headRadius = flatR(headBox);
      type Ctrl = {
        node: import("three").Object3D; name: string; side: number; rotY: number;
        base: import("three").Box3; baseW: import("three").Vector3;
        finalW: import("three").Vector3; delta: import("three").Vector3; box: import("three").Box3;
      };
      const controllers: Ctrl[] = [];
      model.traverse((o) => {
        if (o.name !== PART.controllerLeft && o.name !== PART.controllerRight) return;
        const node = o.parent ?? o;
        const b = new THREE.Box3().setFromObject(node);
        const side = Math.sign(b.getCenter(V()).x - headCenter.x) || 1;
        controllers.push({ node, name: o.name, side, rotY: node.rotation.y, base: b, baseW: node.getWorldPosition(V()), finalW: V(), delta: V(), box: b.clone() });
      });
      // desktop (landscape): a controller on each side of the headset; phone (portrait): both under it
      const layoutBox = new THREE.Box3();
      const layoutCenter = V();
      let layoutRadius = 0;
      const setLayout = (portrait: boolean) => {
        controllers.forEach((c) => {
          const cc = c.base.getCenter(V()), cs = c.base.getSize(V());
          const want = portrait
            ? new THREE.Vector3(headCenter.x + c.side * (cs.x / 2 + 0.03), headBox.min.y - cs.y / 2 - 0.015, headCenter.z + 0.02)
            : new THREE.Vector3(headCenter.x + c.side * (headSize.x / 2 + cs.x / 2 + 0.025), headCenter.y - headSize.y * 0.35, headCenter.z + 0.03);
          c.delta.copy(want).sub(cc);
          c.finalW.copy(c.baseW).add(c.delta);
          c.box.copy(c.base).translate(c.delta);
        });
        layoutBox.copy(headBox);
        controllers.forEach((c) => layoutBox.union(c.box));
        layoutBox.getCenter(layoutCenter);
        layoutRadius = flatR(layoutBox);
      };
      setLayout(false);
      // hotspots on the controllers follow them to their new place
      const ctrlOf = (id: string) => controllers.find((c) => c.name === (id === "trigger" ? PART.controllerRight : PART.controllerLeft));
      const pointOf = (id: string) => {
        const p = new THREE.Vector3(...HOTSPOTS[id].point);
        const c = HOTSPOTS[id] && ["joystick", "buttons", "trigger"].includes(id) ? ctrlOf(id) : undefined;
        return c ? p.add(c.delta) : p;
      };

      // the controllers slide in from each side once the headset has settled, the second a beat later
      const CTRL_DELAY = 1.1;
      let ctrlClock = 0, ctrlGoal = 0, staged = false;
      // when one controller is in focus, the other one steps out too
      const solo: Record<string, number> = {}, soloGoal: Record<string, number> = {};
      const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
      const tmp = V();
      const applyControllers = () => {
        controllers.forEach(({ node, name, side, finalW, rotY }, i) => {
          const so = solo[name] ?? 1;
          const p = Math.min(1, Math.max(0, (ctrlClock - CTRL_DELAY - i * 0.2) / 0.8));
          const e = easeOut(p);
          node.visible = p > 0 && dim.controller * so > 0.02;
          tmp.copy(finalW).add(new THREE.Vector3(side * 0.3 * (1 - e), 0.02 * (1 - e), 0));
          node.position.copy(node.parent ? node.parent.worldToLocal(tmp.clone()) : tmp);
          node.rotation.y = rotY + side * 0.9 * (1 - e);
          node.traverse((m) => {
            const mesh = m as import("three").Mesh;
            if (!mesh.isMesh) return;
            (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((mat) => {
              mat.transparent = mat.userData.baseTransparent || e * dim.controller * so < 0.999;
              mat.opacity = (mat.userData.baseOpacity ?? 1) * e * dim.controller * so;
            });
          });
        });
      };
      applyControllers();

      const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 20);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minDistance = 0.15;
      controls.maxDistance = 3;
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
      // while exploring, the 3D set must fit in the area left free by the title (top) and the info card
      // (right on desktop, bottom on phones): fractions of the canvas
      const area = () => (wide ? { w: 0.58, h: 0.66 } : { w: 0.94, h: 0.46 });
      const fitDist = (r: number) => {
        const a = area();
        const t = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
        return (r / Math.min(t * a.h, t * camera.aspect * a.w)) * 1.02;
      };
      const idleView = () => ({ target: headCenter.clone(), pos: sph(headCenter, 0.6 * (rtl ? -1 : 1), 0.12, (wide ? 0.62 : 0.7) * fit) });
      const overview = () => ({ target: layoutCenter.clone(), pos: sph(layoutCenter, 0.32, 0.14, fitDist(layoutRadius)) });
      const headView = () => ({ target: headCenter.clone(), pos: sph(headCenter, 0.4, 0.14, fitDist(headRadius)) });

      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        wide = w >= 768;
        fit = Math.max(1, 1.2 / (w / h));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        // centre of the free area: desktop x 4–64 %, y 18–90 %; phone y 10–56 %
        shiftGoalX = exploring ? (wide ? (rtl ? -0.16 : 0.16) * w : 0) : wide ? (rtl ? 0.22 : -0.22) * w : 0;
        shiftGoalY = exploring ? (wide ? 0.02 * h : 0.17 * h) : wide ? 0 : 0.07 * h;
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
        staged = true;
        // the part in focus stays alone on stage, the rest fades away
        dimGoal.headset = group === "controller" ? 0 : 1;
        dimGoal.controller = group === "headset" ? 0 : 1;
        if (!id || !HOTSPOTS[id]) {
          controllers.forEach((c) => (soloGoal[c.name] = 1));
          anim = overview();
          return;
        }
        const h = HOTSPOTS[id];
        const p = pointOf(id);
        controllers.forEach((c) => (soloGoal[c.name] = 1));
        if (group === "controller") {
          const c = ctrlOf(id)!;
          controllers.forEach((o) => (soloGoal[o.name] = o === c ? 1 : 0));
          const cc = c.box.getCenter(V());
          const target = cc.lerp(p, 0.35);
          anim = { target, pos: sph(target, h.view[0], h.view[1], fitDist(flatR(c.box) * 1.15)) };
        } else {
          // keep the whole headset in view, turned towards the part
          const target = headCenter.clone().lerp(p, 0.3);
          anim = { target, pos: sph(target, h.view[0], h.view[1], fitDist(headRadius) * 0.92) };
        }
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
          setLayout(!wide);
          refreshPts();
          
          anim = headView();
          staged = false;
        },
        exit: () => {
          exploring = false;
          ctrlGoal = 0;
          dimGoal.headset = dimGoal.controller = 1;
          controllers.forEach((c) => (soloGoal[c.name] = 1));
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
        // a very slow turn while a part is being read, so the scene stays alive
        drift: (on: boolean) => {
          if (!exploring || reduce) return;
          controls.autoRotate = on;
          controls.autoRotateSpeed = rtl ? -0.22 : 0.22;
        },
      };

      controls.addEventListener("start", () => {
        anim = null;
        controls.autoRotate = false;
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
          const d = hit.point.distanceTo(pointOf(c));
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
      const pts = ids.map((id) => pointOf(id));
      const refreshPts = () => ids.forEach((id, i) => pts[i].copy(pointOf(id)));
      const occluded: Record<string, boolean> = {};
      const v = new THREE.Vector3(), c2 = new THREE.Vector3(), dir = new THREE.Vector3();
      const clock = new THREE.Clock();
      let frameN = 0, raf = 0;
      const tick = () => {
        raf = requestAnimationFrame(tick);
        if (!visible || document.hidden) return;
        const dt = Math.min(clock.getDelta(), 0.1);
        const k = 1 - Math.exp(-dt * 3.2);
        // camera moves between parts are slower and softer than the page's own motion
        const kc = 1 - Math.exp(-dt * 2.1);

        shiftX += (shiftGoalX - shiftX) * k;
        shiftY += (shiftGoalY - shiftY) * k;
        const w = el.clientWidth, h = el.clientHeight;
        camera.setViewOffset(w, h, shiftX, shiftY, w, h);

        const ctrlEnd = CTRL_DELAY + (controllers.length - 1) * 0.25 + 0.9;
        // once the headset has settled, pull back to make room for the controllers
        if (exploring && !staged && ctrlClock >= CTRL_DELAY - 0.2) {
          staged = true;
          anim = overview();
        }
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
            if (Math.abs(dim[g] - dimGoal[g]) <= 0.002) dim[g] = dimGoal[g];
            if (g === "headset") applyDim(g);
            else applyControllers();
          }
        });
        controllers.forEach(({ name }) => {
          const cur = solo[name] ?? 1, goal = soloGoal[name] ?? 1;
          if (Math.abs(cur - goal) > 0.002) {
            solo[name] = Math.abs(cur - goal) < 0.01 ? goal : cur + (goal - cur) * (1 - Math.exp(-dt * 9));
            applyControllers();
          }
        });

        if (!exploring && hintRef.current) {
          c2.set(headCenter.x, headBox.min.y + headSize.y * 0.12, headBox.max.z - 0.01).project(camera);
          hintRef.current.style.transform = `translate(${((c2.x + 1) / 2) * w}px, ${((1 - c2.y) / 2) * h}px)`;
        }


        if (anim) {
          off.copy(camera.position).sub(controls.target);
          curS.setFromVector3(off);
          goalS.setFromVector3(off.copy(anim.pos).sub(anim.target));
          let dTheta = goalS.theta - curS.theta;
          dTheta = Math.atan2(Math.sin(dTheta), Math.cos(dTheta));
          curS.theta += dTheta * kc;
          curS.phi += (goalS.phi - curS.phi) * kc;
          curS.radius += (goalS.radius - curS.radius) * kc;
          controls.target.lerp(anim.target, kc);
          camera.position.copy(controls.target).add(off.setFromSpherical(curS));
          if (Math.abs(dTheta) < 0.003 && Math.abs(goalS.radius - curS.radius) < 0.002 && controls.target.distanceTo(anim.target) < 0.001) anim = null;
        }
        controls.update();
        renderer.render(scene, camera);

        if (exploring) {
          frameN++;
          let aX = 0, aY = 0, aOn = false;
          c2.copy(layoutCenter).project(camera);
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
            lab.style.opacity = occluded[id] ? "0" : "1";
            lab.style.visibility = v.z > 1 ? "hidden" : "visible";
            if (id === activeRef.current) {
              aX = x;
              aY = y;
              aOn = !occluded[id] && v.z <= 1;
            }
          });
          // leader line: from the part in focus to the info card (computers only)
          const line = lineRef.current, dot = dotRef.current, card = cardRef.current;
          if (line && dot) {
            if (wide && card && activeRef.current && aOn) {
              const hr = el.getBoundingClientRect(), cr = card.getBoundingClientRect();
              const left = cr.left - hr.left, right = cr.right - hr.left, top = cr.top - hr.top;
              const ex = aX < left ? left : right;
              const ey = Math.min(Math.max(aY, top + 28), top + Math.max(40, cr.height - 28));
              const mx = aX + (ex - aX) * 0.55;
              line.setAttribute("d", `M${aX},${aY} L${mx},${ey} L${ex},${ey}`);
              line.style.opacity = "1";
              dot.setAttribute("cx", String(ex));
              dot.setAttribute("cy", String(ey));
              dot.style.opacity = "1";
            } else {
              line.style.opacity = "0";
              dot.style.opacity = "0";
            }
          }
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
      setMode((m) => (m === "tour" ? "free" : m));
    };
  }, []);

  // guided tour: one part every 8 s (time to read it), paused while the card is hovered or touched
  const TOUR_MS = 8000;
  const [left, setLeft] = useState(TOUR_MS);
  useEffect(() => {
    setLeft(TOUR_MS);
    setPaused(false);
    shownAt.current = Date.now();
    // the chapter in focus scrolls into view in the bar (phones)
    chapters.current?.querySelector<HTMLElement>("[aria-current]")?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [active]);
  useEffect(() => {
    if (!tour || paused) return;
    const started = Date.now();
    const t = setTimeout(() => {
      if (idx === steps.length - 1) {
        setTour(false);
        setMode("free");
        select(null);
      } else move(1);
    }, left);
    return () => {
      clearTimeout(t);
      setLeft((l) => Math.max(0, l - (Date.now() - started)));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour, paused, idx]);
  const startTour = useCallback(() => {
    setMode("tour");
    setTour(true);
    setPaused(false);
    select(steps[0].id);
  }, [select, steps]);
  const goFree = useCallback((id?: string) => {
    setMode("free");
    setTour(false);
    if (id) select(id);
  }, [select]);

  // a very slow turn while a part is being read
  useEffect(() => {
    api.current?.drift(explore && !!active && !paused);
  }, [explore, active, paused]);

  // keyboard: arrows move between parts
  useEffect(() => {
    if (!explore) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      setTour(false);
      setMode("free");
      move((e.key === "ArrowRight") !== rtl ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [explore, move, rtl]);

  const t = (v: { fr: string; ar: string; en?: string }) => v[lang] ?? v.fr;

  return (
    <div className="absolute inset-0" dir="ltr">
      {/* dark studio behind the headset while exploring */}
      <div aria-hidden className={`studio pointer-events-none absolute inset-0 transition-opacity duration-700 ${explore ? "opacity-100" : "opacity-0"}`} />

      <div ref={host} aria-label={explorer.title[lang]} className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`} />

      {/* idle hint: a small glass pill under the headset, with a hand that swipes */}
      {ready && !explore && (
        <div ref={hintRef} className="pointer-events-none absolute left-0 top-0 z-10">
          <span className={`hint-anchor ${hint ? "is-on" : ""}`} aria-hidden>
            <span className="hint-dot" />
            <span className="hint-line" />
          </span>
          <button
            type="button"
            onClick={enter}
            dir={rtl ? "rtl" : "ltr"}
            className={`drag-pill pointer-events-auto ${hint ? "is-on" : ""}`}
          >
            <span className="drag-pill-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 11V6a2 2 0 0 0-4 0" />
                <path d="M14 10V4a2 2 0 0 0-4 0v2" />
                <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
                <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
              </svg>
            </span>
            <span className="hidden md:inline">{t(explorer.hintDrag)}</span>
            <span className="md:hidden">{t(explorer.hintTap)}</span>
          </button>
        </div>
      )}

      {/* numbered points on the model: the name shows on hover and for the part in focus */}
      {explore &&
        steps.map((s, i) => (
          <div
            key={s.id}
            ref={(n) => {
              labelRefs.current[s.id] = n;
            }}
            data-hide={step && (step.group !== s.group || (step.group === "controller" && (step.id === "trigger") !== (s.id === "trigger"))) ? "" : undefined}
            className="callout pointer-events-none absolute left-0 top-0"
            style={{ animationDelay: `${s.group === "headset" ? 0.9 + i * 0.1 : 2.6 + i * 0.1}s` }}
          >
            <button type="button" onClick={() => goFree(s.id)} className={`hs-dot pointer-events-auto ${active === s.id ? "is-active" : ""}`} aria-label={s.title[lang]}>
              {i + 1}
            </button>
            <span className={`hs-name ${active === s.id ? "is-active" : ""}`} dir={rtl ? "rtl" : "ltr"}>
              {s.title[lang]}
            </span>
          </div>
        ))}

      {/* leader line from the part in focus to the info card (computers) */}
      {explore && (
        <svg className="pointer-events-none absolute inset-0 z-[5] hidden h-full w-full md:block" aria-hidden>
          <path key={active ?? "none"} ref={lineRef} className="hs-line" d="M0,0" />
          <circle ref={dotRef} r="3.5" className="fill-sun transition-opacity duration-300" style={{ opacity: 0 }} />
        </svg>
      )}

      {/* explore UI */}
      {explore && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-10 md:top-24">
            <div className="wrap flex items-start justify-between gap-4">
              <div dir={rtl ? "rtl" : "ltr"}>
                <div className="kicker !text-sun">{explorer.kicker[lang]}</div>
                <div className="mt-1 hidden text-sm text-white/55 md:block">{t(explorer.help)}</div>
              </div>
              <button type="button" onClick={exit} className="pointer-events-auto btn btn-line btn-sm">
                ✕ {t(explorer.close)}
              </button>
            </div>
          </div>

          {/* start card: guided tour or explore alone */}
          {!step && (
            <div className="absolute inset-x-0 bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+5rem))] z-10 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
              <div className="wrap">
                <div dir={rtl ? "rtl" : "ltr"} className="vr-card mx-auto w-full max-w-md md:me-0 md:ms-auto md:max-w-[380px]">
                  <div className="text-xs font-semibold text-sun">Meta Quest 3</div>
                  <h3 className="font-display mt-1.5 text-2xl font-bold leading-tight md:text-3xl">{explorer.intro.title[lang]}</h3>
                  <p className="mt-2 hidden text-base leading-relaxed text-white/80 md:block">{explorer.intro.text[lang]}</p>
                  <div className="hidden md:block">
                    <Specs text={t(explorer.introSpec)} />
                  </div>
                  <button type="button" onClick={startTour} className="btn btn-sun mt-4 w-full justify-center text-base md:mt-6">
                    ▶ {t(explorer.tour)}
                  </button>
                  <button type="button" onClick={() => goFree(steps[0].id)} className="mt-2 w-full rounded-full border border-white/20 py-2.5 text-sm md:py-3 font-semibold text-white/85 transition hover:border-white/50 hover:text-white">
                    {t(explorer.free ?? explorer.or)}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* the part in focus */}
          {step && (
            <div className="absolute inset-x-0 bottom-[max(5.25rem,calc(env(safe-area-inset-bottom)+4.75rem))] z-10 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
              <div className="wrap">
                <div
                  ref={cardRef}
                  key={active}
                  dir={rtl ? "rtl" : "ltr"}
                  className="vr-card mx-auto w-full max-w-md touch-pan-y md:me-0 md:ms-auto md:max-w-[380px]"
                  onMouseMove={() => {
                    // the pointer is often already there when the card appears: only a real move means «reading»
                    if (!paused && Date.now() - shownAt.current > 700) setPaused(true);
                  }}
                  onMouseLeave={() => setPaused(false)}
                  onPointerDown={(e) => ((e.currentTarget as HTMLElement).dataset.x = String(e.clientX))}
                  onPointerUp={(e) => {
                    const x0 = Number((e.currentTarget as HTMLElement).dataset.x ?? e.clientX);
                    const dx = e.clientX - x0;
                    if (Math.abs(dx) < 50) return;
                    // swipe between parts (phone): towards the reading direction = next
                    goFree();
                    move((dx < 0) !== rtl ? 1 : -1);
                  }}
                  aria-live="polite"
                >
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold">
                    <span className="text-sun">{explorer.groups[step.group][lang]}</span>
                    <span className="tabular-nums text-white/50" dir="ltr">
                      {idx + 1} / {steps.length}
                    </span>
                  </div>
                  <h3 className="font-display mt-1.5 text-2xl font-bold leading-tight md:text-[2rem]">{step.title[lang]}</h3>
                  <p className="mt-2.5 text-[0.95rem] leading-relaxed text-white/80 md:text-[1.05rem]">{step.text[lang]}</p>
                  {step.spec && <Specs text={t(step.spec)} />}
                  <div className="mt-5 flex items-center gap-2">
                    <button type="button" onClick={() => { goFree(); move(-1); }} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 transition hover:border-white/60" aria-label={explorer.prev[lang]}>
                      <span className="rtl:rotate-180">←</span>
                    </button>
                    <button type="button" onClick={() => { goFree(); move(1); }} className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink transition hover:bg-sun" aria-label={explorer.next[lang]}>
                      <span className="rtl:rotate-180">→</span>
                    </button>
                    {tour ? (
                      <button type="button" onClick={() => goFree()} className="ms-auto text-sm font-semibold text-white/60 hover:text-white">
                        ❚❚ {t(explorer.stop)}
                      </button>
                    ) : (
                      <button type="button" onClick={startTour} className="ms-auto text-sm font-semibold text-white/60 hover:text-white">
                        ▶ {t(explorer.tour)}
                      </button>
                    )}
                  </div>
                  {tour && <span className="tour-bar" style={{ animationDuration: `${TOUR_MS}ms`, animationPlayState: paused ? "paused" : "running" }} />}
                </div>
              </div>
            </div>
          )}

          {/* chapters: every part, grouped, always one tap away */}
          <nav className="absolute inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-10" aria-label={explorer.kicker[lang]}>
            <div className="wrap">
              <div ref={chapters} dir={rtl ? "rtl" : "ltr"} className="vr-chapters no-scrollbar">
                {(["headset", "controller"] as const).map((g) => (
                  <div key={g} className="flex shrink-0 items-center gap-1">
                    <span className="hidden px-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white/40 lg:inline rtl:tracking-normal">{explorer.groups[g][lang]}</span>
                    {steps.map((s, i) =>
                      s.group !== g ? null : (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => goFree(s.id)}
                          aria-current={active === s.id ? "step" : undefined}
                          className={`vr-chip ${active === s.id ? "is-active" : ""}`}
                        >
                          <span className="vr-chip-num">{i + 1}</span>
                          {s.title[lang]}
                        </button>
                      ),
                    )}
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

/** Specifications as separate chips («4 MP colour cameras», «110° field of view», …). */
function Specs({ text }: { text?: string }) {
  if (!text) return null;
  const parts = text.split("·").map((x) => x.trim()).filter(Boolean);
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {parts.map((p) => (
        <li key={p} className="rounded-full bg-white/[0.09] px-3 py-1.5 text-[0.78rem] font-semibold text-white ring-1 ring-white/10 md:text-[0.82rem]">
          {p}
        </li>
      ))}
    </ul>
  );
}
