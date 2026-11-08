# Opportunity — Recovered Transmission Archive (rebuild)

Rebuild the experience as the **46-slide recovered-transmission archive** from the uploaded prompt + deck, replacing the current scroll-page version.

## Stack note (deviation from prompt, flagged)
The prompt asks for Vite + React 18 + zustand + howler. This project is fixed to **TanStack Start + React 19** (Lovable platform constraint). We keep the prompt's architecture (script.ts as single source of truth, engine/, scenes/, screens/) but use the project's own store pattern and Web Audio instead of zustand/howler. Everything else follows the prompt.

## Milestone plan (stop for review after each)

### M1 — Skeleton + boot sequence (this build)
- `src/data/script.ts` — all 46 slides as typed data: exact script wording, voices (V1–V4), advance modes (click-anywhere / auto / button / branch), hold times, signal state, date/sol readouts. S30 and S43 marked as duplicates of S29/S42 (not built as screens, reported).
- `src/engine/` — slide runner state machine, typing effect (28 ms/char, punctuation pauses), audio manager (Web Audio placeholders + speech-synthesis voice stand-ins with per-voice pitch/rate, ducking buses), caption/subtitle layer, keyboard input (Space/Enter, arrows, M, C, Esc).
- Global HUD: blinking REC · MER-B + ARCHIVE, date/sol readout, 5 live signal bars, sound toggle; bottom control strip (Pause/Play, Replay line, Captions, Transcript, Reduced motion, Restart) appearing on mouse move.
- Screens S1–S6: decrypt boot, archive log, "Hello?" / "Can you hear me?", "Well, I think I'm lost.", "Am I though?", Team Dormant intro page with orange "Watch the experience" button and GitHub placeholder.
- Design tokens per prompt palette (#050607, cyan #5CC8DC, red #E0533A, orange #D9532B), Share Tech Mono + Cormorant Garamond, CRT scanlines/vignette/grain, reduced-motion support (default from OS).
- `ASSETS.md`, `VERIFY.md` (5111 sols, 228,771 frames, Eagle Crater 22 m, hematite/jarosite details, instrument one-liners), README update.

### M2 — Audio manager polish + beats S7–S9 + Chapter 1 iris reveal (S10–S11)
### M3 — MARS_SURFACE_POV + rover model (S12–S15), model node report
### M4 — Chapter 2 (S16–S33) incl. S20 branch + S21 Field Notes
### M5 — Chapter 3 + 4 film sequences (S34–S46), signal bars, darkening light
### M6 — Closing archive pages (ID card, 3D rover hotspots, globe, timeline, quiz, credits), accessibility + performance pass

## Placeholders left clearly marked
Voice audio files, music, opportunity.glb, Mars texture, Team Dormant logo file, GitHub URL.
