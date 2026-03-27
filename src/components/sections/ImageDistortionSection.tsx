"use client";

import { useRef, useEffect } from "react";
import SectionTitle from "@/components/ui/SectionTitle";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  startTime: number;
}

export default function ImageDistortionSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const ripplesRef = useRef<Ripple[]>([]);
  const rafRef = useRef<number>(0);

  const W = 640;
  const H = 420;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    const drawBase = () => {
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, "#1a0a2e");
      grad.addColorStop(0.5, "#16213e");
      grad.addColorStop(1, "#0f3460");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < 15; i++) {
        const cx = 40 + (i % 5) * 140;
        const cy = 60 + Math.floor(i / 5) * 130;
        const r = 35 + Math.sin(i * 1.5) * 15;
        const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        g2.addColorStop(0, `hsla(${i * 25 + 10}, 80%, 60%, 0.7)`);
        g2.addColorStop(1, `hsla(${i * 25 + 10}, 80%, 60%, 0)`);
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    drawBase();
    const baseImageData = ctx.getImageData(0, 0, W, H);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * W,
        y: ((e.clientY - rect.top) / rect.height) * H,
      };
    };

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripplesRef.current.push({
        x: ((e.clientX - rect.left) / rect.width) * W,
        y: ((e.clientY - rect.top) / rect.height) * H,
        radius: 0,
        maxRadius: 250,
        opacity: 1,
        startTime: Date.now(),
      });
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("click", onClick);

    const animate = () => {
      const source = baseImageData.data;
      const output = ctx.createImageData(W, H);
      const dest = output.data;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const now = Date.now();

      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          let offsetX = 0;
          let offsetY = 0;

          const dx = px - mx;
          const dy = py - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const hoverRadius = 80;

          if (dist < hoverRadius && dist > 0) {
            const influence = (hoverRadius - dist) / hoverRadius;
            const strength = influence * influence * 15;
            offsetX += (dx / dist) * strength;
            offsetY += (dy / dist) * strength;
          }

          for (const ripple of ripplesRef.current) {
            const elapsed = (now - ripple.startTime) / 1000;
            const currentRadius = ripple.maxRadius * Math.min(1, elapsed * 1.5);
            const rdx = px - ripple.x;
            const rdy = py - ripple.y;
            const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
            const ringWidth = 30;

            if (Math.abs(rdist - currentRadius) < ringWidth) {
              const wave = Math.sin(
                ((rdist - currentRadius) / ringWidth) * Math.PI
              );
              const fade = Math.max(0, 1 - elapsed * 1.5);
              const strength = wave * fade * 10;
              if (rdist > 0) {
                offsetX += (rdx / rdist) * strength;
                offsetY += (rdy / rdist) * strength;
              }
            }
          }

          const sx = Math.round(Math.min(W - 1, Math.max(0, px + offsetX)));
          const sy = Math.round(Math.min(H - 1, Math.max(0, py + offsetY)));
          const si = (sy * W + sx) * 4;
          const di = (py * W + px) * 4;

          dest[di] = source[si];
          dest[di + 1] = source[si + 1];
          dest[di + 2] = source[si + 2];
          dest[di + 3] = source[si + 3];
        }
      }

      ctx.putImageData(output, 0, 0);

      ripplesRef.current = ripplesRef.current.filter(
        (r) => Date.now() - r.startTime < 1000
      );

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <section
      id="distortion"
      className="min-h-screen flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 py-28"
    >
      <SectionTitle
        title="Image Distortion"
        subtitle="Hover displacement with ripple click effects"
        accent="#ff6600"
        centered
      />
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 0 60px rgba(255,102,0,0.15)" }}
      >
        <canvas
          ref={canvasRef}
          className="block w-full h-auto max-w-[640px]"
          style={{ aspectRatio: `${640}/${420}` }}
          data-interactive
        />
      </div>
      <p className="text-white/25 text-center mt-8 text-sm">
        Hover to distort · Click for ripples
      </p>
    </section>
  );
}
