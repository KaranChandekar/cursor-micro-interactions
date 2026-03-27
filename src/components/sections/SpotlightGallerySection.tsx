"use client";

import { useRef, useEffect } from "react";
import SectionTitle from "@/components/ui/SectionTitle";

const GRID_COLORS = [
  ["#ff6b6b", "#feca57", "#48dbfb"],
  ["#ff9ff3", "#54a0ff", "#5f27cd"],
  ["#01a3a4", "#f368e0", "#ff6348"],
];

export default function SpotlightGallerySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -200, y: -200 });
  const smoothMouse = useRef({ x: -200, y: -200 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onLeave = () => {
      mouseRef.current = { x: -200, y: -200 };
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    const ctx = canvas.getContext("2d")!;
    const spotlightRadius = 120;

    const drawGrid = () => {
      const w = canvas.width;
      const h = canvas.height;
      const gap = 14;
      const cols = 3;
      const rows = 3;
      const cellW = (w - gap * (cols + 1)) / cols;
      const cellH = (h - gap * (rows + 1)) / rows;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = gap + col * (cellW + gap);
          const y = gap + row * (cellH + gap);

          const color = GRID_COLORS[row][col];
          const grad = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
          grad.addColorStop(0, color);
          grad.addColorStop(1, color + "66");
          ctx.fillStyle = grad;

          const r = 14;
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + cellW - r, y);
          ctx.quadraticCurveTo(x + cellW, y, x + cellW, y + r);
          ctx.lineTo(x + cellW, y + cellH - r);
          ctx.quadraticCurveTo(x + cellW, y + cellH, x + cellW - r, y + cellH);
          ctx.lineTo(x + r, y + cellH);
          ctx.quadraticCurveTo(x, y + cellH, x, y + cellH - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "rgba(255,255,255,0.12)";
          ctx.beginPath();
          ctx.arc(
            x + cellW / 2,
            y + cellH / 2,
            Math.min(cellW, cellH) * 0.25,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    };

    const animate = () => {
      smoothMouse.current.x +=
        (mouseRef.current.x - smoothMouse.current.x) * 0.12;
      smoothMouse.current.y +=
        (mouseRef.current.y - smoothMouse.current.y) * 0.12;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();

      const mx = smoothMouse.current.x;
      const my = smoothMouse.current.y;

      ctx.save();
      ctx.globalCompositeOperation = "destination-in";

      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, spotlightRadius);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.65, "rgba(255,255,255,0.5)");
      grad.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="spotlight"
      className="min-h-screen flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 py-28"
    >
      <SectionTitle
        title="Spotlight Gallery"
        subtitle="Images revealed under a circular spotlight"
        accent="#ffffff"
        centered
      />
      <div
        ref={containerRef}
        className="relative w-full max-w-[580px] aspect-square rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/10"
        data-interactive
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
      <p className="text-white/20 text-center mt-8 text-sm">
        Move your cursor to reveal the gallery
      </p>
    </section>
  );
}
