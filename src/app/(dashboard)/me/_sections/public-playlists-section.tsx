import PlaylistGrid from "@/components/shared/playlist-grid";
import SectionHeading from "@/components/ui/section-heading";
import { PlaylistItem } from "@/features/playlist/contracts/playlist-dto";

type PublicPlaylistsSectionProps = {
  playlists: PlaylistItem[];
};

export const PublicPlaylistSection = ({
  playlists,
}: PublicPlaylistsSectionProps) => {
  return (
    <section>
      <SectionHeading title="Public Playlists" />
      <PlaylistGrid playlists={playlists} />
    </section>
  );
};
