import { Button } from "../ui/button";

export const ContextPlayButton = () => {
  return (
    <Button
      onClick={() => handlePlay(context)}
      className="absolute bottom-2 right-2 opacity-0 translate-y-2 scale-95 transition-all duration-400 group-hover/large-cover:opacity-100 group-hover/large-cover:translate-y-0 group-hover/large-cover:scale-100"
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </Button>
  );
};
