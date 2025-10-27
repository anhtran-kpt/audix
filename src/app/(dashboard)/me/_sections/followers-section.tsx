"use client";

import UserGrid from "@/components/shared/user-grid";
import SectionHeading from "@/components/ui/section-heading";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

export const FollowersSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);
  const { data, status } = useQuery({
    ...meQueryOptions.followers({ limit }),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section ref={sectionRef}>
      <SectionHeading
        title="Followers"
        showAllHref={data.pagination.hasMore ? `/me/followers` : undefined}
      />
      <UserGrid users={data.items} />
    </section>
  );
};
