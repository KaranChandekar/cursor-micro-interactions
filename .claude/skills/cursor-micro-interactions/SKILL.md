---
name: cursor-micro-interactions
description: Build a single-page showcase of advanced cursor effects and micro-interactions — magnetic buttons, cursor trails, text repulsion, image distortion on hover, ripple clicks, drag-and-drop physics, elastic scroll, and spotlight galleries. Use this skill when building micro-interaction showcases, cursor effect demos, UI animation portfolios, or interaction design explorations. Trigger when the user mentions cursor effects, micro-interactions, magnetic buttons, hover effects, custom cursor, interaction showcase, or animated UI details.
---

# Cursor Effects & Micro-Interactions Showcase

## Overview
Create an interactive single-page application showcasing 8 advanced cursor-driven effects and micro-interactions. Each section demonstrates a different interaction pattern with smooth animations, physics-based motion, and detailed visual feedback. This skill explores the intersection of motion design, user input, and visual storytelling.

## Technology Stack
- **Framework**: Next.js 15 with TypeScript
- **Animation**: GSAP, Framer Motion
- **Interaction**: Custom React hooks, requestAnimationFrame
- **Physics**: Spring physics, drag velocity calculations
- **Canvas**: HTML5 Canvas for cursor trails
- **Styling**: Tailwind CSS with CSS custom properties
- **Fonts**: Syne, Plus Jakarta Sans (Google Fonts)
- **Utilities**: Lenis for smooth scroll
- **Build Tools**: Turbopack, SWC

## Project Structure
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
│   │   │   ├── SectionTitle.tsx
│   │   │   └── ScrollToTop.tsx
│   │   └── layout/
│   │       └── MainLayout.tsx
│   ├── hooks/
│   │   ├── useMousePosition.ts
│   │   ├── useMagneticButton.ts
│   │   ├── useCursorTrail.ts
│   │   ├── useTextRepulsion.ts
│   │   ├── useImageDistortion.ts
│   │   ├── useDragPhysics.ts
│   │   ├── useElasticScroll.ts
│   │   └── useSpotlight.ts
│   ├── lib/
│   │   ├── physics.ts (spring, drag, collision)
│   │   ├── animations.ts (easing, timings)
│   │   ├── utils.ts (distance, angle, math)
│   │   └── constants.ts (configs, thresholds)
│   ├── data/
│   │   └── sectionConfig.ts (metadata, descriptions)
│   └── styles/
│       ├── globals.css
│       └── theme.css
├── public/
│   ├── fonts/
│   └── images/ (for demo images)
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

## Section Specifications

### 1. Magnetic Buttons Section
**Concept**: Interactive buttons that pull toward cursor when nearby

**Technical Implementation**:
- **Proximity detection**: Calculate distance from cursor to button center
- **Threshold radius**: 50-100px (user customizable per button)
- **Spring physics**: Use GSAP's gsap.to() with spring easing
- **Multiple instances**: 4-6 buttons with different sizes and styles
- **Spring config**: Stiffness 300, damping 25, mass 1

**Button Styles**:
1. Solid fill button: Background color, white text
2. Outline button: Border only, transparent fill
3. Icon-only button: SVG icon, minimal visual
4. Gradient button: Linear/radial gradient fill

**Interactions**:
- On hover (not magnetic): Scale increases 1.05x, shadow expands
- On magnetic pull: Transform translates toward cursor (50% radius)
- On click: Brief scale bounce (0.95 → 1.1 → 1.0) with sound feedback
- On blur: Spring back to origin with smooth easing

**Animation Details**:
- Spring type easing for natural motion
- Update position on every mousemove (requestAnimationFrame)
- Calculate angle from button to cursor for directional pull
- Damping prevents oscillation (settles smoothly)

