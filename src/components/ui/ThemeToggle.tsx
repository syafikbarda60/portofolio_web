"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";

type Mode = "light" | "dark";

function systemMode(): Mode {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    const saved = document.documentElement.dataset.theme as Mode | undefined;
    setMode(saved ?? systemMode());
  }, []);

  const toggle = () => {
    const next: Mode = mode === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked (private mode). The theme still applies for this visit.
    }
    setMode(next);
  };

  return (
    <button
      onClick={toggle}
      // Label stays stable until the mode is known, so SSR and hydration agree.
      aria-label={mode === "light" ? "Switch to dark theme" : "Switch to light theme"}
      className={`pill flex h-11 w-11 cursor-pointer items-center justify-center border border-line text-fg-2 transition-colors duration-300 hover:border-line-strong hover:text-fg ${className}`}
    >
      {mode === "light" ? (
        <Moon size={16} weight="light" />
      ) : (
        <Sun size={16} weight="light" />
      )}
    </button>
  );
}
