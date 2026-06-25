"use client";

import { useEffect, useState } from "react";

export default function TypingBadge({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(text);
      setShowCursor(false);
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 2000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      {showCursor && <span className="tw-cursor">|</span>}
    </span>
  );
}
