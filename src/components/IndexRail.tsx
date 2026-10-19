"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { DownloadSimple } from "@phosphor-icons/react";

export const SECTIONS = [
  { name: "Work", href: "#projects" },
  { name: "About", href: "#about" },
  { name: "Capabilities", href: "#focus" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

/** How far into the hero the nav hands over from the top bar to the rail. */
export const DOCK_AT = 0.6;

/**
 * True while a full-bleed block (the work carousel) covers the band where
 * the rail's links sit, about 120-360px from the top. The rail steps aside
 * then and the top bar's links come back, so labels never sit on images.
 */
export function fullBleedCoversRail() {
  let covered = false;
  document.querySelectorAll("[data-fullbleed]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < 360 && r.bottom > 120) covered = true;
  });
  return covered;
}

/**
 * The page's chapter index, docked to the left edge once the hero is behind
 * the reader. The accent bar follows the chapter in view; the hairline
 * beside the list fills with overall reading progress.
 */
export function IndexRail() {
  const [docked, setDocked] = useState(false);
  const [yielding, setYielding] = useState(false);
  const [active, setActive] = useState("");
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setDocked(y > window.innerHeight * DOCK_AT);
    setYielding(fullBleedCoversRail());
  });

  useEffect(() => {
    const els = SECTIONS.map((s) => document.querySelector(s.href)).filter(
      (el): el is Element => Boolean(el)
    );
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) setActive(`#${hit.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.3, 0.6, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <motion.aside
      aria-label="Page index"
      initial={false}
      animate={{ opacity: docked && !yielding ? 1 : 0, x: docked && !yielding ? 0 : -16 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed bottom-0 left-0 top-[72px] z-40 hidden w-52 flex-col justify-between px-8 pb-10 pt-12 lg:flex ${
        docked && !yielding ? "" : "pointer-events-none"
      }`}
    >
      <nav className="relative pl-5">
        {/* Reading progress for the whole page. */}
        <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line" />
        <motion.span
          aria-hidden
          className="absolute left-0 top-0 h-full w-px origin-top bg-fg-3"
          style={{ scaleY: scrollYProgress }}
        />
        <ul className="grid gap-1">
          {SECTIONS.map((s) => {
            const on = active === s.href;
            return (
              <li key={s.href} className="relative">
                {on && (
                  <motion.span
                    layoutId="rail-active"
                    aria-hidden
                    className="absolute -left-5 bottom-1.5 top-1.5 w-[2px] -translate-x-[0.5px] bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <a
                  href={s.href}
                  aria-current={on ? "true" : undefined}
                  tabIndex={docked ? 0 : -1}
                  className={`type-title block py-1.5 text-[1.05rem] transition-colors duration-300 ${
                    on ? "text-fg" : "text-fg-3 hover:text-fg"
                  }`}
                >
                  {s.name}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <a
        href="/Syafik_Barda_CV.pdf"
        download="Syafik_Barda_CV.pdf"
        tabIndex={docked ? 0 : -1}
        className="group inline-flex min-h-11 items-center gap-2 text-[13px] text-fg-2 transition-colors hover:text-accent-text"
      >
        <DownloadSimple size={15} weight="bold" className="transition-transform group-hover:translate-y-0.5" />
        Download CV
      </a>
    </motion.aside>
  );
}
