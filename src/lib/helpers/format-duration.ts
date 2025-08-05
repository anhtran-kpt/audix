import prettyMs from "pretty-ms";

export function formatDuration(sec: number): string {
  return prettyMs(sec * 1000, {
    colonNotation: true,
    secondsDecimalDigits: 0,
  });
}
