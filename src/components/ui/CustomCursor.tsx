"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { sections } from "@/data/sectionConfig";

interface CustomCursorProps {
  activeSection: number;
}

export default function CustomCursor({ activeSection }: CustomCursorProps) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });
  const isHovering = useRef(false);
  const sizeRef = useRef(20);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const accent = sections[activeSection]?.accent ?? "#00ffff";

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.dataset.interactive
      ) {
        isHovering.current = true;
        if (ringRef.current) {
          ringRef.current.style.width = "50px";
          ringRef.current.style.height = "50px";
          ringRef.current.style.opacity = "0.5";
        }
      }
    };

    const onOut = () => {
      isHovering.current = false;
      if (ringRef.current) {
        ringRef.current.style.width = "36px";
        ringRef.current.style.height = "36px";
        ringRef.current.style.opacity = "1";
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          x: springX,
          y: springY,
          width: 8,
          height: 8,
          backgroundColor: accent,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      <motion.div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-2 transition-all duration-200"
        style={{
          x: springX,
          y: springY,
          width: 36,
          height: 36,
          borderColor: accent,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
