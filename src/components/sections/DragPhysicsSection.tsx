"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/ui/SectionTitle";

interface CardData {
  id: number;
  label: string;
  color: string;
  emoji: string;
  x: number;
  y: number;
}

const INITIAL_CARDS: CardData[] = [
  { id: 0, label: "Physics", color: "#00ffff", emoji: "⚡", x: 40, y: 30 },
  { id: 1, label: "Motion", color: "#ff00ff", emoji: "🌊", x: 260, y: 60 },
  { id: 2, label: "Spring", color: "#00ff00", emoji: "🌀", x: 500, y: 30 },
  { id: 3, label: "Bounce", color: "#ff6600", emoji: "🔮", x: 100, y: 220 },
  { id: 4, label: "Inertia", color: "#ff00ff", emoji: "✨", x: 370, y: 240 },
  { id: 5, label: "Elastic", color: "#00ffff", emoji: "💫", x: 600, y: 200 },
];

function DraggableCard({ card }: { card: CardData }) {
  return (
    <motion.div
      drag
      dragMomentum
      dragElastic={0.15}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      whileDrag={{ scale: 1.08, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      className="absolute w-[160px] h-[110px] rounded-2xl flex flex-col items-center justify-center gap-2 select-none backdrop-blur-sm"
      style={{
        left: card.x,
        top: card.y,
        background: `linear-gradient(135deg, ${card.color}18, ${card.color}08)`,
        border: `1px solid ${card.color}40`,
        boxShadow: `0 4px 24px ${card.color}15`,
      }}
      data-interactive
    >
      <span className="text-3xl">{card.emoji}</span>
      <span className="text-sm font-semibold" style={{ color: card.color }}>
        {card.label}
      </span>
    </motion.div>
  );
}

export default function DragPhysicsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="drag"
      className="min-h-screen flex flex-col items-center justify-center px-8 md:px-16 lg:px-24 py-28"
    >
      <SectionTitle
        title="Drag & Drop Physics"
        subtitle="Throw cards with velocity and watch them bounce"
        accent="#00ffff"
        centered
      />
      <div
        ref={containerRef}
        className="relative w-full max-w-[820px] h-[400px] rounded-2xl border border-white/10 bg-white/[0.02]"
      >
        {INITIAL_CARDS.map((card) => (
          <DraggableCard key={card.id} card={card} />
        ))}
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/20 text-sm">
          Drag and throw the cards
        </p>
      </div>
    </section>
  );
}
