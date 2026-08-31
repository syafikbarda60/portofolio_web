"use client";

import React, { useEffect, useState } from "react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Click feedback, in the current accent colour.
 *
 * ClickSpark paints to a canvas, and canvas cannot resolve a CSS custom
 * property, so the token is read off the document and passed as a literal.
 */
export function Sparks({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [accent, setAccent] = useState("#ff4d2e");

  useEffect(() => {
    const read = () =>
      setAccent(
        getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() ||
          "#ff4d2e"
      );
    read();
    // The theme toggle rewrites data-theme, which swaps the token.
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  if (reduceMotion) return <>{children}</>;

  return (
    <ClickSpark
      sparkColor={accent}
      sparkSize={8}
      sparkRadius={14}
      sparkCount={6}
      duration={400}
      easing="ease-out"
    >
      {children}
    </ClickSpark>
  );
}
