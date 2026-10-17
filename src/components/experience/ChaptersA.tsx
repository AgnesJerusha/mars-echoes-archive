import { AnimatePresence, animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { audio } from "@/lib/audio";
import { cn } from "@/lib/utils";
import { Chapter, ChapterTag, Datum, Voice } from "./primitives";
import rover from "@/assets/rover.jpg";

export function FirstMorning() {
  return (
    <Chapter id="morning" label="SOL 1 · MERIDIANI PLANUM" mood="surface" className="flex flex-col justify-center px-8 md:px-24">
      <ChapterTag n="01" title="The first morning" />
      <Voice className="mt-16 max-w-3xl" lines={["Humans spent years trying to reach this place.", "I got here.", "And then they asked me to start walking."]} />
      <div className="mt-24 grid max-w-3xl grid-cols-2 gap-8 md:grid-cols-4">
        <Datum k="Landed" v="25 Jan 2004 · 05:05 UTC" />
        <Datum k="Site" v="Meridiani Planum, 1.9°S" />
        <Datum k="Arrival" v="Bounced ~26 times in airbags" />
        <Datum k="Result" v="Rolled into Eagle Crater — a 'hole in one'" />
      </div>
    </Chapter>
  );
}

const LOGS = [
  { t: "SOL 001 · 2004-01-25", h: "“We’re on Mars.”", b: "The first signal reached JPL just after 9 pm Pacific. Engineers cheered in a room 200 million kilometres away from me." },
  { t: "SOL 001 · First image", h: "Eagle Crater", b: "My first pictures showed a small crater and bedrock outcrop — layered rock no one had ever touched before." },
  { t: "DAILY · Wake-up songs", h: "Every morning, music", b: "The team woke me each sol with a song. I couldn’t hear it. They played it anyway." },
  { t: "RELAY · Odyssey / DSN", h: "How I spoke", b: "Most of my data went up to the Mars Odyssey orbiter, then to Deep Space Network dishes in Goldstone, Madrid and Canberra." },
  { t: "SOL 5111 · 2018-06-10", h: "Last data received", b: "My final message reported 22 watt-hours of power and a sky almost totally dark." },
  { t: "2019-02-12 · Final attempt", h: "“I’ll Be Seeing You”", b: "On their last try to reach me, the team played Billie Holiday. Then, quietly, they said goodbye." },
];

export function CanYouHearMe() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Chapter id="comms" label="DSN LINK · 4–24 LIGHT-MIN" mood="comms" dark={0.85} className="flex items-center px-8 py-32 md:px-24">
      <div className="grid w-full items-center gap-16 lg:grid-cols-2">
        <div>
          <ChapterTag n="02" title="Can you hear me?" />
          <Voice className="mt-12" lines={["Home was very far away.", "But they kept talking."]} />
          <svg viewBox="-200 -200 400 400" className="mt-10 w-full max-w-md">
            <circle r="90" fill="none" className="stroke-nasa/40" strokeDasharray="2 4" />
            <circle r="150" fill="none" className="stroke-mars/40" strokeDasharray="2 4" />
            <circle r="10" className="fill-amber" opacity={0.9} />
            <g>
              <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="60s" repeatCount="indefinite" />
              <circle cx="90" cy="0" r="5" className="fill-nasa" />
            </g>
            <g>
              <animateTransform attributeName="transform" type="rotate" from="140" to="332" dur="60s" repeatCount="indefinite" />
              <circle cx="150" cy="0" r="4" className="fill-mars" />
            </g>
            <line x1="-60" y1="-67" x2="140" y2="-55" className="stroke-holo beam" strokeWidth="1" strokeDasharray="4 6" opacity={0.7} />
            <text x="-70" y="-80" className="fill-nasa telemetry" fontSize="9">EARTH</text>
            <text x="120" y="-68" className="fill-mars telemetry" fontSize="9">MARS</text>
          </svg>
        </div>
        <div className="space-y-2">
          <div className="telemetry mb-6 text-holo/70">Recovered transmission logs · select to decode</div>
          {LOGS.map((l, i) => (
            <button
              key={l.t}
              onClick={() => { setOpen(open === i ? null : i); audio.blip(700 + i * 60); }}
              className={cn("holo-panel block w-full px-5 py-4 text-left transition-colors", open === i ? "border-holo/60" : "hover:border-holo/40")}
            >
              <div className="flex items-center justify-between telemetry text-foreground/60">
                <span>{l.t}</span>
                <span className="text-holo">{open === i ? "−" : "+"}</span>
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="narration mt-4 text-2xl text-signal">{l.h}</div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">{l.b}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>
    </Chapter>
  );
}

function Counter({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const c = animate(90, to, {
      duration: 9, ease: [0.6, 0, 0.3, 1],
      onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v).toLocaleString(); },
    });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className={className}>90</span>;
}

export function NinetyDays() {
  return (
    <Chapter id="ninety" label="MISSION CLOCK" mood="swell" dark={0.1} className="flex flex-col items-center justify-center px-8 py-40 text-center">
      <ChapterTag n="03" title="I was supposed to last 90 days" />
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 2 }} className="mt-16">
        <div className="telemetry text-foreground/60">Mission expectancy</div>
        <div className="mt-2 text-6xl font-extralight text-foreground/40 line-through decoration-mars/70 md:text-8xl">90 SOLS</div>
      </motion.div>
      <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2 telemetry text-amber/70">
        {[100, 500, 1000, 2000, 3000, 4000, 5000].map((d, i) => (
          <motion.span key={d} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1 + i * 1.1, duration: 1 }}>Sol {d}</motion.span>
        ))}
      </div>
      <div className="mt-12 font-extralight text-signal text-glow">
        <Counter to={5111} className="text-[22vw] leading-none md:text-[14vw]" />
        <div className="telemetry -mt-2 text-amber">sols of operation</div>
      </div>
      <Voice className="mt-20" lines={["I forgot I was supposed to stop."]} />
    </Chapter>
  );
}

