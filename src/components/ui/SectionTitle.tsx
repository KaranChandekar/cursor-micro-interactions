"use client";

import { useEffect, useRef } from "react";

interface SectionTitleProps {
  title: string;
  subtitle: string;
  accent: string;
  centered?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  accent,
  centered = false,
}: SectionTitleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`mb-16 transition-all duration-700 ease-out ${
        centered ? "text-center" : ""
      }`}
      style={{ opacity: 0, transform: "translateY(30px)" }}
    >
      <div
        className={`flex items-center gap-5 mb-5 ${
          centered ? "justify-center" : ""
        }`}
      >
        <div
          className="w-1 h-12 rounded-full shrink-0"
          style={{ backgroundColor: accent }}
        />
        <h2
          className="text-5xl md:text-6xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-heading)", color: accent }}
        >
          {title}
        </h2>
      </div>
      <p className={`text-white/40 text-xl ${centered ? "" : "ml-6"}`}>
        {subtitle}
      </p>
    </div>
  );
}
