"use client";

import { useRef, useEffect, useCallback } from "react";
import SectionTitle from "@/components/ui/SectionTitle";

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  hue: number;
  vx: number;
  vy: number;
}

export default function CursorTrailSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const prevMouseRef = useRef({ x: -100, y: -100 });
  const hueRef = useRef(0);
  const rafRef = useRef<number>(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const rect = section.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", onMove);

    const ctx = canvas.getContext("2d")!;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const px = prevMouseRef.current.x;
      const py = prevMouseRef.current.y;
      const dist = Math.hypot(mx - px, my - py);

      if (dist > 3 && mx > 0 && my > 0 && mx < canvas.width && my < canvas.height) {
        hueRef.current = (hueRef.current + 2) % 360;
        particlesRef.current.push({
          x: mx,
          y: my,
          size: 10 + Math.random() * 4,
          opacity: 1,
          hue: hueRef.current,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
        });
      }

      prevMouseRef.current = { x: mx, y: my };

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.02;
        p.size *= 0.97;

        if (p.opacity <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.opacity})`;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${p.opacity * 0.5})`;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        return true;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  return (
    <section
      ref={sectionRef}
      id="trail"
      className="relative min-h-screen flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 py-28"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />
      <div className="relative z-10 flex flex-col items-center">
        <SectionTitle
          title="Cursor Trail"
          subtitle="Canvas-based particle trail following your movement"
          accent="#ff00ff"
          centered
        />
        <div className="mt-8 px-8 py-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          <p className="text-white/30 text-center text-lg">
            Move your cursor around this section to see the trail effect
          </p>
        </div>
      </div>
    </section>
  );
}
