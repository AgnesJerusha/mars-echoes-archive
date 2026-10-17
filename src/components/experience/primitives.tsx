import { motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { audio } from "@/lib/audio";
import { store, useExp, type Mood } from "@/lib/store";
import { cn } from "@/lib/utils";

export function Chapter({
  id, label, mood, storm = 0, dark = 0, signal = 1, className, children,
}: { id: string; label: string; mood: Mood; storm?: number; dark?: number; signal?: number; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        const cur = store.get();
        const patch: Record<string, unknown> = { chapter: label, dark, signal };
        if (mood !== "storm") patch.storm = storm;
        store.set(patch);
        if (audio.mood !== mood && !(cur.chapter === label)) audio.setMood(mood);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [label, mood, storm, dark, signal]);
  return (
    <section ref={ref} id={id} className={cn("relative min-h-screen w-full", className)}>
      {children}
    </section>
  );
}

export function ChapterTag({ n, title }: { n: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1.6 }}
      className="telemetry flex items-center gap-4 text-holo/80"
    >
      <span className="h-px w-10 bg-holo/50" />
      <span>Chapter {n}</span>
      <span className="text-foreground/40">//</span>
      <span className="text-foreground/80">{title}</span>
    </motion.div>
  );
}

/** Opportunity's voice. Lines fade in one after another. */
export function Voice({ lines, className, gap = 1.4 }: { lines: string[]; className?: string; gap?: number }) {
  return (
    <div className={cn("space-y-4", className)}>
      {lines.map((l, i) => (
        <motion.p
          key={l}
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.8, delay: i * gap, ease: [0.2, 0.7, 0.2, 1] }}
          className="narration text-3xl text-signal md:text-5xl"
        >
          “{l}”
        </motion.p>
      ))}
    </div>
  );
}

export function Datum({ k, v, className }: { k: string; v: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, delay: 0.4 }}
      className={cn("border-l border-holo/40 pl-3", className)}
    >
      <div className="telemetry text-[0.6rem] text-holo/70">{k}</div>
      <div className="mt-1 text-sm text-foreground/90">{v}</div>
    </motion.div>
  );
}

export function HUD() {
  const { chapter, signal, muted } = useExp((s) => s);
  const bars = Math.round(signal * 5);
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-40 scanlines opacity-60" />
      <div className="pointer-events-none fixed -inset-[10%] z-40 grain" />
      <div className="pointer-events-none fixed inset-0 z-40 vignette" />
      <div className="pointer-events-none fixed left-6 top-6 z-50 telemetry text-foreground/60">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-mars blink" /> REC · MER-B
        </div>
        <div className="mt-2 text-holo/70">{chapter}</div>
      </div>
      <div className="fixed right-6 top-6 z-50 flex items-center gap-6 telemetry text-foreground/60">
        <div className="flex items-end gap-0.5" aria-label={`signal ${bars} of 5`}>
          {[1, 2, 3, 4, 5].map((b) => (
            <span key={b} className={cn("w-1 transition-colors", b <= bars ? "bg-holo" : "bg-foreground/15")} style={{ height: 3 + b * 3 }} />
          ))}
        </div>
        <button
          className="pointer-events-auto hover:text-signal"
          onClick={() => {
            audio.setMuted(!muted);
            store.set({ muted: !muted });
          }}
        >
          {muted ? "[ sound off ]" : "[ sound on ]"}
        </button>
      </div>
    </>
  );
}
