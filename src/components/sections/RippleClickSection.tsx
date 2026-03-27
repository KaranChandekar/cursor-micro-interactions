"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";

interface RippleData {
  id: number;
  x: number;
  y: number;
  color: string;
}

function RippleContainer({
  children,
  color,
  className = "",
}: {
  children: React.ReactNode;
  color: string;
  className?: string;
}) {
  const [ripples, setRipples] = useState<RippleData[]>([]);
  const idRef = useRef(0);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const id = idRef.current++;
      setRipples((prev) => [
        ...prev,
        {
          id,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          color,
        },
      ]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 700);
    },
    [color]
  );

  return (
    <div
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
      data-interactive
    >
      {children}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full pointer-events-none"
            initial={{
              width: 0,
              height: 0,
              x: r.x,
              y: r.y,
              opacity: 0.6,
            }}
            animate={{
              width: 500,
              height: 500,
              x: r.x - 250,
              y: r.y - 250,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ backgroundColor: r.color }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function RippleClickSection() {
  return (
    <section
      id="ripple"
      className="min-h-screen flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 py-28"
    >
      <SectionTitle
        title="Ripple Click"
        subtitle="Material Design ripples emanating from click point"
        accent="#ff00ff"
        centered
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl w-full">
        {/* Buttons */}
        <RippleContainer
          color="rgba(0,255,255,0.4)"
          className="flex items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 h-20 cursor-pointer select-none"
        >
          <span className="text-cyan-400 font-semibold text-xl z-10 relative">
            Click Me
          </span>
        </RippleContainer>

        <RippleContainer
          color="rgba(255,0,255,0.4)"
          className="flex items-center justify-center rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 h-20 cursor-pointer select-none"
        >
          <span className="text-fuchsia-400 font-semibold text-xl z-10 relative">
            Ripple
          </span>
        </RippleContainer>

        <RippleContainer
          color="rgba(0,255,0,0.4)"
          className="flex items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20 h-20 cursor-pointer select-none"
        >
          <span className="text-green-400 font-semibold text-xl z-10 relative">
            Tap Here
          </span>
        </RippleContainer>

        {/* Cards */}
        <RippleContainer
          color="rgba(255,102,0,0.3)"
          className="rounded-2xl bg-white/[0.04] border border-white/10 p-8 cursor-pointer select-none"
        >
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center mb-5">
              <span className="text-orange-400 text-2xl">◆</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Card Ripple</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              Click anywhere on this card to see the effect
            </p>
          </div>
        </RippleContainer>

        <RippleContainer
          color="rgba(0,255,255,0.3)"
          className="rounded-2xl bg-white/[0.04] border border-white/10 p-8 cursor-pointer select-none"
        >
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-5">
              <span className="text-cyan-400 text-2xl">●</span>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              Surface Effect
            </h3>
            <p className="text-white/40 text-sm leading-relaxed">
              Ripples expand outward from the click point
            </p>
          </div>
        </RippleContainer>

        {/* Circle */}
        <div className="flex items-center justify-center">
          <RippleContainer
            color="rgba(255,0,255,0.4)"
            className="w-40 h-40 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center cursor-pointer select-none"
          >
            <span className="text-fuchsia-400 font-bold text-4xl z-10 relative">
              ◎
            </span>
          </RippleContainer>
        </div>
      </div>
    </section>
  );
}
