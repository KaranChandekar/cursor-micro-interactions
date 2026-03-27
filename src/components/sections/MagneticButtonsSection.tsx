"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";

interface MagneticButtonProps {
  children: React.ReactNode;
  accent: string;
  variant: "solid" | "outline" | "gradient" | "icon";
  radius?: number;
}

function MagneticButton({
  children,
  accent,
  variant,
  radius = 120,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

      if (dist < radius) {
        const pull = (radius - dist) / radius;
        x.set((e.clientX - cx) * pull * 0.4);
        y.set((e.clientY - cy) * pull * 0.4);
        setHovered(true);
      } else {
        x.set(0);
        y.set(0);
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [radius, x, y]);

  const isIcon = variant === "icon";

  return (
    <motion.button
      ref={ref}
      style={{
        x: springX,
        y: springY,
        borderColor: variant === "outline" ? accent : undefined,
        backgroundColor:
          variant === "solid"
            ? accent
            : variant === "gradient"
            ? undefined
            : variant === "icon"
            ? `${accent}18`
            : "transparent",
        backgroundImage:
          variant === "gradient"
            ? `linear-gradient(135deg, ${accent}, ${accent}88)`
            : undefined,
        color:
          variant === "outline"
            ? accent
            : variant === "solid"
            ? "#0f0f0f"
            : variant === "icon"
            ? accent
            : "#fff",
        boxShadow: hovered
          ? `0 0 50px ${accent}40, 0 10px 40px ${accent}20`
          : "0 0 0px transparent",
      }}
      className={
        isIcon
          ? "w-24 h-24 flex items-center justify-center rounded-full text-4xl font-semibold transition-shadow duration-300 border border-white/10"
          : "px-12 py-5 text-xl rounded-2xl font-semibold transition-shadow duration-300" +
            (variant === "outline" ? " border-2 bg-transparent" : "")
      }
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      data-interactive
    >
      {children}
    </motion.button>
  );
}

export default function MagneticButtonsSection() {
  return (
    <section
      id="magnetic"
      className="min-h-screen flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 py-28"
    >
      <SectionTitle
        title="Magnetic Buttons"
        subtitle="Buttons that pull toward your cursor with spring physics"
        accent="#00ffff"
        centered
      />
      <div className="flex flex-wrap gap-8 items-center justify-center max-w-4xl">
        <MagneticButton accent="#00ffff" variant="solid">
          Explore
        </MagneticButton>
        <MagneticButton accent="#ff00ff" variant="outline">
          Discover
        </MagneticButton>
        <MagneticButton accent="#00ff00" variant="gradient">
          Create
        </MagneticButton>
        <MagneticButton accent="#ff6600" variant="icon">
          ✦
        </MagneticButton>
        <MagneticButton accent="#ff00ff" variant="solid">
          Launch
        </MagneticButton>
        <MagneticButton accent="#00ffff" variant="outline">
          Connect
        </MagneticButton>
      </div>
    </section>
  );
}
