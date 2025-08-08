// components/LayoutWithPlayer.tsx
"use client";

import { useCurrentTrack } from "@/hooks/use-audio-player";
import { ReactNode } from "react";

export function LayoutWithPlayer({ children }: { children: ReactNode }) {
  const currentTrack = useCurrentTrack();

  return <div className={currentTrack ? "pb-21" : ""}>{children}</div>;
}
