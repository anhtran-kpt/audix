import { useEffect, useState } from "react";
import { useRightPanel } from "@/stores/use-right-panel";

export function useRightPanelHydrated() {
  const [ready, setReady] = useState(
    () => (useRightPanel as any).persist?.hasHydrated?.() ?? false
  );
  useEffect(() => {
    const api = (useRightPanel as any).persist;
    if (!api) return;
    if (api.hasHydrated()) return setReady(true);
    return api.onFinishHydration(() => setReady(true));
  }, []);
  return ready;
}
