"use client";

import React from "react";
import { useLenis } from "lenis/react";
import { ArrowUp } from "@phosphor-icons/react";

export function Footer() {
  const lenis = useLenis();

  const scrollToTop = () => {
    // Lenis owns the scroll position; window.scrollTo would fight it.
    if (lenis) lenis.scrollTo(0, { duration: 1.5 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-line py-12">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <p className="text-[13px] text-fg-3">
          © {new Date().getFullYear()} Syafik Barda. Semarang, Indonesia.
        </p>

        <button
          onClick={scrollToTop}
          className="group flex min-h-11 cursor-pointer items-center gap-3 self-start text-[13px] text-fg-2 transition-colors hover:text-fg sm:self-auto"
        >
          Back to top
          <span className="pill flex h-11 w-11 items-center justify-center border border-line transition-colors group-hover:border-accent">
            <ArrowUp
              size={14}
              weight="light"
              className="transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </span>
        </button>
      </div>
    </footer>
  );
}
