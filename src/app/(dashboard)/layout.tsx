import { AppSidebar } from "@/components/features/app-sidebar";
import { AudioElement } from "@/components/features/audio-element";
import { DesktopPlayer } from "@/components/features/players/desktop-player";
import { Header } from "@/components/features/header";
import { PlayerOffsetSetter } from "@/components/features/player-offset-setter";
import RightPanel from "@/components/features/right-panel";
import { Footer } from "@/components/shared/footer";
import { NewPlaylistDialog } from "@/components/shared/new-playlist-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { MobilePlayer } from "@/components/features/players/mobile-player";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      className="h-full"
      style={
        {
          "--header-height": "calc(var(--spacing) * 15)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
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
              {children}
            </div>
          </div>
          <Footer />
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
