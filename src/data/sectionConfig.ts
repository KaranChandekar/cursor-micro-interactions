export interface SectionConfig {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  index: number;
}

export const sections: SectionConfig[] = [
  {
    id: "magnetic",
    title: "Magnetic Buttons",
    subtitle: "Buttons that pull toward your cursor with spring physics",
    accent: "#00ffff",
    index: 0,
  },
  {
    id: "trail",
    title: "Cursor Trail",
    subtitle: "Canvas-based particle trail following your movement",
    accent: "#ff00ff",
    index: 1,
  },
  {
    id: "repulsion",
    title: "Text Repulsion",
    subtitle: "Characters push away from your cursor position",
    accent: "#00ff00",
    index: 2,
  },
  {
    id: "distortion",
    title: "Image Distortion",
    subtitle: "Hover displacement with ripple click effects",
    accent: "#ff6600",
    index: 3,
  },
  {
    id: "ripple",
    title: "Ripple Click",
    subtitle: "Material Design ripples emanating from click point",
    accent: "#ff00ff",
    index: 4,
  },
  {
    id: "drag",
    title: "Drag & Drop Physics",
    subtitle: "Throw cards with velocity and watch them bounce",
    accent: "#00ffff",
    index: 5,
  },
  {
    id: "scroll",
    title: "Elastic Scroll",
    subtitle: "Custom scrollbar with elastic stretch at boundaries",
    accent: "#00ffff",
    index: 6,
  },
  {
    id: "spotlight",
    title: "Spotlight Gallery",
    subtitle: "Images revealed under a circular spotlight",
    accent: "#ffffff",
    index: 7,
  },
];
