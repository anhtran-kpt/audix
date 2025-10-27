"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyLinkButtonProps = {
  className?: string;
  iconClassName?: string;
};

export const CopyLinkButton = ({
  className,
  iconClassName,
}: CopyLinkButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={cn("", className)}
    >
      {copied ? (
        <CopyCheckIcon className={cn("size-5", iconClassName)} />
      ) : (
        <CopyIcon className={cn("size-5", iconClassName)} />
      )}
    </Button>
  );
};
