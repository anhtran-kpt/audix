"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { IconButton } from "../ui/icon-button";

export const AppNavigation = () => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-6">
      <IconButton
        icon={ArrowLeftIcon}
        onClick={() => router.back()}
        tooltipContent="Back"
      />
      <IconButton
        icon={ArrowRightIcon}
        onClick={() => window.history.forward()}
        tooltipContent="Forward"
      />
    </div>
  );
};
