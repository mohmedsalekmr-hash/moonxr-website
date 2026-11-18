"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { sb } from "./sb";
import ProjectsTab from "./Projects";
import HomeTab from "./Home";
import TextsTab from "./Texts";
import OrgsTab from "./Orgs";
import ContactTab from "./Contact";

const TABS = [
  { id: "projects", label: "المشاريع" },
  { id: "home", label: "الصفحة الرئيسية" },
  { id: "texts", label: "نصوص الموقع" },
  { id: "orgs", label: "العملاء والشركاء" },
  { id: "contact", label: "التواصل" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export default function Admin() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("projects");

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
          <h1 className="text-lg font-bold">الحساب جاهز</h1>
          <p className="mt-3 text-sm leading-7 text-black/60">
            تم إنشاء حسابك <b dir="ltr">{session.user.email}</b>، لكنه لا يملك
            صلاحية المدير بعد. اطلب منحه الصلاحية، ثم حدّث هذه الصفحة.
          </p>
          <button
            className="btn btn-light mt-6"
            onClick={() => sb.auth.signOut()}
          >
            تسجيل الخروج
          </button>
        </div>
      </Center>
    );

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-black/[0.07] bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
          {}
          <img
            src="/media/logos/moonxr-l.svg"
            alt="Moon XR"
            className="h-6 w-auto"
          />
          <span className="rounded-full bg-black/[0.05] px-2.5 py-0.5 text-xs font-semibold text-black/55">
            لوحة التحكم
          </span>
          <div className="ms-auto flex items-center gap-2">
            <a href="/ar" target="_blank" className="btn btn-light">
              عرض الموقع ↗
            </a>
            <button
              className="btn text-black/55 hover:text-black"
              onClick={async () => {
                const p = prompt("كلمة المرور الجديدة (8 أحرف على الأقل):");
                if (!p) return;
                if (p.length < 8) return alert("كلمة المرور قصيرة جداً");
                const { error } = await sb.auth.updateUser({ password: p });
                alert(error ? error.message : "تم تغيير كلمة المرور");
              }}
            >
              كلمة المرور
            </button>
            <button
              className="btn text-black/55 hover:text-black"
              onClick={() => sb.auth.signOut()}
            >
              خروج
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition ${tab === t.id ? "border-navy text-navy" : "border-transparent text-black/45 hover:text-black"}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">
        {tab === "projects" && <ProjectsTab />}
        {tab === "home" && <HomeTab />}
        {tab === "texts" && <TextsTab />}
        {tab === "orgs" && <OrgsTab />}
        {tab === "contact" && <ContactTab />}
      </main>
    </div>
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
              ? "الحساب لم يُفعَّل بعد"
              : "البريد أو كلمة المرور غير صحيحة",
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
          text: "تم إنشاء الحساب. أخبرنا ليتم تفعيله ومنحه صلاحية المدير، ثم سجّل الدخول.",
        });
    }
    setBusy(false);
  };

  return (
    <Center>
      <form onSubmit={submit} className="card w-full max-w-sm p-8">
        {}
        <img
          src="/media/logos/moonxr-l.svg"
          alt="Moon XR"
          className="h-7 w-auto"
        />
        <h1 className="mt-6 text-xl font-bold text-ink">
          {mode === "in" ? "تسجيل الدخول" : "إنشاء حساب المدير"}
        </h1>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">
              البريد الإلكتروني
            </span>
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
            <span className="mb-1.5 block text-sm font-semibold text-ink">
              كلمة المرور
            </span>
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
                {show ? "إخفاء" : "إظهار"}
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
          {busy ? "…" : mode === "in" ? "دخول" : "إنشاء الحساب"}
        </button>
        <button
          type="button"
          className="mt-4 w-full text-center text-sm text-black/50 hover:text-black"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
        >
          {mode === "in" ? "أول مرة؟ أنشئ حسابك" : "لديك حساب؟ سجّل الدخول"}
        </button>
      </form>
    </Center>
  );
}
