// Opens every page of the site (from the sitemap, so new projects are included) on a computer screen
// and a phone screen, and fails if anything is wrong:
//   - the page does not answer 200
//   - a JavaScript error happens
//   - a file (image, script, video…) fails to load
//   - an image is broken
//   - the page is wider than the screen (sideways scroll)
// Also checks that the admin login page opens.
//
// Usage: start the site first (npm run build && npm start), then: npm run check:pages
// The address can be changed: BASE=https://moonxr-site.vercel.app npm run check:pages
import { chromium } from "playwright";

const BASE = process.env.BASE || "http://localhost:3000";
const SCREENS = [
  { name: "computer", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844, isMobile: true, hasTouch: true },
];

const sitemap = await fetch(`${BASE}/sitemap.xml`).then((r) => {
  if (!r.ok) throw new Error(`sitemap.xml answered ${r.status}`);
  return r.text();
});
const paths = [...new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))];
if (paths.length < 10) throw new Error(`only ${paths.length} pages in the sitemap`);
paths.push("/admin");

// WebGL (the 3D headset) runs on the processor in headless browsers
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const problems = [];

for (const screen of SCREENS) {
  const ctx = await browser.newContext({ viewport: { width: screen.width, height: screen.height }, isMobile: screen.isMobile, hasTouch: screen.hasTouch });
  // the intro animation plays once per visit; skip it
  await ctx.addInitScript(() => sessionStorage.setItem("mx-intro", "1"));
  for (const path of paths) {
    const page = await ctx.newPage();
    const issues = [];
    page.on("pageerror", (e) => issues.push(`JavaScript error: ${String(e).slice(0, 160)}`));
    page.on("response", (r) => {
      const u = new URL(r.url());
      // only our own files; the database and other sites are checked elsewhere
      if (r.status() >= 400 && u.origin === new URL(BASE).origin) issues.push(`${r.status()} ${u.pathname}`);
    });
    const res = await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 }).catch((e) => issues.push(`did not load: ${e.message.slice(0, 120)}`));
    if (res && res.status() !== 200) issues.push(`answered ${res.status()}`);
    // scroll down so that every lazy image and animation has a chance to load
    const height = await page.evaluate(() => document.body.scrollHeight).catch(() => 0);
    for (let y = 0; y < height; y += 700) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(50);
    }
    await page.waitForTimeout(400);
    const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src.slice(-60)));
    if (broken.length) issues.push(`broken images: ${broken.join(", ")}`);
    const wide = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (wide) issues.push("wider than the screen");
    if (issues.length) problems.push({ screen: screen.name, path, issues });
    console.log(`${issues.length ? "✗" : "✓"} ${screen.name.padEnd(8)} ${path}${issues.length ? "  → " + issues.join(" | ") : ""}`);
    await page.close();
  }
  await ctx.close();
}
await browser.close();

console.log(`\n${paths.length} pages × ${SCREENS.length} screens: ${problems.length ? problems.length + " with problems" : "no problems"}`);
process.exit(problems.length ? 1 : 0);
