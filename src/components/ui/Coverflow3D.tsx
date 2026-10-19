"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowLeft, ArrowRight, ArrowsOut, X } from "@phosphor-icons/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

export type CoverflowItem = { src: string; alt: string };

/**
 * Screenshots on a 3D coverflow. Built with CSS 3D rather than WebGL so the
 * browser rasterises each screenshot at full resolution: the front card is
 * pixel-sharp, which is the whole point of showing real UI.
 *
 * Drag / swipe, arrow keys, thumbnails, or a click on a side card moves it;
 * a click on the front card opens it full-screen. `pos` is a continuous
 * index, so the cards follow the finger and then settle on a spring.
 */
export function Coverflow3D({
  items,
  className,
  priority = false,
}: {
  items: CoverflowItem[];
  className?: string;
  priority?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const pos = useMotionValue(0);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; start: number; moved: boolean } | null>(null);
  const suppress = useRef(false);
  const last = items.length - 1;

  useMotionValueEvent(pos, "change", (v) => {
    const i = Math.max(0, Math.min(last, Math.round(v)));
    setActive((a) => (a === i ? a : i));
  });

  const go = useCallback(
    (i: number) => {
      const to = Math.max(0, Math.min(last, i));
      animate(pos, to, { type: "spring", stiffness: 260, damping: 32 });
    },
    [last, pos]
  );

  // --- Pointer drag: one card per ~40% of the stage width --------------------
  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, start: pos.get(), moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !stage.current) return;
    const dx = e.clientX - d.x;
    // Capture only once it is really a drag; capturing on pointerdown would
    // retarget the click away from the card that was pressed.
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true;
      stage.current.setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const per = stage.current.clientWidth * 0.4;
    // Rubber-band past the ends.
    let v = d.start - dx / per;
    if (v < 0) v = v * 0.3;
    if (v > last) v = last + (v - last) * 0.3;
    pos.set(v);
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.moved) {
      go(Math.round(pos.get()));
      // Swallow the click that follows a drag.
      suppress.current = true;
      setTimeout(() => (suppress.current = false), 0);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    } else if (e.key === "Enter") {
      setOpen(active);
    }
  };

  if (reduceMotion) {
    return (
      <div className={cn("flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4", className)}>
        {items.map((it) => (
          <div key={it.src} className="relative aspect-[16/10] w-[86%] shrink-0 snap-center bg-surface sm:w-[70%]">
            <Image src={it.src} alt={it.alt} fill sizes="80vw" className="object-contain" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        ref={stage}
        role="region"
        aria-roledescription="carousel"
        aria-label="Screenshots"
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative aspect-[16/10.8] w-full cursor-grab touch-pan-y select-none overflow-hidden outline-none [perspective:1800px] active:cursor-grabbing sm:aspect-[16/7.4]"
      >
        {items.map((it, i) => (
          <Card
            key={it.src}
            item={it}
            index={i}
            pos={pos}
            isActive={i === active}
            priority={priority && i === 0}
            onSelect={() => {
              if (suppress.current) return;
              if (i === active) setOpen(i);
              else go(i);
            }}
          />
        ))}
      </div>

      {/* Controls + thumbnails. The thumbnails double as the count. */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          {items.map((it, i) => (
            <button
              key={it.src}
              onClick={() => go(i)}
              aria-label={`Show ${it.alt}`}
              aria-current={i === active ? "true" : undefined}
              className={`relative aspect-[16/10] w-16 shrink-0 cursor-pointer overflow-hidden border transition-all duration-300 sm:w-20 ${
                i === active ? "border-accent opacity-100" : "border-line opacity-50 hover:opacity-90"
              }`}
            >
              <Image src={it.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CtrlButton label="Previous screenshot" disabled={active === 0} onClick={() => go(active - 1)}>
            <ArrowLeft size={16} weight="bold" />
          </CtrlButton>
          <CtrlButton label="Next screenshot" disabled={active === last} onClick={() => go(active + 1)}>
            <ArrowRight size={16} weight="bold" />
          </CtrlButton>
          <CtrlButton label="View full screen" onClick={() => setOpen(active)}>
            <ArrowsOut size={16} weight="bold" />
          </CtrlButton>
        </div>
      </div>

      <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={(i) => { setOpen(i); go(i); }} />
    </div>
  );
}

function CtrlButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="pill flex h-11 w-11 cursor-pointer items-center justify-center border border-line bg-bg text-fg transition-colors hover:border-accent hover:text-accent-text disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:text-fg"
    >
      {children}
    </motion.button>
  );
}

function Card({
  item,
  index,
  pos,
  isActive,
  priority,
  onSelect,
}: {
  item: CoverflowItem;
  index: number;
  pos: MotionValue<number>;
  isActive: boolean;
  priority: boolean;
  onSelect: () => void;
}) {
  // Offset from the front, as a continuous value while dragging.
  const o = useTransform(pos, (p) => index - p);
  const x = useTransform(o, (v) => `${Math.sign(v) * Math.min(Math.abs(v), 3) * 38 - 50}%`);
  const z = useTransform(o, (v) => -Math.min(Math.abs(v), 3) * 260);
  const rotateY = useTransform(o, (v) => -Math.max(-1, Math.min(1, v)) * 46);
  const opacity = useTransform(o, (v) => 1 - Math.max(0, Math.abs(v) - 1.6) * 0.8);
  const shade = useTransform(o, (v) => Math.min(Math.abs(v), 1) * 0.55);
  const zIndex = useTransform(o, (v) => 100 - Math.round(Math.abs(v) * 10));

  // Pointer tilt on the front card only.
  const tiltX = useSpring(0, { stiffness: 200, damping: 20 });
  const tiltY = useSpring(0, { stiffness: 200, damping: 20 });
  const glareX = useTransform(tiltY, [-7, 7], ["15%", "85%"]);
  const glare = useTransform(glareX, (gx) => `radial-gradient(circle at ${gx} 20%, rgb(255 255 255 / 0.16), transparent 55%)`);

  useEffect(() => {
    if (!isActive) {
      tiltX.set(0);
      tiltY.set(0);
    }
  }, [isActive, tiltX, tiltY]);

  return (
    <motion.div
      style={{ x, z, rotateY, opacity, zIndex, transformStyle: "preserve-3d" }}
      className="absolute left-1/2 top-[6%] aspect-[16/10] w-[78%] sm:top-[5%] sm:w-[62%]"
    >
      <motion.button
        type="button"
        onClick={onSelect}
        onPointerMove={(e) => {
          if (!isActive) return;
          const r = e.currentTarget.getBoundingClientRect();
          tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 14);
          tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
        }}
        onPointerLeave={() => {
          tiltX.set(0);
          tiltY.set(0);
        }}
        aria-label={isActive ? `Open ${item.alt} full screen` : `Show ${item.alt}`}
        tabIndex={-1}
        style={{ rotateX: tiltX, rotateY: tiltY }}
        className="relative block h-full w-full cursor-pointer overflow-hidden border border-line-strong bg-surface shadow-[0_40px_80px_-30px_rgb(0_0_0/0.55)] [backface-visibility:hidden]"
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 80vw, 62vw"
          draggable={false}
          className="object-contain"
        />
        {/* Side cards recede into shadow; the front card catches a glare. */}
        <motion.span aria-hidden className="pointer-events-none absolute inset-0 bg-bg" style={{ opacity: shade }} />
        {isActive && (
          <motion.span aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare }} />
        )}
      </motion.button>
    </motion.div>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: CoverflowItem[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const step = (dir: number) => {
    if (index === null) return;
    onIndex(Math.max(0, Math.min(items.length - 1, index + dir)));
  };

  const it = index !== null ? items[index] : null;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
      aria-label={it?.alt ?? "Screenshot"}
      className="m-auto h-[min(92dvh,100%)] w-[min(96vw,1600px)] max-w-none border-0 bg-transparent p-0"
    >
      {it && (
        <div className="relative flex h-full w-full items-center justify-center">
          <div className="relative h-[82%] w-full">
            {/* The carousel's copy is already cached, so it shows at once;
                the full-resolution one lands on top when it arrives. */}
            <Image src={it.src} alt="" fill sizes="(max-width: 640px) 80vw, 62vw" className="object-contain" />
            <Image src={it.src} alt={it.alt} fill sizes="96vw" className="object-contain" />
          </div>
          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2">
            <CtrlButton label="Previous screenshot" disabled={index === 0} onClick={() => step(-1)}>
              <ArrowLeft size={16} weight="bold" />
            </CtrlButton>
            <CtrlButton label="Close" onClick={onClose}>
              <X size={16} weight="bold" />
            </CtrlButton>
            <CtrlButton label="Next screenshot" disabled={index === items.length - 1} onClick={() => step(1)}>
              <ArrowRight size={16} weight="bold" />
            </CtrlButton>
          </div>
        </div>
      )}
    </dialog>
  );
}
