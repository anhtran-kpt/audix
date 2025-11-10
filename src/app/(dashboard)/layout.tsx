import { AppSidebar } from "@/components/features/app-sidebar";
import { AudioElement } from "@/components/features/audio-element";
import { DesktopPlayer } from "@/components/features/players/desktop-player";
import { Header } from "@/components/features/header";
import { PlayerOffsetSetter } from "@/components/features/player-offset-setter";
import RightPanel from "@/components/features/right-panel";
import { NewPlaylistDialog } from "@/components/shared/new-playlist-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MobilePlayer } from "@/components/features/players/mobile-player";
import {
  getMyFollowedArtistIds,
  getMyLikedAlbumIds,
  getMyLikedPlaylistIds,
  getMyLikedTrackIds,
  getSidebarOverview,
} from "@/features/me/me-data";
import { requireAuth } from "@/lib/auth";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  const data = await getSidebarOverview({
    userId: user.id,
    params: { limit: 5, offset: 0 },
  });

  const [
    likedTracksMap,
    followedArtistsMap,
    likedAlbumsMap,
    likedPlaylistsMap,
  ] = await Promise.all([
    getMyLikedTrackIds(user.id),
    getMyFollowedArtistIds(user.id),
    getMyLikedAlbumIds(user.id),
    getMyLikedPlaylistIds(user.id),
  ]);

  const qc = getQueryClient();

  qc.setQueryData(["me", "overlay", "tracks"], likedTracksMap);
  qc.setQueryData(["me", "overlay", "artists"], followedArtistsMap);
  qc.setQueryData(["me", "overlay", "albums"], likedAlbumsMap);
  qc.setQueryData(["me", "overlay", "playlists"], likedPlaylistsMap);

  return (
    <SidebarProvider
      className="h-full"
      style={
        {
          "--header-height": "calc(var(--spacing) * 15)",
        } as React.CSSProperties
      }
    >
      <AppSidebar initialData={data} />
      <SidebarInset
        className="h-full transition-[width]"
        style={{
          paddingBottom:
            "calc(env(safe-area-inset-bottom) + var(--player-offset, 0px))",
        }}
      >
        <ScrollArea viewportId="app-scroll" className="h-full">
          <Header />
          <div className="flex flex-col flex-1 p-responsive">
            <div className="@container/main flex flex-1 flex-col gap-8">
              <PlayerOffsetSetter />
              <HydrationBoundary state={dehydrate(qc)}>
                {children}
              </HydrationBoundary>
            </div>
          </div>
        </ScrollArea>
      </SidebarInset>
      <AudioElement />
      <RightPanel />
      <DesktopPlayer />
      <MobilePlayer />
      <NewPlaylistDialog />
    </SidebarProvider>
  );
}
