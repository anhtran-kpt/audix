import { AppSidebar } from "@/components/features/app-sidebar";
import AudioPlayer from "@/components/features/audio-player";
import { Header } from "@/components/features/header";
import { PlayerOffsetSetter } from "@/components/features/player-offset-setter";
import RightPanel from "@/components/features/right-panel";
import { Footer } from "@/components/shared/footer";
import MobileAudioPlayer from "@/components/shared/mobile-audio-player";
import { NewPlaylistDialog } from "@/components/shared/new-playlist-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
      <RightPanel />
      <AudioPlayer />
      <MobileAudioPlayer />
      <NewPlaylistDialog />
    </SidebarProvider>
  );
}
