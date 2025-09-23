export const formatTime = (ms: number) => {
  if (!Number.isFinite(ms)) return "0:00";

  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);

  return `${m}:${s.toString().padStart(2, "0")}`;
};
