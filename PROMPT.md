# Cursor Effects & Micro-Interactions Showcase - Claude Code Prompt

You are building an interactive single-page application showcasing 8 advanced cursor-driven effects and micro-interactions. Each section demonstrates a different interaction pattern with smooth animations, physics-based motion, and detailed visual feedback.

## Objectives

1. **8 Interactive Sections** (each full-viewport height):
   - Magnetic Buttons: Buttons pull toward cursor with spring physics
   - Cursor Trail: Canvas-based particle trail following cursor
   - Text Repulsion: Characters push away from cursor position
   - Image Hover Distortion: WebGL displacement + ripple click effect
   - Ripple Click Effects: Material Design ripples on click
   - Drag & Drop Physics: Cards with throw velocity and collision
   - Elastic Scroll Indicator: Custom scrollbar with elastic stretch
   - Spotlight Gallery: Images revealed under circular spotlight

2. **Global Features**:
   - Custom cursor component (morphs per section)
   - Smooth scroll navigation (Lenis)
   - Dot navigation indicators (right side)
   - Keyboard shortcuts (number keys 1-8)
   - Smooth section entry animations
   - Dark theme with vibrant section accents

3. **Visual Design**:
   - Dark background (#0f0f0f)
   - Per-section accent colors (cyan, magenta, lime, orange)
   - Typography: Syne (headings), Plus Jakarta Sans (body)
   - Smooth transitions between sections
   - GPU-accelerated animations

## Technical Requirements

### Stack
- **Next.js 15** with TypeScript
- **GSAP** for orchestrated animations
- **Framer Motion** for component animations
- **Custom React hooks** for interaction logic
- **HTML5 Canvas** for trails, ripples, scrollbar
- **requestAnimationFrame** for mouse tracking
- **Tailwind CSS** with dark mode

### Section Implementation Details

**1. Magnetic Buttons**:
- 4-6 buttons with different styles (solid, outline, icon)
- Proximity detection within 50-100px radius
- Spring physics: stiffness 300, damping 25
- On hover: Scale 1.05x, shadow expansion
- On click: Scale bounce (0.95 → 1.1), optional sound
- Button colors: Cyan, Magenta, Lime, Orange accents

**2. Cursor Trail**:
- Canvas overlay covering viewport
- 30-50 particles simultaneously
- Particle lifetime: 0.5-1 second
- Size fade: Start 8-12px, end 2px
- Opacity decay: Exponential per frame
- Color options: Cyan gradient, rainbow spectrum, or monochrome
- Creation: New particle every 2-4 pixels of movement

**3. Text Repulsion**:
- Split text into individual characters
- Characters push away from cursor within 80px radius
- GSAP spring animation: elastic.out easing
- Rotation: Optional spin on repulsion (±10°)
- Scale: Optional size modulation during push
- Return: Smooth spring back to origin
- Text styling: Bold font, 24-48px, letter-spacing 4-8px

**4. Image Hover Distortion**:
- WebGL canvas or Canvas displacement (your choice)
- Normal map for displacement direction
- Mouse uniform controls distortion magnitude
- Click creates ripples: Expanding circles from click point
- Ripple parameters: 600-800ms duration, decreasing opacity
- Multiple ripples: Queue and overlay
- Image size: 400x300px, portfolio-worthy content

**5. Ripple Click Effects**:
- Detect click coordinates within element
- Create ripple expanding outward to element edges
- Ripple opacity: 1 → 0 linear fade
- Duration: 600-800ms
- Color: Match element variant (button color)
- Multiple ripples: Queue system allows overlapping
- Variants: Buttons, cards, menu items, circles

**6. Drag & Drop Physics**:
- Framer Motion drag gesture detection
- Capture velocity on drag end
- Continue motion with exponential decay (0.95-0.99 per frame)
- Boundary detection: Prevent leaving viewport
- Collision: Bounce with energy loss (0.7x elasticity)
- Optional magnetism: Snap-to-grid or snap-home on release
- 4-8 draggable cards scattered initially

**7. Elastic Scroll Indicator**:
- Custom scrollbar on right edge
- Width: 8px, semi-transparent (0.6-0.8 opacity)
- Color: Accent color (cyan or magenta)
- Elastic stretch: Math.abs(overscroll) * 0.3
- Behavior: Stretch at top/bottom boundaries
- Track: Subtle background line
- Hover effect: Brighten on mouse over

**8. Spotlight Gallery**:
- Dark background (#0d0d0d), nearly black
- 9 images arranged in 3x3 grid (200x200px each)
- Circular spotlight: 80-120px radius
- Spotlight follows cursor smoothly
- Gradient feathering: Sharp to soft edge transition
- Reveal mode: Images only visible under spotlight
- Optional: Auto-tour animation (spotlight moves through gallery)

### Global Features

**Custom Cursor Component**:
- Replace default system cursor
- Circle shape that grows on interactive elements
- Color matches current section
- Optional label/emoji inside circle
- Smooth transitions between sizes and colors
- Slightly offset from actual mouse position (visual effect)

**Smooth Scroll** (Lenis):
```typescript
import Lenis from '@studio-freight/lenis';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

**Section Navigation**:
- Dot indicators on right side
- Current section highlighted
- Click dot to scroll to section
- Keyboard shortcut: Press number (1-8) to jump
- Tooltip labels: Show section name on hover
- Smooth scroll animation to target section

**Section Entry Animation**:
- Use Intersection Observer to detect viewport entry
- Animate: Opacity (0 → 1), Y-position (30px down)
- Duration: 0.6s
- Easing: Power2.out or cubic-bezier

### Interaction Patterns

**useMousePosition Hook**:
```typescript
function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setMouse({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mouse;
}
```

**useMagneticButton Hook**:
- Calculate distance from button center to cursor
- Apply spring force if within threshold
- Return offset coordinates
- Integrate with Framer Motion transform

**useElasticScroll Hook**:
- Track scroll position via scroll event
- Calculate overscroll amount (negative or > max)
- Return stretch factor for visual indication

**Canvas Animation Pattern**:
- Create canvas ref
- Get 2D context
- requestAnimationFrame loop for animation
- Clear canvas each frame
- Update particle positions
- Draw particles with opacity/size fade
- Filter out dead particles

### Styling & Colors

**Dark Theme**:
- Background: #0f0f0f (nearly black)
- Text: #ffffff (white)
- Section padding: 40-60px horizontal, 80-120px vertical

**Section Accent Colors**:
1. Magnetic: Cyan (#00ffff)
2. Trail: Cyan/Magenta (#ff00ff)
3. Text Repulsion: Lime (#00ff00)
4. Image Distortion: Orange (#ff6600)
5. Ripple: Magenta (#ff00ff)
6. Drag: Cyan (#00ffff)
7. Scroll: Cyan (#00ffff)
8. Spotlight: White on dark

**Typography**:
- Headings: Syne font, bold, 2.5rem
- Body: Plus Jakarta Sans, regular, 1rem
- Spacing: 1rem line-height

### Performance & Optimization

- **requestAnimationFrame**: All animations use RAF
- **GPU acceleration**: Use transform and opacity only
- **Debouncing**: Mouse events debounced (16ms per frame)
- **Canvas optimization**: Offscreen canvas for complex rendering
- **Lazy loading**: Sections initialize on viewport entry
- **Memory management**: Clean up listeners on unmount

**Lighthouse Targets**:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Performance score: 90+

### Accessibility

- **Keyboard**: Tab through sections, arrow keys navigate
- **Reduced motion**: Respect `prefers-reduced-motion` (disable animations)
- **Focus indicators**: Visible outline on interactive elements
- **Contrast**: WCAG AA minimum (4.5:1)
- **Screen readers**: Semantic HTML, aria-labels

## File Organization

```
09-cursor-micro-interactions/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── sections/
│   │   │   ├── MagneticButtonsSection.tsx
│   │   │   ├── CursorTrailSection.tsx
│   │   │   ├── TextRepulsionSection.tsx
│   │   │   ├── ImageDistortionSection.tsx
│   │   │   ├── RippleClickSection.tsx
│   │   │   ├── DragPhysicsSection.tsx
│   │   │   ├── ElasticScrollSection.tsx
│   │   │   └── SpotlightGallerySection.tsx
│   │   ├── ui/
│   │   │   ├── CustomCursor.tsx
│   │   │   ├── SectionNav.tsx
│   │   │   └── SectionTitle.tsx
│   │   └── layout/
│   │       └── MainLayout.tsx
│   ├── hooks/
│   │   ├── useMousePosition.ts
│   │   ├── useMagneticButton.ts
│   │   ├── useCursorTrail.ts
│   │   ├── useTextRepulsion.ts
│   │   ├── useDragPhysics.ts
│   │   └── useElasticScroll.ts
│   ├── lib/
│   │   ├── physics.ts (spring, drag, collision)
│   │   ├── animations.ts (easing configs)
│   │   └── utils.ts (math helpers)
│   └── data/
│       └── sectionConfig.ts
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

## Development Priorities

### Phase 1: Core Setup & First Two Sections
1. Next.js project with TypeScript and Tailwind
2. Setup Lenis smooth scroll
3. Implement CustomCursor component
4. Build layout with section structure
5. Create SectionNav and entry animations
6. Implement Magnetic Buttons section
7. Implement Cursor Trail section with Canvas

### Phase 2: Text & Image Sections
8. Text Repulsion section (character-level control)
9. Image Distortion with click ripples
10. Ripple Click Effects showcase section

### Phase 3: Physics & Custom Interactions
11. Drag & Drop with physics
12. Elastic Scroll Indicator
13. Spotlight Gallery

### Phase 4: Polish & Optimization
14. Performance audit (Lighthouse)
15. Mobile responsive testing
16. Keyboard shortcuts implementation
17. Accessibility review
18. Deploy to Vercel

## Key Implementation Notes

- Use Canvas 2D for trails, ripples, and scrollbar (simpler than WebGL for these)
- Implement all mouse interactions via requestAnimationFrame for smooth 60 FPS
- Store mouse position in state, update only on RAF tick (not every mousemove)
- Use GSAP for complex sequential animations, Framer Motion for component state
- Implement Spring physics using Framer Motion's spring easing or custom via GSAP
- All sections should be scrollable to (no fixed backgrounds or overflow hidden)
- Custom cursor should have slight lag (use spring position, not exact mouse)

## Testing & Validation

- Test on Chrome, Firefox, Safari (desktop)
- Test on iOS Safari and Chrome (mobile)
- Verify smooth 60 FPS (DevTools Performance tab)
- Check keyboard navigation (Tab through all sections)
- Test accessibility (axe DevTools, WAVE)
- Verify Lighthouse score 90+ on Performance
- Cross-browser cursor behavior (Safari may disable custom cursor on some events)

## Success Criteria

✓ All 8 sections implemented with smooth animations
✓ Custom cursor morphs per section and grows on interaction
✓ Smooth scroll navigation between sections
✓ Magnetic buttons pull toward cursor with spring physics
✓ Cursor trail follows with particle fade animation
✓ Text characters repel away from cursor position
✓ Image distortion on hover with click ripples
✓ Material Design ripple effect on click
✓ Draggable cards with physics and collision
✓ Elastic custom scrollbar at viewport boundaries
✓ Spotlight gallery reveals images under circular light
✓ Keyboard shortcuts (1-8) jump to sections
✓ Dot navigation indicators with click/jump
✓ Dark theme with vibrant section accents
✓ Lighthouse score: 90+ on all metrics
✓ Mobile responsive and performant
✓ Deployed and publicly accessible
