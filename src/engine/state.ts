import { useSyncExternalStore } from "react";

// Global experience state for the slide runner. Kept outside React;
// components subscribe with useExp().

export interface TranscriptEntry {
  slide: number;
  voice: string; // V1–V4 or "—"
  text: string;
  cue?: string;
}

export type RunnerPhase = "typing" | "holding" | "waiting"; // waiting = button/branch shown

export interface ExpState {
  slideId: number;
  lineIndex: number; // which line of the current slide is active
  phase: RunnerPhase;
  paused: boolean;
  muted: boolean;
  captionsOn: boolean;
  transcriptOpen: boolean;
  reducedMotion: boolean;
  audioUnlocked: boolean;
  signal: number; // 0..1 → 5 HUD bars
  dateSol: string; // HUD readout; only values given in the script
  transcript: TranscriptEntry[];
}

const prefersReduced =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let state: ExpState = {
  slideId: 1,
  lineIndex: 0,
  phase: "typing",
  paused: false,
  muted: false,
  captionsOn: true,
  transcriptOpen: false,
  reducedMotion: prefersReduced,
  audioUnlocked: false,
  signal: 1,
  dateSol: "ARCHIVE",
  transcript: [],
};

const subs = new Set<() => void>();

export const store = {
  get: () => state,
  set: (p: Partial<ExpState>) => {
    state = { ...state, ...p };
    subs.forEach((s) => s());
  },
  subscribe: (fn: () => void) => {
    subs.add(fn);
    return () => subs.delete(fn);
  },
};

export function useExp<T>(sel: (s: ExpState) => T): T {
  return useSyncExternalStore(store.subscribe, () => sel(state), () => sel(state));
}

export function pushTranscript(e: TranscriptEntry) {
  store.set({ transcript: [...state.transcript, e] });
}
