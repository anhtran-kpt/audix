"use client";

import { useRightPanel } from "@/stores/use-right-panel";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";
import QueueView from "./queue-view";
import { NowPlayingView } from "./now-playing-view";

export default function RightPanel() {
  const active = useRightPanel((s) => s.active);
  const open = active !== "none";

  return (
    <Sheet open={open} modal={false}>
      <SheetContent
        aria-describedby={undefined}
        side="right"
        className="bg-sidebar group/np gap-0"
        style={{
          paddingBottom:
            "calc(env(safe-area-inset-bottom) + var(--player-offset, 0px))",
        }}
      >
        <SheetTitle className="hidden">
          {active === "now-playing" && "Now Playing"}
          {active === "queue" && "Queue"}
        </SheetTitle>
        {active === "now-playing" && <NowPlayingView />}
        {active === "queue" && <QueueView />}
      </SheetContent>
    </Sheet>
  );
}
