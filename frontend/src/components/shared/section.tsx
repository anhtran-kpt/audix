"use client";

import { ReactNode } from "react";
import { NavLink } from "../ui/nav-link";

type SectionProps = {
  title: string;
  showAllHref?: string;
  children: ReactNode;
};
export const Section = ({ title, showAllHref, children }: SectionProps) => {
  return (
    <section>
      <div className="flex items-end justify-between mb-4 xl:mb-6 ">
        <h2 className="font-bold text-2xl select-none capitalize">{title}</h2>
        {showAllHref && <NavLink href={showAllHref}>Show all</NavLink>}
      </div>
      {children}
    </section>
  );
};
