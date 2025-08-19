"use client";

import { useQuery } from "@tanstack/react-query";

export default function RecentlyTracks({ limit = 30 }: { limit?: number }) {
  return null;
  // const { data, isLoading, error } = useQuery({
  //   queryKey: qk.recently.tracks(limit),
  //   queryFn: () => fetchRecentlyTracks(limit),
  // });

  // if (isLoading) return <div>Loading…</div>;
  // if (error) return <div>Failed</div>;

  // return (
  //   <ul>
  //     {data!.map((t) => (
  //       <li key={t.id}>{t.title}</li>
  //     ))}
  //   </ul>
  // );
}
