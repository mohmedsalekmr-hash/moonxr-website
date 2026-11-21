# Moon XR — website

Showcase site of Moon Technology's XR division (Nouakchott), in French, Arabic and English, with an admin to edit all content.

> **Not a developer?** Read [`docs/دليل-الطوارئ.md`](docs/دليل-الطوارئ.md) — what to do if something goes wrong.

## Stack

| Part | Tool |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Content, auth, uploads | Supabase (Postgres + RLS, Auth, Storage) |
| Hosting | Vercel (project `moonxr-site`) |
| 3D headset | three.js |

## Where things are

- `src/app/[lang]/…` — public pages; `fr` is the default, `ar` is right-to-left, `/en/…` pages have English addresses.
- `src/data/` — **default content**. Everything editable in /admin is merged over these defaults (`src/lib/content.ts`): if the database is down or slow (> 4 s), the site keeps working with them.
- `src/admin/` — the admin (`/admin`), a client app talking to Supabase with the signed-in admin's session. Access is enforced by row-level security (only users listed in `admins` can write).
- `src/components/EditMode.tsx` + `Editor.tsx` — edit-in-place on the public site for a signed-in admin.
- `src/app/api/revalidate` — refreshes the cached pages after a save (secret header). `src/app/api/keepalive` — daily ping so the free Supabase project never pauses.

## Commands

```bash
npm ci
npm run dev          # local site on http://localhost:3000
npm run check        # types + lint + production build
npm start            # serve the build
npm run check:pages  # every page (from the sitemap) on a computer and a phone: errors, broken files, overflow
```

`.env.local` needs `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (and `REVALIDATE_SECRET` for the refresh route). Without them the site runs on the default content.

## Automation (GitHub Actions)

- `check.yml` — on every push to `main`: `npm run check` then `npm run check:pages`. Red = do not deploy.
- `uptime.yml` — every hour: the live pages and the database answer; a failure e-mails the owner.
- `backup.yml` — every night: encrypted database dump + mirror of uploaded media on the `backups` branch (30 nights kept). Restore steps in that branch's README.

## Deploying

`main` is the code in production. Deploy only a commit whose `Check` is green:

```bash
vercel deploy --prod
```

Rollback: Vercel → Deployments → previous deployment → Promote to Production (content is in the database, not in the deployment, so nothing is lost).
