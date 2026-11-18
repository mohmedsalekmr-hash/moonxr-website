import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";

/**
 * Meta Quest 3 3D model — "Meta Quest 3" by Roberto Domínguez (Sketchfab), CC BY 4.0.
 * Credited in the site footer. Coordinates below are in the model's own space (metres).
 */
export const QUEST_URL = "/media/3d/quest3.glb";

export const PART = {
  headset: "Object_7",
  pills: "Object_9",
  controllerLeft: "Object_5", // X / Y / menu / joystick side
  controllerRight: "Object_11", // A / B / trigger side
};

/** Points of interest on the model, used for the interactive tour. */
export const HOTSPOTS: Record<string, { point: [number, number, number]; view: [number, number, number] }> = {
  // view = [azimuth, elevation, distance] of the camera around the point
  cameras: { point: [0, -0.06, 0.125], view: [0.35, 0.12, 0.5] },
  lenses: { point: [0.032, 0, 0.065], view: [Math.PI - 0.5, -0.3, 0.56] },
  strap: { point: [0, 0.081, 0], view: [-2.3, 0.55, 0.6] },
  joystick: { point: [0.121, -0.1532, 0.1891], view: [0.5, 0.75, 0.4] },
  buttons: { point: [0.1017, -0.1483, 0.1804], view: [0.25, 0.8, 0.38] },
  trigger: { point: [-0.0916, -0.1425, 0.1494], view: [-0.45, 0.3, 0.4] },
};

let cache: Promise<THREE.Group> | null = null;

/** Loads the model once, prints the Moon XR logo on the visor, returns a fresh clone each call. */
export async function loadQuest(): Promise<THREE.Group> {
  if (!cache) {
    cache = (async () => {
      const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(QUEST_URL);
      const root = new THREE.Group();
      root.add(gltf.scene);
      root.updateMatrixWorld(true);
      let front: THREE.Mesh | undefined;
      gltf.scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh && m.name === PART.headset) front = m;
      });
      if (front) {
        try {
          // the official Moon logo, with "XR" in place of "TECHNOLOGY"
          const tex = await new THREE.TextureLoader().loadAsync("/media/logos/moonxr-visor.png");
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 8;
          const decal = new THREE.Mesh(
            new DecalGeometry(front, new THREE.Vector3(0, -0.021, 0.125), new THREE.Euler(0, 0, 0), new THREE.Vector3(0.07, 0.0124, 0.04)),
            // toneMapped off keeps the exact brand navy and yellow
            new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -4 })
          );
          decal.name = "moonxr-logo";
          root.add(decal);
        } catch {
          /* the logo is optional */
        }
      }
      return root;
    })();
  }
  const base = await cache;
  return base.clone(true);
}
