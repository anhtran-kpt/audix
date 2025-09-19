"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { HeaderButton } from "../shared/header-button";

export const AppNavigation = () => {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <HeaderButton icon={ArrowLeftIcon} onClick={() => router.back()} />
      <HeaderButton
        icon={ArrowRightIcon}
        onClick={() => window.history.forward()}
      />
    </div>
  );
};
