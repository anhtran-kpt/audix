import { Music4Icon } from "lucide-react";

export const FallbackCoverImage = ({ type }: { type: "item" | "detail" }) => {
  return (
    <div
      className={`bg-neutral-300 dark:bg-neutral-700 aspect-square ${
        type === "item" ? "size-9 rounded-sm" : "size-56 rounded-md"
      } flex items-center justify-center`}
    >
      <Music4Icon stroke="currentColor" size={type === "item" ? 16 : 72} />
    </div>
  );
};