const PLACES = [
  { id: "eagle", name: "Eagle Crater", x: 12, y: 18, when: "Sol 1 – 57 · 2004", line: "I woke up in a little bowl, and the walls were made of stories.", fact: "A 22-metre crater. Its exposed bedrock showed fine layers and cross-bedding — rock shaped by flowing water.", tag: "First evidence of ancient water" },
  { id: "endurance", name: "Endurance Crater", x: 26, y: 26, when: "Sol 133 – 315 · 2004", line: "They let me climb down inside. It took half a year to climb back out.", fact: "About 130 m across. Deeper rock layers recorded a long history of wet, acidic environments.", tag: "Heat Shield Rock nearby" },
  { id: "victoria", name: "Victoria Crater", x: 48, y: 58, when: "2006 – 2008", line: "I sat on the edge for weeks. I just wanted to look.", fact: "Roughly 750 m wide with scalloped cliffs. I explored its rim and interior for almost two years.", tag: "Cape Verde cliffs" },
  { id: "endeavour", name: "Endeavour Crater", x: 82, y: 76, when: "Aug 2011 – 2018", line: "Three years of driving to reach it. It was worth every wheel turn.", fact: "A 22 km crater with much older rocks — where I found gypsum veins and clay minerals.", tag: "Final home · Perseverance Valley" },
];

