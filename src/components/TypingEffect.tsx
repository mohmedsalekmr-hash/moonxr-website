"use client";

import { useState, useEffect, useRef } from "react";

export function TypingEffect({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [prevText, setPrevText] = useState(text);

  // Reset state during render when text changes to avoid synchronous setState in effect
  if (text !== prevText) {
    setPrevText(text);
    setDisplayed("");
    setDone(false);
  }

  useEffect(() => {
    let index = 0;

    const tick = () => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index < text.length) {
        rafRef.current = setTimeout(tick, 38);
      } else {
        setDone(true);
      }
    };

    rafRef.current = setTimeout(tick, 38);
    return () => {
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && (
        <span
          className="inline-block w-[2px] h-[1em] bg-moon-blue-light align-middle ml-1 animate-pulse"
          aria-hidden="true"
        />
      )}
    </span>
  );
}
