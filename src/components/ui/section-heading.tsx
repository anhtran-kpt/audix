import { NavLink } from "./nav-link";
import { Skeleton } from "./skeleton";

type SectionHeadingProps = {
  title: string;
  showAllHref?: string;
  isLoading?: boolean;
};

export default function SectionHeading({
  title,
  showAllHref,
  isLoading,
}: SectionHeadingProps) {
  if (isLoading) {
    return (
      <div className="flex items-end justify-between mb-4 xl:mb-6 ">
        <Skeleton className="w-36 h-8" />
        {showAllHref && <Skeleton className="w-15 h-5" />}
      </div>
    );
  }

  return (
    <div className="flex items-end justify-between mb-4 xl:mb-6 ">
      <h2 className="font-bold text-2xl select-none capitalize">{title}</h2>
      {showAllHref && <NavLink href={showAllHref}>Show all</NavLink>}
    </div>
  );
}
