"use client";

import UserGrid from "@/components/shared/user-grid";
import SectionHeading from "@/components/ui/section-heading";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { useQuery } from "@tanstack/react-query";

export const FollowingUsersSection = ({ userId }: { userId: string }) => {
  const { data: users, status } = useQuery({
    ...userQueryOptions.followingUsers(userId),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <section>
      <SectionHeading title="Following Users" />
      <UserGrid users={users} />
    </section>
  );
};
