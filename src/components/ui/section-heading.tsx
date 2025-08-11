import { NavLink } from "./nav-link";

interface SectionHeadingProps {
  title: string;
  hasShowAll?: boolean;
  href?: string;
}

export default function SectionHeading({
  title,
  hasShowAll = false,
  href,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between mb-6 ">
      <h2 className="font-bold text-2xl select-none capitalize">{title}</h2>
      {hasShowAll && href && <NavLink href={href}>Show all</NavLink>}
    </div>
  );
}
