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
import { getSidebarOverview } from "@/features/me/me-data";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAuthenticatedUser } from "@/lib/auth";
import { getOverlayData } from "@/features/shared/shared-actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  const sidebarData = await getSidebarOverview({
    userId: user.id,
    params: { limit: 5, offset: 0 },
  });

  const overlayData = await getOverlayData(user.id);

  const qc = getQueryClient();

  qc.setQueryData(["me", "overlay", "tracks"], overlayData.likedTracks);
  qc.setQueryData(["me", "overlay", "artists"], overlayData.followedArtists);
  qc.setQueryData(["me", "overlay", "albums"], overlayData.likedAlbums);
  qc.setQueryData(["me", "overlay", "playlists"], overlayData.likedPlaylists);

  console.log(
    "likedTracksMap keys:",
    Object.keys(overlayData.likedTracks).slice(0, 5)
  );

  return (
    <SidebarProvider
      className="h-full"
      style={
        {
          "--header-height": "calc(var(--spacing) * 15)",
        } as React.CSSProperties
      }
    >
      <AppSidebar initialData={sidebarData} />
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
