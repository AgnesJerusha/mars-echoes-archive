// ============================================================
// script.ts — CANONICAL SCRIPT. The UI renders from this file only.
// Wording is exact per the project brief (section 9). Do not rewrite,
// shorten or "improve" any line. Suspected typos are listed in VERIFY.md.
// S30 and S43 are duplicates in the source deck — recorded here with
// `duplicateOf`, never rendered as separate screens.
// ============================================================

export type VoiceId = "V1" | "V2" | "V3" | "V4";
// V1 narrator (calm, composed) · V2 mission control (female, mild static)
// V3 Opportunity (gentle, sincere) · V4 flight controller (human, S9 only)

export type AdvanceMode = "click-anywhere" | "auto" | "button" | "branch";

export interface ScriptLine {
  voice: VoiceId | null; // null = no voiceover (typed/shown only)
  text: string;
  cue?: string; // sound cue shown in captions, e.g. "static"
}

export interface SlideButton {
  label: string;
  goto: number; // slide id
  style: "orange" | "cyan";
}

export type Ambience = "none" | "static" | "wind" | "dust" | "silence";

export interface Slide {
  id: number;
  mode: AdvanceMode;
  title?: string; // chapter / scene title card text
  dateSol?: string; // HUD readout — only values given in the script
  signal?: number; // 0..1 signal bars state
  ambience?: Ambience;
  visual?: string; // scene key used by later milestones (3D scenes)
  lines: ScriptLine[];
  holdMs?: number; // hold after last line before auto-advance
  buttons?: SlideButton[];
  duplicateOf?: number; // deck duplicate — skipped by the runner
}

