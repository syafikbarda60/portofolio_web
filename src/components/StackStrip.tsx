"use client";

import React from "react";
import LogoLoop, { type LogoItem } from "@/components/reactbits/LogoLoop";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * The stack, as brand marks rather than wordmarks. Icons come from Simple
 * Icons in white and are inverted in light mode via --logo-filter.
 *
 * This is the page's only marquee. Motion here is doing real work: it lets
 * a 15-mark strip live in one screen row without shrinking the marks.
 */
const STACK = [
  { slug: "nextdotjs", name: "Next.js" },
  { slug: "react", name: "React" },
  { slug: "typescript", name: "TypeScript" },
  { slug: "nodedotjs", name: "Node.js" },
  { slug: "laravel", name: "Laravel" },
  { slug: "php", name: "PHP" },
  { slug: "mysql", name: "MySQL" },
  { slug: "postgresql", name: "PostgreSQL" },
  { slug: "tailwindcss", name: "Tailwind CSS" },
  { slug: "socketdotio", name: "Socket.IO" },
  { slug: "python", name: "Python" },
  { slug: "tensorflow", name: "TensorFlow" },
  { slug: "arduino", name: "Arduino" },
  { slug: "expo", name: "React Native" },
  { slug: "git", name: "Git" },
];

const LOGOS: LogoItem[] = STACK.map(({ slug, name }) => ({
  node: (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${slug}/ffffff`}
      alt={name}
      width={34}
      height={34}
      loading="lazy"
      className="h-[34px] w-[34px] opacity-55 transition-opacity duration-300 hover:opacity-100"
      style={{ filter: "var(--logo-filter)" }}
    />
  ),
  title: name,
  ariaLabel: name,
}));

export function StackStrip() {
  const reduceMotion = useReducedMotion();

  return (
    <section aria-label="Technologies" className="relative border-y border-line py-9">
      {reduceMotion ? (
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-10 gap-y-6 px-4 sm:px-6 lg:px-10">
          {STACK.map(({ slug, name }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={slug}
              src={`https://cdn.simpleicons.org/${slug}/ffffff`}
              alt={name}
              width={30}
              height={30}
              loading="lazy"
              className="h-[30px] w-[30px] opacity-55"
              style={{ filter: "var(--logo-filter)" }}
            />
          ))}
        </div>
      ) : (
        <LogoLoop
          logos={LOGOS}
          speed={34}
          direction="left"
          logoHeight={34}
          gap={72}
          pauseOnHover
          fadeOut
          fadeOutColor="var(--bg)"
          ariaLabel="Technologies I work with"
        />
      )}
    </section>
  );
}
