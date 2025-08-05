"use client";

import { SongGrid } from "@/components/features/song-grid";
import SectionHeading from "@/components/ui/section-heading";

export const PopularSongsSection = ({ songs }: { artistSlug: string }) => {
  return (
    <section>
      <SectionHeading heading="Popular" />
      <SongGrid type="popular" songs={songs} />
    </section>
  );
};
