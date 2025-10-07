import { NavLink } from "./nav-link";

type SectionHeadingProps = {
  title: string;
  showAllHref?: string;
};

export default function SectionHeading({
  title,
  showAllHref,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between mb-6 ">
      <h2 className="font-bold text-2xl select-none capitalize">{title}</h2>
      {showAllHref && <NavLink href={showAllHref}>Show all</NavLink>}
    </div>
  );
}
