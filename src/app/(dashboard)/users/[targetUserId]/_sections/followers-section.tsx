"use client";

import UserGrid from "@/components/shared/user-grid";
import SectionHeading from "@/components/ui/section-heading";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

export const FollowersSection = ({ userId }: { userId: string }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);
  const { data, status } = useQuery({
    ...userQueryOptions.followers(userId, { limit }),
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
        showAllHref={
          data.pagination.hasMore ? `/users/${userId}/followers` : undefined
        }
      />
      <UserGrid users={data.items} />
    </section>
  );
};
