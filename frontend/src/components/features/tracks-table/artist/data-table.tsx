"use client";

import { useIsMobile } from "@/features/shared/hooks/use-mobile";
import { usePlaybackStore } from "@/stores/use-playback-store";
import { TrackItem } from "@/features/track/track-types";
import { TrackListContextType } from "@/lib/constants";
import { DataTableBase } from "@/components/ui/data-table-base";
import { columns } from "./columns";

const COLUMN_VISIBILITY_CONFIG = {
  index: "sm",
  plays: "md",
  duration: "sm",
} as const;

export function DataTable({
  data,
  contextId,
  contextType,
}: {
  data: TrackItem[];
  contextId: string;
  contextType: TrackListContextType;
}) {
  const isMobile = useIsMobile();
  const start = usePlaybackStore((s) => s.start);

  const handleRowClick = (track: TrackItem) => {
    if (!isMobile) return;
    start({
      contextId,
      contextType,
      startTrackId: track.id,
    });
  };

  return (
    <DataTableBase
      columns={columns}
      data={data}
      onRowClick={handleRowClick}
      columnVisibilityConfig={COLUMN_VISIBILITY_CONFIG}
      emptyMessage="No songs found."
      showHeader={false}
    />
  );
}
