import { AppSidebar } from "@/components/features/app-sidebar";
import AudioPlayer from "@/components/features/audio-player";
import { Header } from "@/components/features/header";
import { PlayerOffsetSetter } from "@/components/features/player-offset-setter";
import RightPanel from "@/components/features/right-panel";
import { NewPlaylistDialog } from "@/components/shared/new-playlist-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getLibraryPlaylists,
  getMyFollowedArtists,
  getMyLikedAlbums,
} from "@/features/me/data-access/me-repo";
import { getUserIdOrThrow } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getUserIdOrThrow();

  const [artists, playlists, albums] = await Promise.all([
    getMyFollowedArtists(userId),
    getLibraryPlaylists(userId),
    getMyLikedAlbums(userId),
  ]);

  return (
    <SidebarProvider
      className="h-full"
      style={
        {
          "--header-height": "calc(var(--spacing) * 15)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        initialArtists={artists}
        initialPlaylists={playlists}
        initialAlbums={albums}
      />
      <SidebarInset
        className="h-full transition-[width]"
        style={{
          paddingBottom:
            "calc(env(safe-area-inset-bottom) + var(--player-offset, 0px))",
        }}
      >
        <ScrollArea viewportId="app-scroll" className="h-full">
          <Header />
          <div className="flex flex-col flex-1 p-6 md:p-8 lg:p-10 xl:p-12">
            <div className="@container/main flex flex-1 flex-col gap-8">
              <PlayerOffsetSetter />
              {children}
            </div>
          </div>
        </ScrollArea>
      </SidebarInset>
      <RightPanel />
      <AudioPlayer />
      <NewPlaylistDialog />
    </SidebarProvider>
  );
}
