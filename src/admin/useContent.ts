"use client";
import { useCallback, useEffect, useState } from "react";
import { sb } from "./sb";
import { saveAndPublish } from "./save";

/** Deep merge: database values win, keys that only exist in code are kept. */
export function merge<V>(base: V, over: unknown): V {
  if (over === null || over === undefined) return base;
  if (Array.isArray(base) || typeof base !== "object" || base === null) return over as V;
  if (typeof over !== "object" || Array.isArray(over)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over as Record<string, unknown>)) out[k] = merge(out[k], v);
  return out as V;
}

/** Edits one entry of the site_content table (ui texts, contact, steps…). */
export function useContentKey<V>(key: string, fallback: V, deep = false) {
  const [value, setValue] = useState<V | null>(null);
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    sb.from("site_content")
      .select("value")
      .eq("key", key)
      .maybeSingle()
      .then(({ data }) => {
        const v = deep ? merge(fallback, data?.value) : ((data?.value as V) ?? fallback);
        setValue(v);
        setSaved(JSON.stringify(v));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const save = useCallback(async () => {
    setSaving(true);
    setErr("");
    try {
      await saveAndPublish(() => sb.from("site_content").upsert({ key, value }));
      setSaved(JSON.stringify(value));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطأ");
    }
    setSaving(false);
  }, [key, value]);

  return {
    value,
    setValue,
    save,
    saving,
    err,
    dirty: value !== null && JSON.stringify(value) !== saved,
    reset: () => setValue(JSON.parse(saved)),
  };
}
