import { useEffect, useRef, useState } from "react";
import { audio } from "./audio";
import { store } from "./state";

// Typing effect: 28 ms per character, longer pauses after full stops
// and commas (per brief). When real voice files exist, a line will take
// exactly as long as its audio; until then this rate is the stand-in.

const CHAR_MS = 28;
const PAUSE_AFTER: Record<string, number> = { ".": 250, ",": 120, ";": 120, ":": 120, "?": 250, "!": 250 };

export function useTyping(text: string, active: boolean, onDone: () => void) {
  const [shown, setShown] = useState(0);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!active) {
      setShown(0);
      return;
    }
    if (store.get().reducedMotion) {
      setShown(text.length);
      const t = setTimeout(() => doneRef.current(), 400);
      return () => clearTimeout(t);
    }
    setShown(0);
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (store.get().paused) {
        timer = setTimeout(step, 120);
        return;
      }
      i += 1;
      setShown(i);
      if (i % 3 === 0) audio.keyTick();
      if (i >= text.length) {
        timer = setTimeout(() => doneRef.current(), 300);
        return;
      }
      const ch = text.charAt(i - 1);
      timer = setTimeout(step, CHAR_MS + (PAUSE_AFTER[ch] ?? 0));
    };
    timer = setTimeout(step, CHAR_MS);
    return () => clearTimeout(timer);
  }, [text, active]);

  return { shown, complete: shown >= text.length };
}
