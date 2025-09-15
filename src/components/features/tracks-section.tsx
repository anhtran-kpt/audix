"use client";

import { SearchResult } from "@/features/search/contracts/search-dtos";
import TrackItem from "./track-item";
import SectionHeading from "../ui/section-heading";

export default function TrackSection({
  tracks,
}: {
  tracks: SearchResult["tracks"];
}) {
  return (
    <section>
      <SectionHeading title="Tracks" />
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
