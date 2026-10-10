"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { usePathname } from "next/navigation";
import { List, X, ArrowUpRight } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { name: "Work", href: "#projects" },
  { name: "Capabilities", href: "#focus" },
  { name: "Experience", href: "#experience" },
  { name: "Skills", href: "#skills" },
];

export function Navbar() {
  const pathname = usePathname();
  // Off the home page the section anchors have nothing to point at, so they
  // have to route home first.
  const onHome = pathname === "/";
  const to = (hash: string) => (onHome ? hash : `/${hash}`);

  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // Lenis moves the native scroll position, so this covers both the smooth
  // and the reduced-motion paths.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  useEffect(() => {
    if (!onHome) return;
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => Boolean(el)
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.3, 0.6, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "border-b border-line bg-bg/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      {/* Keeps nav items legible over the hero photograph before scroll. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg to-transparent transition-opacity duration-500 ${
          scrolled ? "opacity-0" : "opacity-90"
        }`}
      />
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-10"
      >
        <a
          href={to("#main")}
          className="type-title flex min-h-11 items-center pr-2 text-lg text-fg transition-colors hover:text-accent-text"
        >
          Syafik Barda
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <a
                key={link.name}
                href={to(link.href)}
                aria-current={isActive ? "true" : undefined}
                className={`relative inline-flex min-h-11 cursor-pointer items-center px-3.5 text-[13px] font-medium transition-colors duration-300 ${
                  isActive ? "text-fg" : "text-fg-2 hover:text-fg"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3.5 -bottom-0.5 h-px bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <a
            href={to("#contact")}
            className="pill group hidden min-h-11 cursor-pointer items-center gap-2 bg-fg px-5 text-[13px] font-medium text-bg transition-colors duration-300 hover:bg-accent hover:text-accent-ink sm:inline-flex"
          >
            Get in touch
            <ArrowUpRight
              size={14}
              weight="bold"
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            className="pill flex h-11 w-11 cursor-pointer items-center justify-center border border-line text-fg-2 transition-colors hover:text-fg md:hidden"
          >
            {menuOpen ? <X size={18} /> : <List size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-line bg-bg px-4 pb-8 pt-2 sm:px-6 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={to(link.href)}
                onClick={() => setMenuOpen(false)}
                className="type-title block cursor-pointer border-b border-line py-4 text-3xl text-fg-2 transition-colors hover:text-fg"
              >
                {link.name}
              </a>
            ))}
            <a
              href={to("#contact")}
              onClick={() => setMenuOpen(false)}
              className="pill mt-8 flex w-full cursor-pointer items-center justify-center gap-2 bg-fg py-4 text-sm font-medium text-bg"
            >
              Get in touch
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
