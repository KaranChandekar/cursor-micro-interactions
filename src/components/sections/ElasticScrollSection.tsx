"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import SectionTitle from "@/components/ui/SectionTitle";

export default function ElasticScrollSection() {
  const scrollableRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbHeight, setThumbHeight] = useState(60);
  const [thumbTop, setThumbTop] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  const getScrollRatio = useCallback(() => {
    const container = scrollableRef.current;
    if (!container) return { height: 60, maxScroll: 0, trackHeight: 0 };
    const { scrollHeight, clientHeight } = container;
    const ratio = clientHeight / scrollHeight;
    const height = Math.max(40, ratio * clientHeight);
    const maxScroll = scrollHeight - clientHeight;
    return { height, maxScroll, trackHeight: clientHeight };
  }, []);

  useEffect(() => {
    const container = scrollableRef.current;
    if (!container) return;

    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      const ratio = clientHeight / scrollHeight;
      const height = Math.max(40, ratio * clientHeight);
      setThumbHeight(height);

      const percent = maxScroll > 0 ? scrollTop / maxScroll : 0;
      setThumbTop(percent * (clientHeight - height));
    };

    container.addEventListener("scroll", update);
    update();
    return () => container.removeEventListener("scroll", update);
  }, []);

  const handleThumbMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const container = scrollableRef.current;
    if (!container) return;
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = container.scrollTop;

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const { height, maxScroll, trackHeight } = getScrollRatio();
      const deltaY = e.clientY - dragStartY.current;
      const trackScrollRange = trackHeight - height;
      const scrollDelta = trackScrollRange > 0 ? (deltaY / trackScrollRange) * maxScroll : 0;
      container.scrollTop = Math.max(0, Math.min(maxScroll, dragStartScrollTop.current + scrollDelta));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }, [getScrollRatio]);

  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    const container = scrollableRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const { height, maxScroll, trackHeight } = getScrollRatio();
    const percent = Math.max(0, Math.min(1, (clickY - height / 2) / (trackHeight - height)));
    container.scrollTop = percent * maxScroll;
  }, [getScrollRatio]);

  const items = Array.from({ length: 20 }, (_, i) => ({
    title: `Item ${i + 1}`,
    desc: [
      "Spring animation",
      "Elastic bounce",
      "Smooth transition",
      "Physics engine",
      "Motion design",
    ][i % 5],
    color: `hsl(${180 + i * 9}, 80%, 60%)`,
  }));

  return (
    <section
      id="scroll"
      className="min-h-screen flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 py-28"
    >
      <SectionTitle
        title="Elastic Scroll"
        subtitle="Custom scrollbar with elastic stretch at boundaries"
        accent="#00ffff"
        centered
      />
      <div
        className="relative w-full max-w-2xl"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          ref={scrollableRef}
          data-lenis-prevent
          className="h-[440px] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02]"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="p-6 space-y-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="px-5 py-4 rounded-xl border border-white/[0.06] bg-white/[0.03] flex items-center gap-5 transition-colors hover:bg-white/[0.06]"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-white/80 font-medium">{item.title}</span>
                <span className="text-white/30 text-sm">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Custom scrollbar */}
        <div
          ref={trackRef}
          className="absolute right-2 top-3 bottom-3 w-1.5 rounded-full bg-white/[0.06] cursor-pointer"
          onClick={handleTrackClick}
        >
          <div
            className="absolute w-1.5 rounded-full transition-colors duration-100 cursor-grab active:cursor-grabbing"
            style={{
              height: thumbHeight,
              top: thumbTop,
              backgroundColor: isHovering
                ? "rgba(0, 255, 255, 0.8)"
                : "rgba(0, 255, 255, 0.4)",
              boxShadow: isHovering
                ? "0 0 10px rgba(0, 255, 255, 0.3)"
                : "none",
            }}
            onMouseDown={handleThumbMouseDown}
          />
        </div>
      </div>
    </section>
  );
}
