"use client";

import { useRef, useEffect, useCallback } from "react";
import SectionTitle from "@/components/ui/SectionTitle";

const TEXT = "HOVER ME";
const RADIUS = 120;
const STRENGTH = 40;

export default function TextRepulsionSection() {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const originsRef = useRef<{ x: number; y: number }[]>([]);
  const offsetsRef = useRef<{ x: number; y: number; r: number }[]>(
    TEXT.split("").map(() => ({ x: 0, y: 0, r: 0 }))
  );

  const cacheOrigins = useCallback(() => {
    originsRef.current = charRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
  }, []);

  useEffect(() => {
    cacheOrigins();
    window.addEventListener("resize", cacheOrigins);
    window.addEventListener("scroll", cacheOrigins);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    const animate = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      charRefs.current.forEach((el, i) => {
        if (!el) return;
        const origin = originsRef.current[i];
        if (!origin) return;

        const offsets = offsetsRef.current[i];
        const cx = origin.x + offsets.x;
        const cy = origin.y + offsets.y;
        const dx = cx - mx;
        const dy = cy - my;
        const dist = Math.hypot(dx, dy);

        let targetX = 0;
        let targetY = 0;
        let targetR = 0;

        if (dist < RADIUS && dist > 0) {
          const force = (RADIUS - dist) / RADIUS;
          const angle = Math.atan2(dy, dx);
          targetX = Math.cos(angle) * force * STRENGTH;
          targetY = Math.sin(angle) * force * STRENGTH;
          targetR = force * 15 * (i % 2 === 0 ? 1 : -1);
        }

        offsets.x += (targetX - offsets.x) * 0.15;
        offsets.y += (targetY - offsets.y) * 0.15;
        offsets.r += (targetR - offsets.r) * 0.15;

        el.style.transform = `translate(${offsets.x}px, ${offsets.y}px) rotate(${offsets.r}deg)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", cacheOrigins);
      window.removeEventListener("scroll", cacheOrigins);
    };
  }, [cacheOrigins]);

  return (
    <section
      id="repulsion"
      className="min-h-screen flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 py-28"
    >
      <SectionTitle
        title="Text Repulsion"
        subtitle="Characters push away from your cursor position"
        accent="#00ff00"
        centered
      />
      <div className="flex items-center justify-center gap-4 md:gap-6">
        {TEXT.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              charRefs.current[i] = el;
            }}
            className="inline-block text-7xl md:text-9xl font-bold select-none will-change-transform"
            style={{
              fontFamily: "var(--font-heading)",
              color: "#00ff00",
              textShadow: "0 0 30px rgba(0,255,0,0.3)",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
      <p className="text-white/25 text-center mt-16 text-lg">
        Move your cursor over the letters
      </p>
    </section>
  );
}
