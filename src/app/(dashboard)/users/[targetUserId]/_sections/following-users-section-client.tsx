"use client";

import { UserItem } from "@/components/features/entity-item/user-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { UserFollowedUsers } from "@/lib/data/user-data";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

type FollowingUsersSectionClientProps = {
  userId: string;
  initialData: UserFollowedUsers;
};
export const FollowingUsersSectionClient = ({
  userId,
  initialData,
}: FollowingUsersSectionClientProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);
  const { data } = useQuery({
    ...userQueryOptions.followingUsers(userId, { limit }),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  return (
    <Section
      title="Following Users"
      showAllHref={
        data.pagination.hasMore ? `/users/${userId}/following/users` : undefined
      }
    >
      <EntityCarousel
        data={data.items}
        renderItem={(user) => <UserItem user={user} />}
      />
    </Section>
  );
};
