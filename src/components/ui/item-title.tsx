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
        "font-medium truncate text-foreground text-sm select-none",
        isActive && "text-primary"
      )}
    >
      {title}
    </p>
  );
};
