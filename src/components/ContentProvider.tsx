"use client";
import { createContext, useContext } from "react";
import { ui as defaultUi, CONTACT } from "@/data/i18n";
import type { Shared } from "@/lib/content";

const Ctx = createContext<Shared>({ ui: defaultUi, contact: CONTACT });

export function ContentProvider({ value, children }: { value: Shared; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** ui texts and contact details, as edited in /admin */
export const useShared = () => useContext(Ctx);
