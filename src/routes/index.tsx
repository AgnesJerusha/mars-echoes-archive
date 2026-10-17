import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MarsWorld } from "@/components/experience/MarsWorld";
import { Intro } from "@/components/experience/Intro";
import { HUD } from "@/components/experience/primitives";
import { CanYouHearMe, DesertOfMemories, FirstMorning, NinetyDays, ThingsIFound } from "@/components/experience/ChaptersA";
import { GettingOld, Marathon, MarsIsAlive, Storm } from "@/components/experience/ChaptersB";
import { LastTransmission } from "@/components/experience/Finale";
import { store } from "@/lib/store";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Opportunity — Abandoned, But Not Forgotten" },
      { name: "description", content: "A recovered transmission from NASA's Opportunity Mars rover. A cinematic, interactive journey across 5,111 sols on Mars." },
      { property: "og:title", content: "Opportunity — Abandoned, But Not Forgotten" },
      { property: "og:description", content: "Receive the memories of NASA's Opportunity rover in a cinematic interactive experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Experience,
});

function Experience() {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    document.body.style.overflow = entered ? "" : "hidden";
    if (entered) { window.scrollTo(0, 0); store.set({ dark: 0, chapter: "SOL 1 · MERIDIANI PLANUM" }); }
  }, [entered]);

  return (
    <main className="relative bg-void text-foreground">
      <MarsWorld />
      <HUD />
      <AnimatePresence>{!entered && <Intro onEnter={() => setEntered(true)} />}</AnimatePresence>
      {entered && (
        <div className="relative z-10">
          <FirstMorning />
          <CanYouHearMe />
          <NinetyDays />
          <DesertOfMemories />
          <ThingsIFound />
          <Marathon />
          <MarsIsAlive />
          <GettingOld />
          <Storm />
          <LastTransmission />
        </div>
      )}
    </main>
  );
}
