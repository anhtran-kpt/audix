"use client";

import UserGrid from "@/components/shared/user-grid";
import SectionHeading from "@/components/ui/section-heading";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useQuery } from "@tanstack/react-query";

export const FollowingUsersSection = () => {
  const { data: users, status } = useQuery({
    ...meQueryOptions.followedUsers(),
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
