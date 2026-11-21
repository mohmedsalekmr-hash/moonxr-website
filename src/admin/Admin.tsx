"use client";

import { tr } from "./i18n";
import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { sb } from "./sb";
import ProjectsTab from "./Projects";
import PagesTab from "./Pages";
import HomeTab from "./Home";
import TextsTab from "./Texts";
import OrgsTab from "./Orgs";
import ContactTab from "./Contact";
import HistoryTab from "./History";
import RequestsTab from "./Requests";
import BrandTab from "./Brand";

import SeoTab from "./Seo";
import Overview from "./Overview";
import { Shell, confirmLeave, NAV, type Tab } from "./Shell";

const TABS = NAV.flatMap((g) => g.items.map((i) => i.id));
/** The open tab is kept in the address (#projects) so a reload stays on it. */
const fromHash = (): Tab => {
  const h = typeof location !== "undefined" ? location.hash.slice(1) : "";
  return (TABS as string[]).includes(h) ? (h as Tab) : "overview";
};

export default function Admin() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>(fromHash);
  const [focus, setFocus] = useState<string | undefined>();
  const [visit, setVisit] = useState(0);
  const [newCount, setNewCount] = useState(0);

  // the badge on «الطلبات» is known from the start, not only once that tab is opened
  useEffect(() => {
    if (!session) return;
    sb.from("contact_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "new")
      .then(({ count }) => setNewCount(count ?? 0));
  }, [session, visit]);
  const go = (t: Tab, f?: string) => {
    if (!confirmLeave()) return;
    setTab(t);
    setFocus(f);
    setVisit((v) => v + 1); // reopen the tab fresh, even if it is the current one
    history.replaceState(null, "", `#${t}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    sb.from("admins")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [session]);

  if (session === undefined) return <Center>…</Center>;
  if (!session) return <Login />;
  if (isAdmin === null) return <Center>…</Center>;
  if (!isAdmin)
    return (
      <Center>
        <div className="card max-w-md p-8 text-center">
          <h1 className="text-lg font-bold">{tr("الحساب جاهز")}</h1>
          <p className="mt-3 text-sm leading-7 text-black/60">{tr("تم إنشاء حسابك")}{" "}<b dir="ltr">{session.user.email}</b>{tr("، لكنه لا يملك صلاحية المدير بعد. اطلب منحه الصلاحية، ثم حدّث هذه الصفحة.")}</p>
          <button
            className="btn btn-light mt-6"
            onClick={() => sb.auth.signOut()}
          >{tr("تسجيل الخروج")}</button>
        </div>
      </Center>
    );

  return (
    <Shell tab={tab} go={go} email={session.user.email ?? ""} newCount={newCount}>
      <div key={visit}>
        {tab === "overview" && <Overview go={go} email={session.user.email ?? ""} />}
        {tab === "projects" && <ProjectsTab focus={focus === "new" ? undefined : focus} isNew={focus === "new"} />}
        {tab === "pages" && <PagesTab />}
        {tab === "home" && <HomeTab />}
        {tab === "texts" && <TextsTab focus={focus} />}
        {tab === "orgs" && <OrgsTab />}
        {tab === "seo" && <SeoTab />}
        {tab === "contact" && <ContactTab />}
        {tab === "history" && <HistoryTab />}
        {tab === "brand" && <BrandTab />}
        {tab === "requests" && <RequestsTab onCount={setNewCount} />}
      </div>
    </Shell>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-black/50">
      {children}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setErr(error.code === "email_not_confirmed" ? tr("الحساب لم يُفعَّل بعد") : tr("البريد أو كلمة المرور غير صحيحة"));
    setBusy(false);
  };

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* the form */}
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <img src="/media/logos/moonxr-l.svg?v=2" alt="Moon XR" className="h-9 w-auto self-start" />
        <form onSubmit={submit} className="m-auto w-full max-w-sm py-12">
          <h1 className="text-2xl font-bold tracking-tight">{tr("تسجيل الدخول")}</h1>
          <p className="mt-2 text-black/55">{tr("لوحة تحكم موقع Moon XR")}</p>
          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="lbl">{tr("البريد الإلكتروني")}</span>
              <input dir="ltr" type="email" required autoFocus className="inp !min-h-11" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
            <label className="block">
              <span className="lbl">{tr("كلمة المرور")}</span>
              {/* the field is left-to-right, so the eye sits on its right, inside the space kept for it */}
              <div dir="ltr" className="relative">
                <input type={show ? "text" : "password"} required minLength={8} className="inp !min-h-11 pr-11" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-black/45 hover:bg-black/5 hover:text-black"
                  aria-label={show ? tr("إخفاء") : tr("إظهار")}
                  title={show ? tr("إخفاء") : tr("إظهار")}
                >
                  <svg viewBox="0 0 24 24" className="h-[1.1rem] w-[1.1rem]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                    {show && <path d="M4 4l16 16" />}
                  </svg>
                </button>
              </div>
            </label>
          </div>
          {err && (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 ring-1 ring-red-200">
              {err}
            </p>
          )}
          <button className="btn btn-primary mt-7 w-full !min-h-11 text-[0.95rem]" disabled={busy}>
            {busy ? tr("جارٍ الدخول…") : tr("دخول")}
          </button>
        </form>
        <p className="text-xs text-black/40">© {new Date().getFullYear()} Moon Technology</p>
      </div>

      {/* the brand side */}
      <div className="relative hidden overflow-hidden bg-[#0a1431] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_0%,#1d2f6b,transparent_70%)]" />
        <div className="absolute left-1/2 top-full aspect-square w-[115%]" style={{ animation: "mx-moon 2.4s cubic-bezier(.16,.8,.2,1) both" }}>
          <div className="absolute -inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(190,205,245,0.22),transparent)]" />
          <img src="/media/moon.webp" alt="" className="absolute inset-0 h-full w-full opacity-90 [filter:brightness(0.85)]" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(130%_100%_at_50%_0%,transparent_38%,rgba(10,20,49,0.45)_58%,#0a1431_78%)]" />
        </div>
        <div className="relative p-14 text-white">
          <div className="text-sm font-semibold text-sun">Moon XR</div>
          <p className="mt-4 max-w-md text-[2.1rem] font-bold leading-tight">{tr("كل محتوى موقعكم، في مكان واحد.")}</p>
          <p className="mt-4 max-w-sm text-white/60">{tr("المشاريع، الشعارات، النصوص والطلبات، بثلاث لغات.")}</p>
        </div>
      </div>
    </div>
  );
}
