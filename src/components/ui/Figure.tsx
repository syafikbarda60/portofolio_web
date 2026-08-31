"use client";

import React from "react";
import CountUp from "@/components/reactbits/CountUp";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * A counting numeral that lands on its value immediately when the reader has
 * asked for reduced motion.
 */
export function Figure({
  to,
  duration = 1.7,
  className,
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={className}>{to}</span>;
  }

  return <CountUp to={to} duration={duration} className={className} />;
}
