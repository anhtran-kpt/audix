"use client";

import { SearchResult } from "@/features/search/contracts/search-dtos";
import TrackItem from "../track-item";
import SectionHeading from "../../ui/section-heading";
import SeeAllButton from "./see-all-button";

export default function TracksSection({
  tracks,
  q,
}: {
  tracks: SearchResult["tracks"];
  q?: string;
}) {
  return (
    <section>
      <SectionHeading
        title="Tracks"
        seeAllBtn={q && <SeeAllButton q={q} targetType="tracks" />}
      />
      <ul className="space-y-1">
        {tracks.map((track) => (
          <li key={track.id}>
            <TrackItem track={track} />
          </li>
        ))}
      </ul>
    </section>
  );
}
