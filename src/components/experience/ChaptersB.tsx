import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { audio } from "@/lib/audio";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Chapter, ChapterTag, Datum, Voice } from "./primitives";

const ROUTE = "M40 40 C 70 60, 90 80, 110 120 S 150 190, 190 230 S 260 300, 300 320 S 360 360, 420 400 S 470 450, 520 470 L 560 520";

export function Marathon() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const len = useTransform(scrollYProgress, [0, 0.75], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [2.4, 0.85]);
  const [km, setKm] = useState(0);
  useMotionValueEvent(len, "change", (v) => setKm(v * 45.16));
  return (
    <Chapter id="marathon" label="ODOMETRY" mood="explore" dark={0.9}>
      <div ref={ref} className="h-[260vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-8">
          <motion.svg style={{ scale }} viewBox="0 0 600 560" className="absolute h-[80vh] w-auto opacity-90">
            <path d={ROUTE} fill="none" className="stroke-foreground/10" strokeWidth="2" />
            <motion.path d={ROUTE} fill="none" className="stroke-amber" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: len }} />
            <circle cx="40" cy="40" r="5" className="fill-holo" />
            <text x="52" y="36" fontSize="10" className="fill-holo telemetry">EAGLE</text>
            <circle cx="560" cy="520" r="5" className="fill-mars" />
            <text x="470" y="540" fontSize="10" className="fill-mars telemetry">PERSEVERANCE VALLEY</text>
          </motion.svg>
          <div className="relative z-10 text-center">
            <ChapterTag n="06" title="The marathon" />
            <div className="mt-10 text-7xl font-extralight text-signal text-glow md:text-9xl">{km.toFixed(2)}</div>
            <div className="telemetry mt-2 text-amber">kilometres driven</div>
            {km > 42.19 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="mt-12">
                <p className="narration text-3xl md:text-5xl">“Apparently I finished a marathon.”</p>
                <p className="telemetry mt-6 text-foreground/50">42.195 km · 24 March 2015 · 11 years, 2 months</p>
                <p className="telemetry mt-2 text-foreground/40">A record for driving on another world at the time</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Chapter>
  );
}

export function MarsIsAlive() {
  const [dust, setDust] = useState(0.35);
  const [devil, setDevil] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDust((d) => Math.min(1, d + 0.012)), 400);
    return () => clearInterval(t);
  }, []);
  const power = Math.round(900 * (1 - dust * 0.92));
  return (
    <Chapter id="weather" label="ATMOSPHERE · SOLAR ARRAY" mood="surface" dark={0.55} className="flex items-center px-8 py-32 md:px-24">
      <div className="grid w-full items-center gap-16 lg:grid-cols-2">
        <div>
          <ChapterTag n="07" title="Mars is alive" />
          <Voice className="mt-12" lines={["Sometimes Mars helped me.", "Not often.", "But sometimes."]} />
          <p className="mt-10 max-w-md text-sm leading-relaxed text-foreground/60">
            Dust settled on my solar panels every day. Then, without warning, a passing whirlwind would sweep them clean. Engineers called these “cleaning events.”
          </p>
        </div>
        <div className="holo-panel relative overflow-hidden p-8">
          <div className="telemetry flex justify-between text-foreground/60">
            <span>Solar array</span>
            <span className={cn(power < 300 ? "text-mars" : "text-holo")}>{power} Wh / sol</span>
          </div>
          <div className="relative mt-6 grid aspect-[2/1] grid-cols-8 gap-1">
            {Array.from({ length: 32 }).map((_, i) => <div key={i} className="bg-nasa/60" />)}
            <div className="pointer-events-none absolute inset-0 bg-dust transition-opacity duration-1000" style={{ opacity: dust * 0.85 }} />
            {devil > 0 && (
              <div key={devil} className="devil pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(ellipse_at_center,var(--amber),transparent_70%)]" />
            )}
          </div>
          <div className="mt-2 h-1 bg-foreground/10"><div className="h-full bg-amber transition-all duration-700" style={{ width: `${(1 - dust) * 100}%` }} /></div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => { setDust((d) => Math.min(1, d + 0.25)); audio.burst(0.6, 0.1); }} className="telemetry border border-dust/40 px-4 py-2 text-dust hover:bg-dust/10">+ Dust storm</button>
            <button onClick={() => { setDevil((v) => v + 1); audio.blip(220, 1.2, 0.06); setTimeout(() => setDust((d) => d * 0.15), 1400); }} className="telemetry border border-holo/40 px-4 py-2 text-holo hover:bg-holo/10">Summon dust devil</button>
          </div>
        </div>
      </div>
    </Chapter>
  );
}