export function DesertOfMemories() {
  const [sel, setSel] = useState(0);
  const p = PLACES[sel]!;
  return (
    <Chapter id="map" label="MERIDIANI · ORBITAL MAP" mood="explore" dark={0.75} className="px-8 py-32 md:px-24">
      <ChapterTag n="04" title="The desert of memories" />
      <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden border border-holo/20">
          <img src={rover} alt="Opportunity rover on the Martian plains" loading="lazy" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover opacity-30 saturate-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,transparent,var(--void))]" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <path d="M12 18 L18 22 L26 26 L30 34 L38 44 L48 58 L56 62 L64 66 L72 70 L82 76" fill="none" className="stroke-amber/60" strokeWidth="0.4" strokeDasharray="1 1" />
          </svg>
          {PLACES.map((pl, i) => (
            <button key={pl.id} onClick={() => { setSel(i); audio.blip(520 + i * 120, 0.2); }} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${pl.x}%`, top: `${pl.y}%` }}>
              <span className={cn("block rounded-full border transition-all", i === sel ? "h-6 w-6 border-holo bg-holo/20" : "h-3 w-3 border-amber bg-amber/30 group-hover:scale-150")} />
              <span className="telemetry absolute left-6 top-0 whitespace-nowrap text-[0.6rem] text-foreground/70">{pl.name}</span>
            </button>
          ))}
          <div className="telemetry absolute bottom-3 left-3 text-[0.55rem] text-foreground/40">N ↑ · route not to scale</div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.8 }} className="flex flex-col justify-center">
            <div className="telemetry text-amber/80">Memory · {p.when}</div>
            <h3 className="mt-3 text-3xl font-light tracking-[0.2em] text-signal">{p.name.toUpperCase()}</h3>
            <p className="narration mt-8 text-3xl text-foreground/90">“{p.line}”</p>
            <p className="mt-8 max-w-md text-sm leading-relaxed text-foreground/60">{p.fact}</p>
            <div className="telemetry mt-6 text-holo/70">◇ {p.tag}</div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Chapter>
  );
}

const FINDS = [
  { id: "berries", hook: "I found strange little berries.", name: "Hematite “blueberries”", sci: "Millimetre-sized spheres of grey hematite, weathering out of the rock. On Earth, concretions like these form when groundwater seeps through sediment.", shape: "berries" },
  { id: "meteor", hook: "Someone left a rock from space next to my heat shield.", name: "Heat Shield Rock", sci: "A basketball-sized iron-nickel meteorite found in 2005 — the first meteorite ever identified on another planet.", shape: "meteor" },
  { id: "vein", hook: "There was a bright white line in the ground.", name: "“Homestake” gypsum vein", sci: "Calcium sulfate deposited by water flowing through a crack — direct proof water once moved underground here.", shape: "vein" },
  { id: "clay", hook: "This rock felt… gentler.", name: "Esperance clay", sci: "Clay minerals formed in water that was relatively neutral — friendlier to life than the acidic water seen elsewhere.", shape: "clay" },
];

function FindShape({ s }: { s: string }) {
  if (s === "berries")
    return <svg viewBox="0 0 100 100" className="h-full w-full">{Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={20 + ((i * 37) % 60)} cy={25 + ((i * 53) % 55)} r={4 + (i % 3)} className="fill-nasa/70 stroke-holo/40" strokeWidth="0.5" />)}</svg>;
  if (s === "meteor") return <svg viewBox="0 0 100 100" className="h-full w-full"><path d="M25 60 Q30 30 55 28 Q78 30 76 55 Q70 76 48 74 Q28 72 25 60Z" className="fill-muted-foreground/40 stroke-amber/60" /><circle cx="45" cy="45" r="4" className="fill-void/40" /><circle cx="60" cy="58" r="3" className="fill-void/40" /></svg>;
  if (s === "vein") return <svg viewBox="0 0 100 100" className="h-full w-full"><rect x="10" y="30" width="80" height="40" className="fill-mars/50" /><path d="M10 55 Q35 45 50 52 T90 46" className="stroke-signal" strokeWidth="3" fill="none" /></svg>;
  return <svg viewBox="0 0 100 100" className="h-full w-full"><ellipse cx="50" cy="55" rx="34" ry="22" className="fill-dust/50 stroke-holo/40" /><path d="M24 55 Q50 40 76 55" className="stroke-signal/50" fill="none" /></svg>;
}

export function ThingsIFound() {
  const [rev, setRev] = useState<Record<string, boolean>>({});
  return (
    <Chapter id="finds" label="APXS · MI · MÖSSBAUER" mood="explore" dark={0.8} className="px-8 py-32 md:px-24">
      <ChapterTag n="05" title="Things I found" />
      <p className="telemetry mt-6 text-foreground/50">Tap a sample to analyse it</p>
      <div className="mt-14 grid gap-px bg-holo/10 md:grid-cols-2">
        {FINDS.map((f, i) => (
          <button key={f.id} onClick={() => { setRev((r) => ({ ...r, [f.id]: !r[f.id] })); audio.blip(300 + i * 150, 0.3); }} className="group relative flex min-h-72 gap-6 bg-void/80 p-8 text-left transition-colors hover:bg-void/60">
            <div className={cn("h-28 w-28 shrink-0 transition-transform duration-700", rev[f.id] && "scale-110")}><FindShape s={f.shape} /></div>
            <div>
              <p className="narration text-2xl text-signal">“{f.hook}”</p>
              <AnimatePresence>
                {rev[f.id] ? (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="telemetry mt-6 text-holo">{f.name}</div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/65">{f.sci}</p>
                  </motion.div>
                ) : (
                  <div className="telemetry mt-6 text-foreground/40 group-hover:text-holo/70">[ analyse ]</div>
                )}
              </AnimatePresence>
            </div>
          </button>
        ))}
      </div>
    </Chapter>
  );
}
