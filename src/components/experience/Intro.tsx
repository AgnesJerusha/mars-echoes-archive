import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { audio } from "@/lib/audio";
import { store } from "@/lib/store";

const LOGS = [
  "> mounting /dsn/archive/MER-B ...",
  "> recovered telemetry ........ 5111 sols",
  "> recovered imagery .......... 228,771 frames",
  "> recovered logs ............. OK",
  "> recovered voice data ....... PARTIAL",
  "> decrypting ...",
];

type Phase = "locked" | "boot" | "hello" | "title";

export function Intro({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<Phase>("locked");
  const [shown, setShown] = useState(0);
  const [hello, setHello] = useState(0);

  useEffect(() => {
    if (phase !== "boot") return;
    if (shown < LOGS.length) {
      const t = setTimeout(() => { setShown((s) => s + 1); audio.blip(600 + shown * 90, 0.05, 0.05); }, 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { audio.burst(1.4, 0.3); setPhase("hello"); }, 1200);
    return () => clearTimeout(t);
  }, [phase, shown]);

  useEffect(() => {
    if (phase !== "hello") return;
    const steps = [1200, 3200, 6200];
    const ts = steps.map((ms, i) => setTimeout(() => {
      if (i < 2) setHello(i + 1);
      else { setPhase("title"); store.set({ dark: 0.35 }); audio.setMood("surface", 6); }
    }, ms));
    return () => ts.forEach(clearTimeout);
  }, [phase]);

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center"
      onClick={() => {
        if (phase !== "locked") return;
        audio.init();
        audio.setMood("opening", 1);
        setPhase("boot");
      }}
      style={{ cursor: phase === "locked" ? "pointer" : "default" }}
      exit={{ opacity: 0, transition: { duration: 2 } }}
    >
      <div className="absolute inset-0 bg-void transition-opacity duration-[4000ms]" style={{ opacity: phase === "title" ? 0.25 : 1 }} />
      <AnimatePresence mode="wait">
        {(phase === "locked" || phase === "boot") && (
          <motion.div key="boot" exit={{ opacity: 0, filter: "blur(6px)" }} transition={{ duration: 0.8 }} className="relative w-[min(560px,90vw)] text-sm text-foreground/80">
            <div className="telemetry text-signal">
              Transmission archive recovered<span className="blink ml-1">▌</span>
            </div>
            <div className="mt-8 space-y-2 text-xs text-holo/80">
              {LOGS.slice(0, shown).map((l) => (
                <motion.div key={l} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>{l}</motion.div>
              ))}
            </div>
            {phase === "locked" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.7, 0.3, 0.7] }} transition={{ delay: 1.5, duration: 3, repeat: Infinity }} className="telemetry mt-16 text-foreground/50">
                [ click anywhere to decrypt · sound recommended ]
              </motion.div>
            )}
          </motion.div>
        )}
        {phase === "hello" && (
          <motion.div key="hello" exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="relative space-y-6 text-center">
            {hello >= 1 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="narration text-4xl md:text-6xl">“Hello?”</motion.p>}
            {hello >= 2 && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="narration text-2xl text-foreground/70 md:text-4xl">“I don’t think we’ve met.”</motion.p>}
          </motion.div>
        )}
        {phase === "title" && (
          <motion.div key="title" className="relative text-center">
            <motion.h1 initial={{ opacity: 0, letterSpacing: "0.2em" }} animate={{ opacity: 1, letterSpacing: "0.5em" }} transition={{ duration: 5, ease: "easeOut" }} className="pl-[0.5em] text-4xl font-light text-signal md:text-7xl">
              OPPORTUNITY
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 2 }} className="telemetry mt-6 text-amber/80">2004 — 2018</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5, duration: 2 }} className="narration mt-10 text-2xl text-foreground/80">Meet me on Mars.</motion.p>
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 5, duration: 2 }}
              onClick={() => { audio.blip(440, 0.4, 0.1); onEnter(); }}
              className="telemetry group mt-14 border border-holo/40 px-8 py-4 text-holo transition-all hover:border-holo hover:bg-holo/10 hover:text-signal"
            >
              Enter transmission <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
