"use client";

import { UserItem } from "@/components/features/entity-item/user-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { meQueryOptions } from "@/features/me/api/me-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { MyFollowedUsers } from "@/lib/data/me-data";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

type FollowingUsersSectionClient = {
  initialData: MyFollowedUsers;
};
export const FollowingUsersSectionClient = ({
  initialData,
}: FollowingUsersSectionClient) => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);
  const { data } = useQuery({
    ...meQueryOptions.followedUsers({ limit }),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  return (
    <Section
      title="Following Users"
      showAllHref={data.pagination.hasMore ? `/me/following/users` : undefined}
    >
      <EntityCarousel
        data={data.items}
        renderItem={(user) => <UserItem user={user} />}
      />
    </Section>
  );
};
