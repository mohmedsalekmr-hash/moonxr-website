"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// the editor (and the database client) is only downloaded when an admin turns edit mode on
const Editor = dynamic(() => import("./Editor"), { ssr: false });

const FLAG = "mx-edit";

/**
 * "Edit" button shown on the public site to a signed-in admin.
 * Visitors never see it: it only appears when this browser holds an admin session.
 */
export default function EditMode() {
  const [can, setCan] = useState(false);
  const [on, setOn] = useState(false);
  useEffect(() => {
    try {
      const signedIn = Object.keys(localStorage).some((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
      setCan(signedIn);
      setOn(signedIn && sessionStorage.getItem(FLAG) === "1");
    } catch {}
  }, []);
  if (!can) return null;
  const set = (v: boolean) => {
    setOn(v);
    try {
      if (v) sessionStorage.setItem(FLAG, "1");
      else sessionStorage.removeItem(FLAG);
    } catch {}
  };
  return on ? (
    <Editor onClose={() => set(false)} />
  ) : (
    <button
      type="button"
      onClick={() => set(true)}
      className="fixed bottom-5 start-5 z-[80] inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(10,20,49,.6)] transition hover:bg-brand"
    >
      <span aria-hidden>✎</span>
      <span>{document.documentElement.lang === "ar" ? "تعديل الصفحة" : document.documentElement.lang === "en" ? "Edit page" : "Modifier la page"}</span>
    </button>
  );
}
