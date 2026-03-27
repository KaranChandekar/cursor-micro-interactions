import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cursor Micro-Interactions Showcase",
  description:
    "8 advanced cursor-driven effects and micro-interactions with smooth animations and physics-based motion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
