"use client";
import { useEffect } from "react";

export default function ScrollReset() {
  useEffect(() => {
    if (window.location.hash) {
      window.scrollTo(0, 0);
      history.replaceState(null, "", window.location.pathname);
    }
  }, []);
  return null;
}
