import { CheckCircle2Icon, PlusCircleIcon } from "lucide-react";
import { Button } from "./button";

type ToggleLikeButtonProps = {
  isLiked: boolean;
} & React.ComponentProps<"button">;

export const ToggleLikeButton = ({
  isLiked,
  ...props
}: ToggleLikeButtonProps) => {
  return (
    <Button size="icon" variant="ghost" {...props}>
      {isLiked ? (
        <CheckCircle2Icon className="size-7 fill-primary stroke-primary [&>path]:stroke-foreground [&>path]:scale-115 [&>path]:origin-center" />
      ) : (
        <PlusCircleIcon className="size-7" />
      )}
    </Button>
  );
};
