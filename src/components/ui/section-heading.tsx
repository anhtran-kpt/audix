import { ReactNode } from "react";
import { NavLink } from "./nav-link";

type SectionHeadingProps = {
  title: string;
  showSeeAll?: boolean;
  href?: string;
  seeAllBtn?: ReactNode;
};

export default function SectionHeading({
  title,
  showSeeAll = false,
  href,
  seeAllBtn,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between mb-6 ">
      <h2 className="font-bold text-2xl select-none capitalize">{title}</h2>
      {showSeeAll && href && <NavLink href={href}>Show all</NavLink>}
      {seeAllBtn}
    </div>
  );
}
