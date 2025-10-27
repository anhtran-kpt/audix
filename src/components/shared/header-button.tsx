import { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface HeaderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
}

export const HeaderButton = ({ icon: Icon, ...props }: HeaderButtonProps) => {
  return (
    <Button
      variant="secondary"
      size="icon"
      {...props}
      className={cn(
        "rounded-full bg-muted/60 hover:bg-primary p-2",
        props.className
      )}
    >
      <Icon className="size-5" />
    </Button>
  );
};
