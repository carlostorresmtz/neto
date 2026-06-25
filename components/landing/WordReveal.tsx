"use client";

import { useEffect, useRef, useState } from "react";

export default function WordReveal({
  text,
  style,
}: {
  text: string;
  style?: React.CSSProperties;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) { setVisible(true); return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!visible) {
    return <p ref={ref} style={{ ...style, visibility: "hidden" }}>{text}</p>;
  }

  return (
    <p ref={ref} style={style}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            opacity: 0,
            transform: "translateY(8px)",
            animation: `wordReveal 0.4s ease ${i * 50}ms both`,
            marginRight: "0.3em",
          }}
        >
          {word}
        </span>
      ))}
    </p>
  );
}
