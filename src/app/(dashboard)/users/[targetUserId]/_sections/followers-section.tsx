"use client";

import UserGrid from "@/components/shared/user-grid";
import SectionHeading from "@/components/ui/section-heading";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { useQuery } from "@tanstack/react-query";

export const FollowersSection = ({ userId }: { userId: string }) => {
  const { data: followers, status } = useQuery({
    ...userQueryOptions.followers(userId),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section>
      <SectionHeading title="Followers" />
      <UserGrid users={followers} />
    </section>
  );
};
