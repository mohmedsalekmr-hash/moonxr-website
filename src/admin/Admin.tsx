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
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error)
        setMsg({
          ok: false,
          text:
            error.code === "email_not_confirmed"
              ? tr("الحساب لم يُفعَّل بعد")
              : tr("البريد أو كلمة المرور غير صحيحة"),
        });
    } else {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/admin` },
      });
      if (error) setMsg({ ok: false, text: error.message });
      else if (!data.session)
        setMsg({
          ok: true,
          text: tr("تم إنشاء الحساب. أخبرنا ليتم تفعيله ومنحه صلاحية المدير، ثم سجّل الدخول."),
        });
    }
    setBusy(false);
  };

  return (
    <Center>
      <form onSubmit={submit} className="card w-full max-w-sm p-8">
        {}
        <img
          src="/media/logos/moonxr-l.svg?v=2"
          alt="Moon XR"
          className="h-10 w-auto"
        />
        <h1 className="mt-6 text-xl font-bold text-ink">
          {mode === "in" ? tr("تسجيل الدخول") : tr("إنشاء حساب المدير")}
        </h1>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">{tr("البريد الإلكتروني")}</span>
            <input
              dir="ltr"
              type="email"
              required
              className="inp"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">{tr("كلمة المرور")}</span>
            <div className="relative">
              <input
                dir="ltr"
                type={show ? "text" : "password"}
                required
                minLength={8}
                className="inp pe-16"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "in" ? "current-password" : "new-password"
                }
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute end-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-black/50 hover:text-black"
              >
                {show ? tr("إخفاء") : tr("إظهار")}
              </button>
            </div>
          </label>
        </div>
        {msg && (
          <p
            className={`mt-4 text-sm leading-6 ${msg.ok ? "text-emerald-700" : "text-red-700"}`}
          >
            {msg.text}
          </p>
        )}
        <button
          className="btn btn-dark mt-6 w-full justify-center py-2.5"
          disabled={busy}
        >
          {busy ? "…" : mode === "in" ? tr("دخول") : tr("إنشاء الحساب")}
        </button>
        <button
          type="button"
          className="mt-4 w-full text-center text-sm text-black/50 hover:text-black"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
        >
          {mode === "in" ? tr("أول مرة؟ أنشئ حسابك") : tr("لديك حساب؟ سجّل الدخول")}
        </button>
      </form>
    </Center>
  );
}
