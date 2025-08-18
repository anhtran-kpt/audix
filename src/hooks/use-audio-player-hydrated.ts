import { useEffect, useState } from "react";
import { useAudioStore } from "@/stores/use-audio-store";

export function useAudioPlayerHydrated() {
  const [hydrated, setHydrated] = useState(
    () => (useAudioStore as any).persist?.hasHydrated?.() ?? false
  );

  useEffect(() => {
    const api = (useAudioStore as any).persist;
    if (!api) return;
    if (api.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return api.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}
