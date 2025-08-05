"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const ItemTitle = ({
  title,
  isActive,
}: {
  title: string;
  isActive?: boolean;
}) => {
  return (
    <p
      className={cn(
        "font-medium truncate text-foreground text-[calc(15rem/16)]",
        isActive && "text-primary"
      )}
    >
      {title}
    </p>
  );
};

// export const TitleSkeleton = () => {
//   return <Skeleton className="h-4 w-32" />;
// };
