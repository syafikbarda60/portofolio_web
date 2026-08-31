"use client";

import { useEffect, useState } from "react";

/**
 * Starts false so the server render and the first client render agree, then
 * corrects in an effect. Callers must treat false as "not yet known".
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}
