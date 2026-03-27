"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("@/components/layout/MainLayout"), {
  ssr: false,
});

export default function Home() {
  return <App />;
}
