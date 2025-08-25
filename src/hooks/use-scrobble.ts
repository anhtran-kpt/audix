"use client";

import { useEffect, useRef } from "react";
import { useAudioStore } from "@/stores/use-audio-store";
import { useShallow } from "zustand/react/shallow";
import { postApi } from "@/lib/http/request";
import { HistoryEvent } from "@/contracts/playback";

export function useScrobble() {
  const { nowPlayingRef, listenedSec, durationSec, audioElement } =
    useAudioStore(
      useShallow((s) => ({
        nowPlayingRef: s.nowPlayingRef,
        listenedSec: s.currentTime,
        durationSec: s.duration,
        audioElement: s.audioElement,
      }))
    );

  useEffect(() => {
    fetch("/api/ensure-guest").catch(() => {});
  }, []);

  const scrobbledTrackIdRef = useRef<string | null>(null);
  useEffect(() => {
    scrobbledTrackIdRef.current = null;
  }, [nowPlayingRef?.id]);

  const sendHistory = (ev: HistoryEvent) => {
    const payload = JSON.stringify({ events: [ev] });
    const blob = new Blob([payload], { type: "application/json" });
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const ok = navigator.sendBeacon("/api/playback/history", blob);
      if (!ok) {
        void postApi("/api/playback/history", { events: [ev] });
      }
    } else {
      void postApi("/api/playback/history", { events: [ev] });
    }
  };

  useEffect(() => {
    const id = nowPlayingRef?.id;
    if (!id || !durationSec) return;
    if (scrobbledTrackIdRef.current === id) return;

    if (
      typeof document !== "undefined" &&
      document.visibilityState !== "visible"
    )
      return;

    const threshold = Math.min(30, durationSec * 0.5);
    if (listenedSec >= threshold) {
      scrobbledTrackIdRef.current = id;
      const ev: HistoryEvent = {
        trackId: id,
        listenedSec: Math.floor(listenedSec),
        playedAt: new Date().toISOString(),
      };
      sendHistory(ev);
    }
  }, [nowPlayingRef?.id, listenedSec, durationSec]);

  useEffect(() => {
    if (!audioElement) return;

    const onEnded = () => {
      const id = nowPlayingRef?.id;
      if (!id) return;
      if (scrobbledTrackIdRef.current === id) return;

      if (
        typeof document !== "undefined" &&
        document.visibilityState !== "visible"
      )
        return;

      scrobbledTrackIdRef.current = id;
      const ev: HistoryEvent = {
        trackId: id,
        listenedSec: Math.floor(durationSec || 0),
        playedAt: new Date().toISOString(),
      };
      sendHistory(ev);
    };

    audioElement.addEventListener("ended", onEnded);
    return () => audioElement.removeEventListener("ended", onEnded);
  }, [audioElement, nowPlayingRef?.id, durationSec]);
}