**Code Pattern**:
```typescript
const magneticButtonRef = useRef<HTMLButtonElement>(null);
const [offset, setOffset] = useState({ x: 0, y: 0 });

useEffect(() => {
  const onMouseMove = (e: MouseEvent) => {
    const button = magneticButtonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.hypot(
      e.clientX - centerX,
      e.clientY - centerY
    );

    if (distance < magnetRadius) {
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const pull = magnetRadius - distance;

      setOffset({
        x: Math.cos(angle) * pull * 0.5,
        y: Math.sin(angle) * pull * 0.5,
      });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  window.addEventListener('mousemove', onMouseMove);
  return () => window.removeEventListener('mousemove', onMouseMove);
}, [magnetRadius]);
```

**Visual Design**:
- Button colors: Cyan, Magenta, Lime green, Orange accents
- Hover shadow: Blur 20px, spread 5px, colored glow
- Click feedback: Particle burst animation (optional)
- Text: Medium font weight, letter spacing 0.5px

**Accessibility**:
- Keyboard accessible (Tab, Enter/Space)
- Focus indicator visible (outline)
- Magnetic effect disabled on keyboard focus (only mouse)

---

### 2. Cursor Trail Section
**Concept**: Canvas-based animated trail following cursor position

**Technical Implementation**:
- **Canvas rendering**: Custom 2D canvas for trail drawing
- **Particle system**: Store array of {x, y, size, opacity, lifetime}
- **Spring physics**: Each particle trails behind cursor with spring motion
- **Decaying trail**: Opacity and size decrease over time
- **Performance**: Use requestAnimationFrame for smooth 60 FPS

**Trail Characteristics**:
- Particle count: 30-50 simultaneous particles
- Particle size: Start large (8-12px), shrink to 2px
- Lifetime: 0.5-1 second per particle
- Color: Varies per particle (gradient spectrum or monochrome)
- Blend mode: Multiply or Screen for visual interest

**Physics**:
- New particle created every 2-4 pixels of mouse movement
- Spring velocity: Particles lag behind cursor position
- Velocity decay: Exponential falloff (0.85x per frame)
- Collision: Optional bouncing off viewport edges

**Canvas Implementation**:
```typescript
useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles: Particle[] = [];

  const animate = () => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update particles
    particles = particles.filter(p => {
      p.x += (mousePos.x - p.x) * 0.1; // Spring lag
      p.y += (mousePos.y - p.y) * 0.1;
      p.lifetime -= 0.016;
      p.opacity = Math.max(0, p.lifetime);
      p.size = p.initialSize * p.opacity;

      // Draw
      ctx.fillStyle = `rgba(0, 255, 255, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      return p.lifetime > 0;
    });

    // Create new particle
    if (lastMousePos && distance > threshold) {
      particles.push({
        x: mousePos.x,
        y: mousePos.y,
        initialSize: 10,
        size: 10,
        opacity: 1,
        lifetime: 1,
      });
    }

    requestAnimationFrame(animate);
  };

  animate();
}, []);
```

**Visual Variations**:
1. **Simple circle trail**: Basic colored circles, fading
2. **Colored spectrum**: Rainbow gradient through trail
3. **Glowing trail**: Soft glow effect, larger blur
4. **Sparkle trail**: Star shapes with twinkling
5. **Line trail**: Connect particles with bezier curves

**Customization**:
- Toggle trail on/off
- Adjust particle size and lifetime
- Change color scheme
- Control trail density (creation frequency)

---

### 3. Text Repulsion Section
**Concept**: Text characters push away from cursor position

**Technical Implementation**:
- **Character splitting**: Split text into individual letters
- **Position tracking**: Each character tracks its original position
- **Repulsion force**: Calculate distance to cursor, apply opposing force
- **Spring return**: GSAP to smoothly return to original position
- **Rotation**: Optional spin animation on repulsion
- **Multiple instances**: Paragraph with continuous text effect

**Physics Calculation**:
```typescript
const repulsionRadius = 80;
const repulsionStrength = 15;

