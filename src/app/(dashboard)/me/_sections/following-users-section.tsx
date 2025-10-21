"use client";

import UserGrid from "@/components/shared/user-grid";
import SectionHeading from "@/components/ui/section-heading";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";

export const FollowingUsersSection = () => {
  const limit = useResponsiveLimit();
  const { data, status } = useQuery({
    ...meQueryOptions.followedUsers({ limit }),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section>
      <SectionHeading
        title="Following Users"
        showAllHref={
          data.pagination.hasMore ? `/me/following/users` : undefined
        }
      />
      <UserGrid users={data.items} />
    </section>
  );
};
