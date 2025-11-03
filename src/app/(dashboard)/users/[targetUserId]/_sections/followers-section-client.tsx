"use client";

import { UserItem } from "@/components/features/entity-item/user-item";
import { EntityCarousel } from "@/components/shared/entity-carousel";
import { Section } from "@/components/shared/section";
import { userQueryOptions } from "@/features/user/api/user-query-options";
import { useResponsiveLimit } from "@/hooks/use-responsive-limit";
import { UserFollowers } from "@/lib/data/user-data";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";

type FollowersSectionClientProps = {
  initialData: UserFollowers;
  userId: string;
};
export const FollowersSectionClient = ({
  userId,
  initialData,
}: FollowersSectionClientProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const limit = useResponsiveLimit(sectionRef);
  const { data } = useQuery({
    ...userQueryOptions.followers(userId, { limit }),
    initialData,
    initialDataUpdatedAt: Date.now(),
  });

  return (
    <Section
      title="Followers"
      showAllHref={
        data.pagination.hasMore ? `/users/${userId}/followers` : undefined
      }
    >
      <EntityCarousel
        data={data.items}
        renderItem={(user) => <UserItem user={user} />}
      />
    </Section>
  );
};