characters.forEach((char, index) => {
  const charEl = charRefs.current[index];
  if (!charEl) return;

  const rect = charEl.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const dx = centerX - mousePos.x;
  const dy = centerY - mousePos.y;
  const distance = Math.hypot(dx, dy);

  if (distance < repulsionRadius) {
    const angle = Math.atan2(dy, dx);
    const force = (repulsionRadius - distance) / repulsionRadius;
    const pushX = Math.cos(angle) * force * repulsionStrength;
    const pushY = Math.sin(angle) * force * repulsionStrength;

    gsap.to(charEl, {
      x: pushX,
      y: pushY,
      rotation: force * 10,
      duration: 0.1,
      overwrite: 'auto',
    });
  } else {
    // Spring back to original
    gsap.to(charEl, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.3,
      ease: 'elastic.out(1, 0.3)',
    });
  }
});
```

**Text Styling**:
- Font: Bold weight (600-700), large size (24-48px)
- Color: Bright accent color with shadow
- Letter spacing: 4-8px for separation
- Text content: Short phrase or sentence (20-30 characters)

**Variations**:
1. **Single paragraph**: Long text block with all chars repelling
2. **Multiple lines**: Maintains text layout, wraps naturally
3. **Heading only**: Large title with strong effect
4. **Mixed content**: Text + emojis
5. **Curved text**: Text follows arc path, repulsion adds complexity

**Advanced Options**:
- Enable rotation on repulsion
- Add color shift during repulsion
- Scale characters away/toward
- Create vortex motion (circular)

---

### 4. Image Hover Distortion Section
**Concept**: WebGL displacement on image hover with ripple click effect

**Technical Implementation**:
- **WebGL canvas**: Render image with displacement shader
- **Normal map**: Use grayscale texture for displacement magnitude
- **Mouse position**: Pass to shader as uniform
- **Ripple click**: Concentric ripples expand from click point
- **Performance**: Use Three.js or Babylon.js for easier setup

**Shader-Based Approach**:
```glsl
// Displacement vertex shader
uniform sampler2D uTexture;
uniform sampler2D uNormalMap;
uniform vec2 uMouse;
uniform float uTime;
uniform float uDisplacementAmount;

