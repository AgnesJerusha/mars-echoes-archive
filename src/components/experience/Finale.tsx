import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { audio } from "@/lib/audio";
import { store } from "@/lib/store";
import future from "@/assets/future.jpg";

const LAST = ["The sky is getting dark.", "I can’t see as far as I used to.", "If you’re still there…", "Thank you."];
const DELAYS = [2500, 5500, 5500, 7000]; // pauses before each line

type Stage = "wait" | "speaking" | "static" | "silence" | "epilogue";

export function LastTransmission() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.7 });
  const [stage, setStage] = useState<Stage>("wait");
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || stage !== "wait") return;
    setStage("speaking");
    store.set({ chapter: "SIGNAL LOST", dark: 1, signal: 0.05, storm: 1 });
    audio.setMood("final", 4);
    document.body.style.overflow = "hidden";
    let acc = 0;
    const ts: ReturnType<typeof setTimeout>[] = [];
    DELAYS.forEach((d, i) => { acc += d; ts.push(setTimeout(() => { setN(i + 1); audio.blip(180, 0.6, 0.03); }, acc)); });
    acc += 6000;
    ts.push(setTimeout(() => { setStage("static"); audio.burst(2.5, 0.4); store.set({ signal: 0 }); }, acc));
    acc += 2500;
    ts.push(setTimeout(() => { setStage("silence"); audio.setMood("silence", 0.5); }, acc));
    acc += 13000; // ~13 seconds of silence
    ts.push(setTimeout(() => {
      setStage("epilogue");
      audio.setMood("ending", 8);
      store.set({ chapter: "EPILOGUE" });
      document.body.style.overflow = "";
    }, acc));
    return () => { ts.forEach(clearTimeout); document.body.style.overflow = ""; };
  }, [inView, stage]);

  return (
    <>
      <section ref={ref} className="relative flex h-screen items-center justify-center bg-void px-8">
        {stage === "speaking" && (
          <div className="glitch space-y-8 text-center">
            <div className="telemetry text-mars/70">◉ weak carrier · −174 dBm</div>
            {LAST.slice(0, n).map((l) => (
              <motion.p key={l} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.9, 0.6, 0.85] }} transition={{ duration: 3 }} className="narration text-2xl text-foreground/80 md:text-4xl">“{l}”</motion.p>
            ))}
          </div>
        )}
        {stage === "static" && (
          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 2.4 }} className="grain absolute inset-0 !opacity-60" />
        )}
      </section>
      <AnimatePresence>{stage === "epilogue" && <Epilogue />}</AnimatePresence>
    </>
  );
}

function Epilogue() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, []);
  return (
    <motion.section ref={ref} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 4 }} className="relative bg-void">
      <div className="flex h-screen flex-col items-center justify-center">
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2, duration: 4 }} className="h-2 w-2 rounded-full bg-nasa shadow-[0_0_24px_6px_var(--nasa)]" />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 6, duration: 3 }} className="telemetry mt-8 text-nasa/80">Earth · from Mars</motion.p>
      </div>
      <div className="relative min-h-screen">
        <img src={future} alt="Students and scientists watching Mars on a mission-control screen" loading="lazy" width={1600} height={912} className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/30 to-void" />
        <div className="relative flex min-h-screen flex-col items-center justify-center px-8 text-center">
          <Line delay={0} text="I never made it home." />
          <Line delay={2.5} text="But my stories did." />
          <p className="telemetry mt-16 max-w-xl leading-loose text-foreground/60">
            Spirit · Opportunity · Curiosity · Perseverance · Ingenuity — and the missions not yet named, built by people still in school today.
          </p>
        </div>
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
        <motion.h2 initial={{ opacity: 0, letterSpacing: "0.2em" }} whileInView={{ opacity: 1, letterSpacing: "0.45em" }} viewport={{ once: true }} transition={{ duration: 4 }} className="pl-[0.45em] text-3xl font-light text-signal md:text-6xl">
          ABANDONED
        </motion.h2>
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.5, duration: 3 }} className="mt-4 pl-[0.3em] text-xl font-light tracking-[0.3em] text-amber md:text-3xl">
          BUT NOT FORGOTTEN
        </motion.h2>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 4, duration: 3 }} className="mt-24 space-y-3 telemetry">
          <p className="text-foreground/50">Opportunity’s transmission has ended</p>
          <p className="text-holo">Your journey is just beginning</p>
        </motion.div>
        <motion.a
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 6, duration: 2 }}
          href="https://science.nasa.gov/planetary-science/programs/mars-exploration/" target="_blank" rel="noreferrer"
          className="telemetry mt-14 border border-holo/40 px-8 py-4 text-holo transition-all hover:border-holo hover:bg-holo/10 hover:text-signal"
        >
          Explore more NASA missions →
        </motion.a>
        <p className="narration mt-24 text-lg text-foreground/40">Sleep well, Oppy.</p>
      </div>
    </motion.section>
  );
}

function Line({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.p initial={{ opacity: 0, filter: "blur(8px)" }} whileInView={{ opacity: 1, filter: "blur(0px)" }} viewport={{ once: true }} transition={{ delay, duration: 2.5 }} className="narration text-4xl text-signal md:text-6xl">
      “{text}”
    </motion.p>
  );
}
