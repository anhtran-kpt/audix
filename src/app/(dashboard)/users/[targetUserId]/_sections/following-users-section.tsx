"use client";

import UserGrid from "@/components/shared/user-grid";
import SectionHeading from "@/components/ui/section-heading";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { useQuery } from "@tanstack/react-query";

export const FollowingUsersSection = ({ userId }: { userId: string }) => {
  const limit = useResponsiveLimit();
  const { data, status } = useQuery({
    ...userQueryOptions.followingUsers(userId, { limit }),
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
          data.pagination.hasMore
            ? `/users/${userId}/following/users`
            : undefined
        }
      />
      <UserGrid users={data.items} />
    </section>
  );
};
