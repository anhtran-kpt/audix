import WaveForm from "../ui/wave-form";
import { RowPlayButton } from "./row-play-button";
import { StartPlaybackInput } from "@/features/playback/contracts/playback-dto";

export default function TrackIndexCell({
  isPlaying,
  isThisTrack,
  index,
  context,
}: {
  isPlaying: boolean;
  isThisTrack: boolean;
  index: number;
  context: StartPlaybackInput;
}) {
  if (isPlaying && isThisTrack) {
    return (
      <>
        <div className="group-hover:hidden">
          <WaveForm />
        </div>
        <div className="hidden group-hover:block">
          <RowPlayButton
            context={context}
            className="hidden group-hover:block"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <span className="group-hover:hidden">{index + 1}</span>
      <RowPlayButton context={context} className="hidden group-hover:block" />
    </>
  );
}
