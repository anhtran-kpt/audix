import { PlayIcon } from "lucide-react";
import { IconButton } from "./icon-button";
import { cn } from "@/lib/utils";

interface PlayButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function PlayButton({ onClick, className }: PlayButtonProps) {
  return (
    <IconButton
      icon={PlayIcon}
      onClick={onClick}
      size="xl"
      className={cn("bg-primary p-3", className)}
      iconClassName="stroke-0 fill-white"
      tooltipContent="Play"
    />
  );
}
