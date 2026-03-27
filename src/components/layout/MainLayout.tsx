"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Lenis from "lenis";
import CustomCursor from "@/components/ui/CustomCursor";
import SectionNav from "@/components/ui/SectionNav";
import MagneticButtonsSection from "@/components/sections/MagneticButtonsSection";
import CursorTrailSection from "@/components/sections/CursorTrailSection";
import TextRepulsionSection from "@/components/sections/TextRepulsionSection";
import ImageDistortionSection from "@/components/sections/ImageDistortionSection";
import RippleClickSection from "@/components/sections/RippleClickSection";
import DragPhysicsSection from "@/components/sections/DragPhysicsSection";
import ElasticScrollSection from "@/components/sections/ElasticScrollSection";
import SpotlightGallerySection from "@/components/sections/SpotlightGallerySection";
import { sections } from "@/data/sectionConfig";

export default function MainLayout() {
  const [activeSection, setActiveSection] = useState(0);
  const sectionIds = sections.map((s) => s.id);
  const lenisRef = useRef<Lenis | null>(null);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id, index) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(index);
          }
        },
        { threshold: 0.4 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const navigateTo = useCallback(
    (index: number) => {
      const id = sectionIds[index];
      const el = document.getElementById(id);
      if (el && lenisRef.current) {
        lenisRef.current.scrollTo(el, { duration: 1.2 });
      } else if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    },
    [sectionIds]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 8) {
        navigateTo(num - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigateTo]);

  return (
    <main className="relative">
      <CustomCursor activeSection={activeSection} />
      <SectionNav activeSection={activeSection} onNavigate={navigateTo} />

      <MagneticButtonsSection />
      <CursorTrailSection />
      <TextRepulsionSection />
      <ImageDistortionSection />
      <RippleClickSection />
      <DragPhysicsSection />
      <ElasticScrollSection />
      <SpotlightGallerySection />
    </main>
  );
}
