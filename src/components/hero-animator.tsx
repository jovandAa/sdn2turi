"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function HeroAnimator({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const q = gsap.utils.selector(ref.current);

    gsap.fromTo(
      q(".hero-animate"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.12 },
    );
  }, []);

  return <div ref={ref}>{children}</div>;
}
