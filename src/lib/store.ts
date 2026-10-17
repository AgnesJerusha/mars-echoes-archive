import { useSyncExternalStore } from "react";

export type Mood = "opening" | "surface" | "explore" | "comms" | "swell" | "storm" | "final" | "silence" | "ending";

export type ExpState = {
  chapter: string;
  storm: number; // 0..1 drives 3D dust + visibility
  dark: number; // 0..1 fades the 3D world away
  signal: number; // 0..1 HUD signal strength
  muted: boolean;
};

let state: ExpState = { chapter: "ARCHIVE", storm: 0, dark: 1, signal: 1, muted: false };
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
