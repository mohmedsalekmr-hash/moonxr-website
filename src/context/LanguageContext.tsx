"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

type Language = "en" | "fr";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (enText: string, frText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Restore saved language preference on first mount only
  useEffect(() => {
    try {
      const saved = localStorage.getItem("xr-lang") as Language | null;
      // Defer state update to avoid synchronous setState during mount
      setTimeout(() => {
        if (saved === "en" || saved === "fr") {
          setLanguageState(saved);
        } else if (navigator.language.startsWith("fr")) {
          setLanguageState("fr");
        }
      }, 0);
    } catch {
      // localStorage may not be available (e.g., private mode edge cases)
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("xr-lang", lang);
    } catch {
      // ignore storage errors
    }
  }, []);

  // Memoize `t` so consuming components only re-render when language actually changes
  const t = useCallback(
    (enText: string, frText: string): string => {
      return language === "fr" ? frText : enText;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
