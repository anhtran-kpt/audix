import prettyMs from "pretty-ms";

export const formatTime = (ms: number) => {
  if (!Number.isFinite(ms)) return "0:00";

  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);

  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const formatDuration = (sec: number) => {
  return prettyMs(sec * 1000, {
    colonNotation: true,
    secondsDecimalDigits: 0,
  });
};
