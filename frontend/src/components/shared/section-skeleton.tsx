"use client";

import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";

export const SectionSkeleton = ({
  childSkeleton,
}: {
  childSkeleton: ReactNode;
}) => {
  return (
    <section>
      <div className="flex items-end justify-between mb-4 xl:mb-6 ">
        <Skeleton className="w-36 h-8" />
        <Skeleton className="w-15 h-5" />
      </div>
      {childSkeleton}
    </section>
  );
};
