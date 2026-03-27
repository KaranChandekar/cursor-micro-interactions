"use client";

import { sections } from "@/data/sectionConfig";

interface SectionNavProps {
  activeSection: number;
  onNavigate: (index: number) => void;
}

export default function SectionNav({ activeSection, onNavigate }: SectionNavProps) {
  return (
    <nav className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {sections.map((section, i) => (
        <button
          key={section.id}
          onClick={() => onNavigate(i)}
          className="group relative flex items-center justify-end"
          aria-label={`Go to ${section.title}`}
        >
          <span
            className="absolute right-8 whitespace-nowrap text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{ color: section.accent }}
          >
            {section.title}
          </span>
          <span
            className="block rounded-full transition-all duration-300"
            style={{
              width: activeSection === i ? 12 : 8,
              height: activeSection === i ? 12 : 8,
              backgroundColor:
                activeSection === i ? section.accent : "rgba(255,255,255,0.3)",
              boxShadow:
                activeSection === i
                  ? `0 0 8px ${section.accent}`
                  : "none",
            }}
          />
        </button>
      ))}
    </nav>
  );
}
