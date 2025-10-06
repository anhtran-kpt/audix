"use client";

import { useResponsiveLimit } from "@/hooks/use-reponsive-limit";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import SectionHeading from "../ui/section-heading";
import { GridWrapper } from "./grid-wrapper";

type SectionProps<TData> = {
  getQueryOptions: (limit: number) => UseQueryOptions<TData>;
  title: string;
  seeAllHref: string;
  renderItem: () => void;
};

export function Section<TData>({
  getQueryOptions,
  title,
  seeAllHref,
  renderItem,
}: SectionProps<TData>) {
  const limit = useResponsiveLimit();

  const { data, isLoading } = useQuery(getQueryOptions(limit));

  const showSeeAll = data && data.total > data.items.length;

  return (
    <section className="space-y-4">
      <SectionHeading title={title} showSeeAll={showSeeAll} href={seeAllHref} />
      {isLoading ? (
        <SkeletonGrid count={limit} />
      ) : (
        <GridWrapper>{data.items.map(renderItem)}</GridWrapper>
      )}
    </section>
  );
}