export function GettingOld() {
  return (
    <Chapter id="old" label="SYSTEM HEALTH · DEGRADED" mood="comms" dark={0.5} signal={0.6} className="glitch flex flex-col justify-center px-8 py-32 md:px-24">
      <ChapterTag n="08" title="Getting old" />
      <Voice className="mt-12 max-w-3xl" lines={["The mornings became harder.", "The winters became colder.", "But there was still more to see."]} />
      <div className="mt-20 grid max-w-4xl gap-8 sm:grid-cols-2 md:grid-cols-4">
        <Datum k="Right-front wheel" v="Steering stuck since 2005 — I learned to drive around it" />
        <Datum k="Robotic arm" v="Shoulder joint failing; kept unstowed from 2008" />
        <Datum k="Flash memory" v="‘Amnesia’ resets in 2014–15. I forgot what I saw each night." />
        <Datum k="Winters" v="Parked on sun-facing slopes to survive seven Martian winters" />
      </div>
    </Chapter>
  );
}

export function Storm() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setP(v);
    store.set({ storm: v, signal: Math.max(0.05, 0.6 - v * 0.6), dark: v > 0.92 ? (v - 0.92) * 12 : 0 });
    audio.setStorm(v);
  });
  const tau = (0.8 + p * 10).toFixed(1);
  const power = Math.round(645 - p * 623);
  const lines = [
    { at: 0.1, t: "The horizon went soft first." },
    { at: 0.35, t: "Then the sun became a small, pale coin." },
    { at: 0.6, t: "I turned off everything I could." },
    { at: 0.8, t: "I waited." },
  ];
  return (
    <Chapter id="storm" label="SOL 5104 · GLOBAL DUST EVENT" mood="storm" signal={0.4}>
      <div ref={ref} className="h-[400vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-8 md:px-24">
          <div className="pointer-events-none absolute inset-0 bg-void" style={{ opacity: p * 0.7 }} />
          <div className="relative" style={{ filter: `blur(${p * 2.5}px)`, opacity: 1 - p * 0.5 }}>
            <ChapterTag n="09" title="The storm" />
            <div className="mt-16 min-h-40">
              {lines.filter((l) => p > l.at).map((l) => (
                <motion.p key={l.t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.5 }} className="narration text-3xl text-signal md:text-5xl">“{l.t}”</motion.p>
              ))}
            </div>
          </div>
          <div className={cn("relative mt-16 flex flex-wrap gap-10 telemetry", p > 0.5 && "glitch")}>
            <div><div className="text-foreground/40">Opacity τ</div><div className="mt-1 text-2xl text-dust">{tau}</div></div>
            <div><div className="text-foreground/40">Power</div><div className={cn("mt-1 text-2xl", power < 100 ? "text-mars" : "text-amber")}>{power} Wh</div></div>
            <div><div className="text-foreground/40">Date</div><div className="mt-1 text-2xl text-foreground/70">June 2018</div></div>
          </div>
          <p className="relative mt-8 max-w-md text-xs leading-relaxed text-foreground/40">A planet-encircling dust storm blocked out the sun. Atmospheric opacity reached a record near 11. With no light, my batteries could no longer keep me awake.</p>
        </div>
      </div>
    </Chapter>
  );
}