void main() {
  vec2 uv = vUv;

  // Calculate distance to mouse
  float dist = distance(uv, uMouse);
  float influence = 1.0 - smoothstep(0.0, 0.3, dist);

  // Sample normal map for displacement direction
  vec3 normal = texture2D(uNormalMap, uv).rgb;

  // Displace geometry
  vec3 displaced = position + normal * influence * uDisplacementAmount;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
```

**Alternative (Canvas Approach)**:
```typescript
const distortImage = (ctx, x, y, strength) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const pixelIndex = i / 4;
    const pixelX = pixelIndex % width;
    const pixelY = Math.floor(pixelIndex / width);

    const dx = pixelX - x;
    const dy = pixelY - y;
    const distance = Math.hypot(dx, dy);

    if (distance < 200) {
      const angle = Math.atan2(dy, dx);
      const influence = (200 - distance) / 200;

      const offsetX = pixelX + Math.cos(angle) * influence * strength;
      const offsetY = pixelY + Math.sin(angle) * influence * strength;

      // Sample and apply pixel shift
    }
  }
};
```

**Ripple Effect on Click**:
- Origin: Click position
- Expand: Linear expansion from 0 to 300px radius over 0.6s
- Amplitude: Sine wave modulation (starts high, fades)
- Multiple ripples: Store active ripples in array, overlap is fine
- Color: White or accent color, semi-transparent

**Visual Setup**:
- Image: Portfolio piece or decorative image (400x300px)
- Hover area: Larger than image (overflow capture)
- Background: Dark, high contrast
- Border: Subtle glow on hover
- Text overlay: Title or description appears on hover

---

### 5. Ripple Click Effects Section
**Concept**: Material Design-style ripples emanating from click point

**Technical Implementation**:
- **Click detection**: Capture click coordinates
- **Canvas drawing**: Create ripples on HTML5 canvas overlay
- **Ripple animation**: Expand from click with decreasing opacity
- **Multiple ripples**: Queue multiple simultaneous ripples
- **Color matching**: Ripple color matches element variant
- **Duration**: 600-800ms per ripple

**Ripple Data Structure**:
```typescript
interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
  startTime: number;
  duration: number;
}
```

**Animation Loop**:
```typescript
const animateRipples = () => {
  const now = Date.now();

  ripples = ripples.filter(ripple => {
    const elapsed = now - ripple.startTime;
    const progress = Math.min(1, elapsed / ripple.duration);

    ripple.radius = ripple.maxRadius * progress;
    ripple.opacity = 1 - progress;

    // Draw ripple
    ctx.fillStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.5})`;
    ctx.beginPath();
    ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
    ctx.fill();

    return progress < 1;
  });

  if (ripples.length > 0) {
    requestAnimationFrame(animateRipples);
  }
};

element.addEventListener('click', (e) => {
  ripples.push({
    x: e.offsetX,
    y: e.offsetY,
    radius: 0,
    maxRadius: Math.max(e.offsetX, e.offsetY) * 2,
    opacity: 1,
    color: buttonColor,
    startTime: Date.now(),
    duration: 600,
  });

  animateRipples();
});
```

**Element Variants**:
1. **Buttons**: Solid buttons with ripples
2. **Cards**: Click anywhere, ripple emanates
3. **Menu items**: Ripple on click, background color change
4. **Circles/Badges**: Full ripple overflow visible

**Customization**:
- Ripple color override per element
- Duration adjustment
- Max radius adjustment
- Staggered ripple creation (delay between)

---

### 6. Drag & Drop Physics Section
**Concept**: Draggable cards with physics-based throw and collision

**Technical Implementation**:
- **Framer Motion drag**: Leverage built-in drag gesture
- **Velocity tracking**: Capture drag velocity on release
- **Inertia animation**: Continue motion with exponential decay
- **Boundary detection**: Prevent cards from leaving viewport
- **Collision**: Cards bounce off edges with energy loss
- **Magnetism**: Optional snap-to-grid or snap-to-home

**Framer Motion Implementation**:
```typescript
const [position, setPosition] = useState({ x: 0, y: 0 });

<motion.div
  drag
  dragElastic={0.2}
  onDragEnd={(event, info) => {
    // info.velocity = {x, y}
    // Calculate remaining motion with inertia
    const decayX = info.velocity.x * 0.99; // Decay per frame
    const decayY = info.velocity.y * 0.99;

    // Animate with decreasing velocity
    animate(
      [position.x, position.x + decayX * 0.5],
      (latest) => setPosition({ ...position, x: latest }),
      {
        type: 'tween',
        ease: 'easeOut',
        duration: 0.8,
      }
    );
  }}
/>
```

**Physics Parameters**:
- Initial velocity: Captured from drag gesture
- Friction: 0.95-0.99 multiplier per frame
- Bounce elasticity: 0.5-0.8 (energy loss on collision)
- Max speed: Cap velocity to prevent extreme motion
- Settle threshold: Stop animation when velocity < 0.1

**Card Layout**:
- Size: 200x150px
- Multiple cards: 4-8 cards scattered in container
- Content: Title, image, description
- Colors: Different accent colors per card

**Collision Logic**:
```typescript
const handleBoundaryCollision = (x, y, width, height) => {
  let velocityX = velocity.x;
  let velocityY = velocity.y;
  let newX = x;
  let newY = y;

  // Left/right boundaries
  if (x < 0) {
    newX = 0;
    velocityX = Math.abs(velocityX) * -0.7; // Bounce back
  }
  if (x + width > containerWidth) {
    newX = containerWidth - width;
    velocityX = -Math.abs(velocityX) * 0.7;
  }

  // Top/bottom boundaries
  if (y < 0) {
    newY = 0;
    velocityY = Math.abs(velocityY) * -0.7;
  }
  if (y + height > containerHeight) {
    newY = containerHeight - height;
    velocityY = -Math.abs(velocityY) * 0.7;
  }

  return { newX, newY, velocityX, velocityY };
};
```

---

### 7. Elastic Scroll Indicator Section
**Concept**: Custom scrollbar stretches elastically at boundaries

**Technical Implementation**:
- **Scroll listener**: Track window.scrollY in state
- **Canvas drawing**: Render scrollbar on canvas overlay
- **Elastic calculation**: Stretch amount increases near boundaries
- **Spring animation**: Smoothly animate stretch/shrink
- **Visual design**: Thin vertical bar, accent color

**Elastic Behavior**:
```typescript
const getScrollbarHeight = () => {
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  return (windowHeight / docHeight) * windowHeight;
};

const calculateElasticStretch = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = window.scrollY / maxScroll;

  let stretch = 0;

  if (window.scrollY < 0) {
    // Overscroll at top
    stretch = Math.abs(window.scrollY) * 0.3;
  } else if (window.scrollY > maxScroll) {
    // Overscroll at bottom
    stretch = (window.scrollY - maxScroll) * 0.3;
  }

  return stretch;
};
```

**Scrollbar Rendering** (Canvas):
```typescript
const drawScrollbar = (ctx) => {
  const barHeight = getScrollbarHeight();
  const stretch = calculateElasticStretch();
  const barY = (window.scrollY / maxScroll) * (height - barHeight);

  ctx.fillStyle = 'rgba(100, 200, 255, 0.8)';
  ctx.fillRect(
    width - 8,
    barY,
    8,
    barHeight + stretch
  );
};
```

**Visual Design**:
- Width: 8px (thin)
- Color: Accent color (cyan or magenta)
- Opacity: Semi-transparent (0.6-0.8)
- Background: Subtle dark track (0.1 opacity)
- Glow: Subtle shadow on hover

---

### 8. Spotlight Gallery Section
**Concept**: Images hidden in darkness, cursor acts as spotlight revealing content

**Technical Implementation**:
- **Canvas masking**: Use canvas compositing to create spotlight effect
- **Circular mask**: Draw radial gradient from cursor position
- **Clip to region**: Only reveal portion under spotlight
- **Image grid**: Multiple images arranged in gallery
- **Smooth transition**: Fade between different masks

**Canvas Spotlight Approach**:
```typescript
const drawSpotlight = (ctx, mouseX, mouseY, spotlightRadius) => {
  // Clear canvas (dark)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Create radial gradient spotlight
  const gradient = ctx.createRadialGradient(
    mouseX, mouseY, 0,
    mouseX, mouseY, spotlightRadius
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

  // Draw spotlight
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, spotlightRadius, 0, Math.PI * 2);
  ctx.fill();

  // Reset composite
  ctx.globalCompositeOperation = 'source-over';
};
```

**Image Arrangement**:
- Grid: 3x3 or 4x3 images
- Size: 200x200px each
- Images: Portfolio work, photography, or artwork
- Dark background: #0d0d0d (nearly black)

**Spotlight Parameters**:
- Radius: 80-120px (user adjustable)
- Softness: Gradient feathering
- Speed: Follows cursor smoothly (slight lag)
- Glow: Optional rim light around spotlight

**Interaction Modes**:
1. **Follow cursor**: Spotlight follows mouse in real-time
2. **Reveal on hover**: Spotlight appears on image hover
3. **Click reveal**: Permanent spotlight at click, fade on next click
4. **Animated tour**: Auto-play spotlight path through gallery

---

## Global Components

### CustomCursor Component
- **Styling**: Replaces default cursor with custom circle
- **Scaling**: Grows on interactive elements
- **Color change**: Morphs color per section
- **Label**: Text/emoji appears inside circle
- **Position**: Slightly offset from actual mouse for visual effect
- **Size ranges**: 20px (normal), 40px (hover), 60px (press)

**Cursor States**:
- Idle: Small circle, outline style
- Hover interactive: Medium circle, filled, color change
- Active drag: Large circle, glow effect
- Text selection: Line-based cursor (section-specific)

### SectionNav Component
- **Dot indicators**: Right side of viewport, one per section
- **Click to jump**: Click dot to scroll to section
- **Active indicator**: Highlight current section
- **Labels**: Tooltip on hover with section name
- **Keyboard shortcut**: Number keys (1-8) jump to section

### SectionTitle Component
- **Entry animation**: Fade in + slide up on viewport entry
- **Typography**: Large heading (H2), accent color
- **Subtitle**: Brief description below title
- **Left border**: Accent line indicating active section

---

## Animation Patterns & Easing

### Spring Easing (GSAP)
```typescript
gsap.to(element, {
  duration: 0.4,
  ease: 'back.out',  // or elastic.out, expo.out
  x: 100,
  y: 50,
});
```

### Intersection Observer (Section Entry)
```typescript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Trigger entry animation
      gsap.to(entry.target, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      });
    }
  });
});
```

### Debounced Mouse Events
```typescript
let rafId: number | null = null;

const handleMouseMove = (e: MouseEvent) => {
  if (rafId) cancelAnimationFrame(rafId);

  rafId = requestAnimationFrame(() => {
    setMousePos({ x: e.clientX, y: e.clientY });
  });
};
```

---

## Styling & Color Scheme

### Color Palette
- **Base dark**: #0f0f0f (background)
- **Section accents**:
  1. Magnetic: Cyan (#00ffff)
  2. Trail: Cyan / Magenta (#ff00ff)
  3. Text: Lime green (#00ff00)
  4. Distortion: Orange (#ff6600)
  5. Ripple: Magenta (#ff00ff)
  6. Drag: Cyan (#00ffff)
  7. Scroll: Cyan (#00ffff)
  8. Spotlight: White accent on dark
- **Text**: White (#ffffff) on dark
- **Shadows**: Dark with section color tint

### Typography
- **Heading font**: Syne (bold, geometric)
- **Body font**: Plus Jakarta Sans (clean, readable)
- **Code font**: Monospace (if code samples)
- **Sizes**: H1 (4rem), H2 (2.5rem), body (1rem)

### Spacing & Layout
- **Section height**: Full viewport (100vh)
- **Padding**: 40-60px horizontal, 80-120px vertical
- **Gap**: 20-40px between elements
- **Container**: Max-width 1200px, centered

---

## Performance Optimization

### Techniques
- **requestAnimationFrame**: All animations use RAF
- **GPU acceleration**: transform and opacity only
- **Debouncing**: Mouse events debounced (16ms)
- **Canvas optimization**: Use offscreen canvas for complex rendering
- **Event delegation**: Single listener for multiple elements
- **Lazy loading**: Sections load on viewport entry

### Lighthouse Targets
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **CLS**: < 0.1
- **Performance score**: 90+

---

## Accessibility

- **Keyboard navigation**: Tab through sections, arrow keys to navigate
- **Reduced motion**: Respect `prefers-reduced-motion` (disable animations)
- **Contrast**: WCAG AA minimum (4.5:1)
- **Focus indicators**: Visible outline on all interactive elements
- **Screen readers**: Semantic HTML, aria-labels

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

---

## Deployment & Hosting

- **Vercel**: One-click deploy
- **Build time**: < 1 minute
- **Bundle size**: ~150KB JS (gzipped)
- **Performance optimized**: Tree-shaking, code-splitting

---

## Future Enhancements

- Sound effects (click feedback, hover tones)
- Keyboard control variations
- Mobile touch gestures
- VR/AR integration
- Recording/export demo videos
- Customizable theme builder
- Social sharing (screenshot + code)
- Interactive code editor
