"use client";

import { Skeleton } from "../ui/skeleton";
import { GridWrapper } from "./grid-wrapper";

export const PlaylistGridSkeleton = () => {
  return (
    <GridWrapper>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 overflow-hidden">
          <div className="relative">
            <Skeleton className="rounded-sm size-full aspect-square" />
          </div>
          <div className="flex flex-col items-start w-full min-w-0 gap-1">
            <Skeleton className="w-4/5 h-5" />
            <div className="flex text-[calc(13rem/16)] text-muted-foreground items-center gap-1.5 mt-0.5">
              <Skeleton className="w-32 h-5" />
            </div>
          </div>
        </div>
      ))}
    </GridWrapper>
  );
};
