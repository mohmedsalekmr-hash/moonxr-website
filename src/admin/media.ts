"use client";
import { sb } from "./sb";

/** Max size sent to the site: big enough for a 4K screen, small enough to load fast. */
const MAX_SIDE = 2560;
/** Videos are short highlights only: one key moment, 3–5 seconds. */
export const MAX_VIDEO_MB = 3;
export const MAX_VIDEO_SECONDS = 6;

const slug = (s: string) =>
  s.toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "media";

function toBlob(c: HTMLCanvasElement, q: number) {
  return new Promise<Blob>((ok, ko) => c.toBlob((b) => (b ? ok(b) : ko(new Error("encode"))), "image/webp", q));
}

/** Photos are resized (never upscaled) and converted to WebP in the browser before upload. */
export async function compressImage(file: File, q = 0.86) {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * s);
  const h = Math.round(bmp.height * s);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  c.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  return { blob: await toBlob(c, q), w, h };
}

async function imageSize(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const im = new Image();
    im.src = url;
    await im.decode();
    return { w: im.naturalWidth || 1, h: im.naturalHeight || 1 };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Reads the video size and grabs a frame as its poster image. */
async function videoInfo(file: File) {
  const url = URL.createObjectURL(file);
  try {
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.src = url;
    await new Promise((ok, ko) => {
      v.onloadeddata = ok;
      v.onerror = () => ko(new Error("video"));
    });
    v.currentTime = Math.min(0.5, (v.duration || 1) / 2);
    await new Promise((ok) => (v.onseeked = ok));
    const w = v.videoWidth;
    const h = v.videoHeight;
    const s = Math.min(1, 1600 / Math.max(w, h));
    const c = document.createElement("canvas");
    c.width = Math.round(w * s);
    c.height = Math.round(h * s);
    c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
    return { w, h, duration: v.duration, poster: await toBlob(c, 0.82) };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function put(blob: Blob, path: string, type: string) {
  const { error } = await sb.storage.from("media").upload(path, blob, { contentType: type, cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);
  return sb.storage.from("media").getPublicUrl(path).data.publicUrl;
}

export type Uploaded = { type: "image" | "video"; src: string; w: number; h: number; poster?: string };

export async function uploadMedia(file: File, folder: string, opts: { keepPng?: boolean } = {}): Promise<Uploaded> {
  const base = `${folder}/${Date.now().toString(36)}-${slug(file.name)}`;
  if (file.type.startsWith("video/")) {
    if (file.type !== "video/mp4") throw new Error("الفيديو يجب أن يكون بصيغة MP4");
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) throw new Error(`حجم الفيديو أكبر من ${MAX_VIDEO_MB} ميغابايت. قصّه إلى لقطة من 3 إلى 5 ثوانٍ.`);
    const info = await videoInfo(file);
    if (info.duration > MAX_VIDEO_SECONDS + 0.5)
      throw new Error(`الفيديو ${Math.round(info.duration)} ثانية. المسموح لقطة قصيرة حتى ${MAX_VIDEO_SECONDS} ثوانٍ فقط (اللحظة المهمة).`);
    const [src, poster] = await Promise.all([put(file, `${base}.mp4`, "video/mp4"), put(info.poster, `${base}-poster.webp`, "image/webp")]);
    return { type: "video", src, poster, w: info.w, h: info.h };
  }
  if (file.type === "image/svg+xml") {
    const { w, h } = await imageSize(file);
    return { type: "image", src: await put(file, `${base}.svg`, "image/svg+xml"), w, h };
  }
  if (!file.type.startsWith("image/")) throw new Error("نوع الملف غير مدعوم");
  const { blob, w, h } = await compressImage(file, opts.keepPng ? 0.95 : 0.86);
  return { type: "image", src: await put(blob, `${base}.webp`, "image/webp"), w, h };
}
