# Cursor Micro-Interactions Showcase

A single-page interactive showcase of 8 cursor-driven micro-interactions built with Next.js, Framer Motion, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-purple?logo=framer)

## Interactions

| # | Section | Effect |
|---|---------|--------|
| 1 | **Magnetic Buttons** | Buttons pull toward the cursor with spring physics |
| 2 | **Cursor Trail** | Canvas-based particle trail following mouse movement |
| 3 | **Text Repulsion** | Characters push away from the cursor position |
| 4 | **Image Distortion** | Hover displacement with ripple click effects on canvas |
| 5 | **Ripple Click** | Material Design ripples emanating from click point |
| 6 | **Drag & Drop Physics** | Throw cards with velocity and watch them bounce |
| 7 | **Elastic Scroll** | Custom scrollbar with elastic stretch at boundaries |
| 8 | **Spotlight Gallery** | Images revealed under a circular spotlight cursor |

## Features

- Custom animated cursor with section-aware accent colors
- Dot navigation for quick section jumping
- Intersection Observer reveal animations
- Dark theme with Syne + Plus Jakarta Sans typography
- Fully responsive layout

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion
- **Canvas:** HTML5 Canvas API for trail, distortion, and spotlight effects
