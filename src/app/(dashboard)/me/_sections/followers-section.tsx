"use client";

import UserGrid from "@/components/shared/user-grid";
import SectionHeading from "@/components/ui/section-heading";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useQuery } from "@tanstack/react-query";

export const FollowersSection = () => {
  const { data: followers, status } = useQuery({
    ...meQueryOptions.followers(),
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