export const SLIDES: Slide[] = [
  // ---------- Archive boot (S1–S5) ----------
  {
    id: 1,
    mode: "click-anywhere",
    dateSol: "ARCHIVE",
    signal: 1,
    ambience: "static",
    lines: [{ voice: null, text: "TRANSMISSION ARCHIVE RECOVERED▌" }],
    buttons: [],
  },
  {
    id: 2,
    mode: "auto",
    dateSol: "ARCHIVE",
    signal: 1,
    ambience: "static",
    holdMs: 1400,
    lines: [
      { voice: null, text: "> mounting /dsn/archive/MER-B ..." },
      { voice: null, text: "> recovered telemetry ........ 5111 sols" }, // VERIFY
      { voice: null, text: "> recovered imagery .......... 228,771 frames" }, // VERIFY
      { voice: null, text: "> recovered logs ............. OK" },
      { voice: null, text: "> recovered voice data ....... PARTIAL" },
      { voice: null, text: "> decrypting ...." },
    ],
  },
  {
    id: 3,
    mode: "auto",
    dateSol: "ARCHIVE",
    signal: 1,
    ambience: "dust",
    holdMs: 2600,
    visual: "black",
    lines: [
      { voice: "V3", text: "Hello?" },
      { voice: "V3", text: "Can you hear me?" },
    ],
  },
  {
    id: 4,
    mode: "auto",
    dateSol: "ARCHIVE",
    signal: 1,
    ambience: "dust",
    holdMs: 2400,
    visual: "black",
    lines: [{ voice: "V3", text: "Well, I think I’m lost." }],
  },
  {
    id: 5,
    mode: "auto",
    dateSol: "ARCHIVE",
    signal: 1,
    ambience: "dust",
    holdMs: 2200,
    visual: "fade-black",
    lines: [{ voice: "V3", text: "Am I though?" }],
  },

  // ---------- Intro page ----------
  {
    id: 6,
    mode: "button",
    dateSol: "ARCHIVE",
    signal: 1,
    ambience: "none",
    visual: "intro",
    lines: [
      { voice: null, text: "Hear the story of a NASA rover that outlived its mission on Mars." },
      { voice: null, text: "Built for the NASA Space Apps Challenge 2026: “NASA’s Discarded Equipment Storytelling”." },
    ],
    buttons: [{ label: "Watch the experience", goto: 7, style: "orange" }],
  },

  // ---------- Beats (S7–S9) ----------
  {
    id: 7,
    mode: "auto",
    signal: 1,
    ambience: "static",
    holdMs: 800,
    visual: "black",
    lines: [
      { voice: "V2", text: "Entering the atmosphere." },
      { voice: "V2", text: "Parachute deployed." },
      { voice: "V2", text: "Airbags inflating." },
    ],
  },
  {
    id: 8,
    mode: "auto",
    signal: 1,
    ambience: "silence",
    holdMs: 3600, // the silence is what makes the cheer land
    visual: "black",
    lines: [{ voice: null, text: "", cue: "faint static hiss" }],
  },
  {
    id: 9,
    mode: "auto",
    signal: 1,
    ambience: "static",
    holdMs: 2200,
    visual: "black",
    lines: [
      { voice: "V4", text: "Signal acquired." },
      { voice: "V4", text: "Opportunity is on the surface.", cue: "crowd cheers" },
    ],
  },

  // ---------- Chapter 1: The Landing (S10–S15) ----------
  { id: 10, mode: "auto", title: "Chapter 1 · The Landing", signal: 1, ambience: "none", holdMs: 2200, visual: "title-card", lines: [] },
  {
    id: 11,
    mode: "auto",
    signal: 1,
    ambience: "wind",
    holdMs: 2000,
    visual: "iris-reveal", // MARS_SURFACE_POV, blur-to-focus
    lines: [],
  },
  { id: 12, mode: "auto", signal: 1, ambience: "wind", holdMs: 4000, visual: "mars-panorama", lines: [] },
  {
    id: 13,
    mode: "auto",
    signal: 1,
    ambience: "wind",
    holdMs: 1600,
    visual: "mars-panorama",
    lines: [
      { voice: "V2", text: "Designation: MER-B." },
      { voice: "V2", text: "Status: landed." },
      { voice: "V2", text: "Location: Meridiani Planum." },
      { voice: "V2", text: "Objective: determine whether water once existed here." },
      { voice: "V2", text: "Mission duration: 90 sols." },
    ],
  },
  {
    id: 14,
    mode: "button",
    signal: 1,
    ambience: "wind",
    visual: "mars-panorama-alive",
    lines: [
      { voice: "V3", text: "Oh. Hello there, Mars." },
      { voice: "V3", text: "I see you." },
    ],
    buttons: [{ label: "Click next to continue", goto: 15, style: "cyan" }],
  },
  {
    id: 15,
    mode: "button",
    signal: 1,
    ambience: "none",
    visual: "space-cruise",
    lines: [
      { voice: "V1", text: "July 7th, 2003." },
      { voice: "V1", text: "8:18 in the evening, Pacific time. Cape Canaveral, Florida. A rocket leaves Earth," },
      { voice: "V1", text: "carrying a rover called Opportunity." },
      { voice: "V1", text: "Six months of darkness follow. Then, on January 24th, 2004, it falls onto Mars," },
      { voice: "V1", text: "three weeks after its twin, Spirit, landed on the other side of the planet." },
      { voice: "V1", text: "It carries one question: Was there ever water on Mars?" },
      { voice: "V1", text: "Because where there is water, life might have been possible." },
      { voice: "V1", text: "NASA gave it ninety days to find out." },
      { voice: "V1", text: "Ninety Martian days. Opportunity had other plans." },
    ],
    buttons: [{ label: "Next", goto: 16, style: "orange" }],
  },

  // ---------- Chapter 2: The Quest (S16–S33) ----------
  { id: 16, mode: "auto", title: "Chapter 2 · The Quest", signal: 1, ambience: "none", holdMs: 2200, visual: "title-card", lines: [] },
  {
    id: 17,
    mode: "auto",
    signal: 1,
    ambience: "wind",
    holdMs: 1200,
    visual: "mars-panorama",
    lines: [
      { voice: "V3", text: "Wow." },
      { voice: "V3", text: "A flat, red plain." },
      { voice: "V3", text: "Fascinating." },
      { voice: "V3", text: "Continuing mission.", cue: "static glitch" },
    ],
  },
  {
    id: 18,
    mode: "button",
    signal: 1,
    ambience: "wind",
    visual: "mars-panorama",
    lines: [
      {
        voice: "V1",
        text: "Flat, red, empty. That’s what Opportunity thought, and it was wrong about one of those. After bouncing across Mars in its airbags, it came to rest inside a tiny crater, Eagle Crater, only twenty-two metres wide. Scientists called it a hole-in-one. At the crater’s edge lay bare bedrock, just beneath the dust, and on a planet buried in dust, that is rare luck.", // VERIFY 22 m
      },
    ],
    buttons: [{ label: "Next", goto: 19, style: "orange" }],
  },
  {
    id: 19,
    mode: "button",
    signal: 1,
    ambience: "wind",
    visual: "rock-closeup", // single shutter flash only
    lines: [
      { voice: "V3", text: "Ohhh, pardon me. Are you... a rock?", cue: "camera shutter click" },
      { voice: "V3", text: "You are round. You are grey." },
      { voice: "V3", text: "I will take your picture. Please hold still." },
    ],
    buttons: [{ label: "Next", goto: 20, style: "orange" }],
  },
  {
    id: 20,
    mode: "branch",
    signal: 1,
    ambience: "wind",
    visual: "mars-panorama",
    lines: [
      {
        voice: "V1",
        text: "The grey spheres weren’t pebbles. Each one was about the size of a small bead, a few millimetres across, scattered across the ground and stuck inside the rock like blueberries in a muffin. They were made of hematite, an iron-rich mineral. Opportunity’s spectrometer confirmed it, and its microscope showed the spheres were round, evenly spaced, and growing inside the rock itself. Spheres like these form when water seeps through rock, and minerals slowly build up around a tiny seed, growing outward in every direction. Water had once soaked through this rock. Mars was once wet.", // VERIFY
      },
    ],
    buttons: [
      { label: "Next", goto: 22, style: "orange" },
      { label: "Learn more about this", goto: 21, style: "cyan" },
    ],
  },
  {
    id: 21,
    mode: "button",
    signal: 1,
    ambience: "wind",
    visual: "field-notes", // LOG ENTRY · FIELD NOTES card
    lines: [
      { voice: "V1", text: "What they are: small hematite spherules called concretions, formed when minerals collect around a seed inside wet rock." },
      { voice: "V1", text: "Why it matters: they were evidence of groundwater at Meridiani, and groundwater means a place where life might have been possible." },
      { voice: "V1", text: "How Opportunity knew: its Mössbauer spectrometer identified the iron mineral, and its Microscopic Imager showed the round shapes up close." },
      { voice: "V1", text: "Other clues nearby: salty minerals like jarosite, which forms in acidic water, and rock layers with ripple patterns from flowing water." }, // VERIFY all
    ],
    buttons: [{ label: "Next", goto: 22, style: "orange" }],
  },
  {
    id: 22,
    mode: "button",
    title: "Scene 1 · The Look Back · Mar 22, 2004",
    dateSol: "MAR 22, 2004",
    signal: 1,
    ambience: "wind",
    visual: "debris-pan",
    lines: [{ voice: "V3", text: "Is that... my parachute? Ohhh... Thank you for your service." }],
    buttons: [{ label: "Next", goto: 23, style: "orange" }],
  },
  {
    id: 23,
    mode: "button",
    signal: 1,
    ambience: "wind",
    visual: "mars-panorama",
    lines: [
      {
        voice: "V1",
        text: "Opportunity climbs out of Eagle Crater. Ahead, Endurance Crater, 750 metres away. Behind, everything it arrived with: lander, backshell, parachute, lying in the dust like wrapping paper after a party.",
      },
    ],
    buttons: [{ label: "Next", goto: 24, style: "orange" }],
  },
  {
    id: 24,
    mode: "button",
    title: "Scene 2 · Twice the Mission · Jul 26, 2004",
    dateSol: "SOL 180",
    signal: 1,
    ambience: "wind",
    visual: "shadow-view",
    lines: [
      { voice: "V1", text: "Double the mission already. As it rolls into Endurance, its camera catches a long shadow on the ground." },
    ],
    buttons: [{ label: "Next", goto: 25, style: "orange" }],
  },
  {
    id: 25,
    mode: "button",
    signal: 1,
    ambience: "wind",
    visual: "shadow-view",
    lines: [{ voice: "V3", text: "Who is that? ...Haha.. That’s me. I am tall." }],
    buttons: [{ label: "Next", goto: 26, style: "orange" }],
  },
  {
    id: 26,
    mode: "button",
    title: "Scene 3 · The Visitor · Jan 2005",
    dateSol: "JAN 2005",
    signal: 1,
    ambience: "wind",
    visual: "heat-shield-rock",
    lines: [{ voice: "V3", text: "You are not from here, are you?" }],
    buttons: [{ label: "Next", goto: 27, style: "orange" }],
  },
  {
    id: 27,
    mode: "button",
    signal: 1,
    ambience: "wind",
    visual: "heat-shield-rock",
    lines: [
      {
        voice: "V1",
        text: "Beside its abandoned heat shield sits a basketball-sized rock. It’s iron and nickel, a meteorite that fell from space. Two visitors, only one of them had a parachute.",
      },
    ],
    buttons: [{ label: "Next", goto: 28, style: "orange" }],
  },
  {
    id: 28,
    mode: "button",
    title: "Scene 4 · Stuck · 2005",
    dateSol: "2005",
    signal: 1,
    ambience: "wind",
    visual: "rover-exterior-stuck",
    lines: [
      { voice: "V1", text: "Several wheels sink into sand. Mission control moves it a few inches at a time.", cue: "wheels grinding" },
      { voice: "V2", text: "Easy... one more inch." },
      { voice: "V3", text: "I would like to apologise to the sand." },
      { voice: "V1", text: "Six weeks later, in June, it rolls free." },
    ],
    buttons: [{ label: "Next", goto: 29, style: "orange" }],
  },
  {
    id: 29,
    mode: "button",
    title: "Scene 5 · The Dust · 2007",
    dateSol: "2007",
    signal: 1,
    ambience: "dust",
    visual: "dust-storm", // power meter falls to 128
    lines: [
      { voice: "V1", text: "Mars wraps itself in dust. Power drops to 128 watt-hours, the lowest yet. All science stops." },
      { voice: "V3", text: "Is it always this dark?" },
      { voice: "V1", text: "Six weeks later the dust settles. Opportunity wakes up and drives into Victoria Crater." },
    ],
    buttons: [{ label: "Next", goto: 31, style: "orange" }],
  },
  // S30 — the deck repeats S29’s text. Treated as one scene; not built.
  { id: 30, mode: "auto", duplicateOf: 29, lines: [] },
  {
    id: 31,
    mode: "button",
    title: "Scene 6 · A Rock from Deep Below",
    signal: 1,
    ambience: "wind",
    visual: "marquette-island",
    lines: [
      { voice: "V3", text: "Marquette Island? You are not like the others." },
      { voice: "V1", text: "Scientists say it matches no known Martian rock, and may have come from deep in the crust." },
    ],
    buttons: [{ label: "Next", goto: 32, style: "orange" }],
  },
  {
    id: 32,
    mode: "auto",
    title: "Scene 7 · Racing the Records",
    signal: 1,
    ambience: "wind",
    holdMs: 1200,
    visual: "odometer", // ~12 s, ping per record
    lines: [
      { voice: "V1", text: "Longest working on Mars: Viking 1’s record falls. Farthest any NASA vehicle has driven: Apollo 17’s falls. Then Lunokhod 2’s. Then, March 2015, a marathon: 42 kilometres.", cue: "odometer pings" },
      { voice: "V3", text: "Is that a lot?" },
      { voice: "V2", text: "Yes." },
    ],
  },
  {
    id: 33,
    mode: "button",
    title: "Scene 8 · Growing Old",
    signal: 1,
    ambience: "wind",
    visual: "rover-exterior",
    lines: [
      { voice: "V1", text: "Wind cleans its panels. Memory fails, and it can only use short-term memory. A wheel stalls, yet it climbs the steepest slope any Mars rover has driven." },
      { voice: "V3", text: "I forget things when I sleep. But I remember the way." },
    ],
    buttons: [{ label: "Next", goto: 34, style: "orange" }],
  },

  // ---------- Chapter 3: The Storm (S34–S38) ----------
  { id: 34, mode: "auto", title: "Chapter 3 · The Storm", signal: 1, ambience: "none", holdMs: 2400, visual: "title-card", lines: [] },
  {
    id: 35,
    mode: "auto",
    title: "Scene 1 · The Valley",
    dateSol: "2017",
    signal: 1,
    ambience: "wind",
    holdMs: 1200,
    visual: "perseverance-valley",
    lines: [
      { voice: "V3", text: "This valley was shaped by something. I think it was water. I would like to learn more." },
      { voice: "V1", text: "Perseverance Valley, 2017." },
      { voice: "V3", text: "My left front wheel is not turning the way I asked. I am sorry. I will try again.", cue: "squeak, grinding glitch" },
      { voice: "V2", text: "We see it, Opportunity. Take your time." },
      { voice: "V3", text: "Thank you. It is turning straight now. It worked! I am grateful." },
    ],
  },
  {
    id: 36,
    mode: "auto",
    title: "Scene 2 · Going Down",
    signal: 1,
    ambience: "wind",
    holdMs: 1200,
    visual: "gully-descent", // screen dims slowly
    lines: [
      { voice: "V3", text: "I am going down into the gully. It is getting darker. I do not mind. The rock walls are beautiful." },
      { voice: "V2", text: "Your power is dropping, Opportunity. Be careful." },
      { voice: "V3", text: "I understand. I will use my energy wisely." },
    ],
  },
  {
    id: 37,
    mode: "auto",
    title: "Scene 3 · The Sky Darkens",
    signal: 1,
    ambience: "dust",
    holdMs: 1400,
    visual: "storm",
    lines: [
      { voice: "V3", text: "The sky has turned brown. The wind is carrying the dust. I have seen this once before. I waited, and the light came back." },
      { voice: "V1", text: "A dust storm is covering all of Mars." },
      { voice: "V3", text: "This storm is larger. I will stay calm. I will wait again." },
      { voice: "V2", text: "We are here with you." },
    ],
  },
  {
    id: 38,
    mode: "auto",
    title: "Scene 4 · The Last Signal",
    dateSol: "JUN 10, 2018",
    signal: 0, // bars drop one at a time to zero during this scene
    ambience: "dust",
    holdMs: 2000,
    visual: "storm-dark",
    lines: [
      { voice: "V3", text: "My energy is very low. I will rest now, to save what I have.", cue: "static" },
      { voice: "V3", text: "Hello?", cue: "static" },
      { voice: "V3", text: "Can you hear me?" },
      { voice: "V2", text: "Opportunity, this is Earth. Do you copy?", cue: "silence, faint hiss" },
      { voice: "V2", text: "Opportunity... please respond.", cue: "silence" },
      { voice: "V1", text: "The last signal came on June 10, 2018." },
      { voice: "V2", text: "We are still listening." },
    ],
  },

  // ---------- Chapter 4: Am I Lost? (S39–S46) ----------
  { id: 39, mode: "auto", title: "Chapter 4 · Am I Lost?", signal: 0, ambience: "none", holdMs: 2400, visual: "title-card", lines: [] },
  {
    id: 40,
    mode: "auto",
    title: "Scene 1 · Still Listening",
    dateSol: "JUN 10, 2018", // readout frozen
    signal: 0,
    ambience: "silence",
    holdMs: 1600,
    visual: "black",
    lines: [
      { voice: "V2", text: "Opportunity, this is Earth. We are still here." },
      { voice: "V1", text: "For months, engineers kept calling." },
      { voice: "V2", text: "Opportunity... if you can hear us, we are listening.", cue: "silence" },
      { voice: "V1", text: "On February 13, 2019, NASA declared the mission complete." },
      { voice: "V2", text: "Thank you, Opportunity. Thank you for everything." },
    ],
  },
  {
    id: 41,
    mode: "auto",
    title: "Scene 2 · The Numbers",
    signal: 0,
    ambience: "none",
    holdMs: 1600,
    visual: "odometer-final", // counts to 45.16 km
    lines: [
      {
        voice: "V1",
        text: "Opportunity was built for ninety Martian days and about one kilometre. It worked for almost fifteen years, lasted sixty times longer than planned, and drove 45.16 kilometres, an off-world distance record that stood until 2026.",
      },
    ],
  },
  {
    id: 42,
    mode: "auto",
    title: "Scene 3 · Am I Lost?",
    signal: 0,
    ambience: "wind",
    holdMs: 2000,
    visual: "mars-panorama",
    lines: [
      { voice: "V3", text: "Hello? Can you hear me?", cue: "static" },
      { voice: "V3", text: "I thought I was lost. I was wrong." },
      { voice: "V3", text: "I am in Perseverance Valley. I came a very long way. I learned about water. I met a meteorite. I passed a marathon.", cue: "static breaks the last words" },
      { voice: "V3", text: "Thank you for... listening.", cue: "silence" },
    ],
  },
  // S43 — the deck repeats S42. Built once; reported as duplicate.
  { id: 43, mode: "auto", duplicateOf: 42, lines: [] },
  {
    id: 44,
    mode: "auto",
    title: "Scene 4 · Passing the Torch",
    signal: 0,
    ambience: "wind",
    holdMs: 1800,
    visual: "mars-tracks",
    lines: [
      { voice: "V1", text: "Opportunity’s distance record stood until October 11, 2026, when NASA’s Perseverance rover passed it." },
      { voice: "V2", text: "Opportunity showed us the way." },
    ],
  },
  {
    id: 45,
    mode: "auto",
    title: "Scene 5 · The Goodbye",
    signal: 0,
    ambience: "wind",
    holdMs: 1600,
    visual: "mars-panorama",
    lines: [
      { voice: "V3", text: "Hello? ...Can you hear me?", cue: "static" },
      { voice: "V3", text: "Status report. Power: low. Left front wheel: still a little rude. Dust: yes." },
      { voice: "V3", text: "Sincerity setting: one hundred percent. I would like to leave it there." },
    ],
  },
  {
    id: 46,
    mode: "auto",
    signal: 0,
    ambience: "wind",
    holdMs: 3800, // then hold black 3–4 s
    visual: "goodbye", // soft piano note, panorama darkens
    lines: [
      { voice: "V3", text: "You gave me ninety days. I took sixty times that. I hope that was alright." },
      { voice: "V3", text: "I ran a marathon. Then I kept going, because the view kept getting better." },
      { voice: "V3", text: "I was sent to find a place where life could have lived. I found it." },
      { voice: "V3", text: "I did not find life itself. But I think that is almost the same." },
      { voice: "V3", text: "My battery is low. It is getting dark.", cue: "wind rises, static breaks up the words" },
      { voice: "V3", text: "Well, my time is over. Hey... don’t be sad. My purpose is complete. I am free. I’m glad to be remembered by you." },
      { voice: "V3", text: "And please keep the parachute. It is still very good.", cue: "static cuts the last words" },
      { voice: "V3", text: "Goodbye, Earth. ...Goodbye, Mars. I see you.", cue: "silence" },
    ],
  },
];

/** Slides the runner actually plays (deck duplicates removed). */
export const PLAYABLE_SLIDES = SLIDES.filter((s) => !s.duplicateOf);

export function getSlide(id: number): Slide {
  const s = SLIDES.find((sl) => sl.id === id);
  if (!s) throw new Error(`Unknown slide ${id}`);
  return s;
}

export function nextSlideId(id: number): number | null {
  const idx = PLAYABLE_SLIDES.findIndex((s) => s.id === id);
  const next = idx >= 0 ? PLAYABLE_SLIDES[idx + 1] : undefined;
  return next ? next.id : null;
}

export function prevSlideId(id: number): number | null {
  const idx = PLAYABLE_SLIDES.findIndex((s) => s.id === id);
  const prev = idx > 0 ? PLAYABLE_SLIDES[idx - 1] : undefined;
  return prev ? prev.id : null;
}
