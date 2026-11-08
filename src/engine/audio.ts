import type { Ambience, VoiceId } from "@/data/script";

// ============================================================
// Audio manager — PLACEHOLDER AUDIO ONLY (see ASSETS.md).
// All sound is procedural Web Audio; spoken lines use the browser's
// speech synthesis as a development stand-in until real voice files
// are generated from public/audio/manifest.json.
// Buses: master → voice / music / sfx. Music + sfx duck under speech.
// ============================================================

const VOICE_PROFILES: Record<VoiceId, { pitch: number; rate: number }> = {
  V1: { pitch: 0.85, rate: 0.95 }, // narrator — calm, composed
  V2: { pitch: 1.35, rate: 1.02 }, // mission control — female, robotic
  V3: { pitch: 1.15, rate: 0.82 }, // Opportunity — gentle, slightly slow
  V4: { pitch: 1.0, rate: 1.0 }, // flight controller — human
};

class AudioManager {
  ctx: AudioContext | null = null;
  master!: GainNode;
  voiceBus!: GainNode;
  musicBus!: GainNode;
  sfxBus!: GainNode;
  private ambienceNodes: { stop: () => void } | null = null;
  private currentAmbience: Ambience = "none";
  private muted = false;
  private speaking = false;

  /** Must be called from a user gesture (S1 click). */
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return;
    }
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    this.master.connect(ctx.destination);
    this.voiceBus = ctx.createGain();
    this.musicBus = ctx.createGain();
    this.sfxBus = ctx.createGain();
    this.voiceBus.connect(this.master);
    this.musicBus.connect(this.master);
    this.sfxBus.connect(this.master);
  }

  get ready() {
    return !!this.ctx;
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.15);
    if (m && typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  }

  // ---------- placeholder effects ----------

  private noiseBuffer(seconds = 2): AudioBuffer {
    const ctx = this.ctx!;
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  /** Old-computer key tick. */
  keyTick() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.value = 2200 + Math.random() * 600;
    g.gain.setValueAtTime(0.03, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    o.connect(g).connect(this.sfxBus);
    o.start(t);
    o.stop(t + 0.04);
  }

  /** Signal-bar drop tick. */
  dropTick() {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(660, t);
    o.frequency.exponentialRampToValueAtTime(220, t + 0.18);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(g).connect(this.sfxBus);
    o.start(t);
    o.stop(t + 0.25);
  }

  /** Single soft piano-ish note placeholder (S46 / intro bed). */
  pianoNote(freq = 220, dur = 3) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    [1, 2.01, 3.02].forEach((mult, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq * mult;
      const vol = i === 0 ? 0.12 : 0.12 / (i * 2);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(this.musicBus);
      o.start(t);
      o.stop(t + dur + 0.1);
    });
  }

  /** Crowd cheer placeholder — filtered noise swell. */
  cheer(dur = 2.5) {
    if (!this.ctx || this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(dur + 0.5);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 900;
    bp.Q.value = 0.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.25, t + 0.4);
    g.gain.setValueAtTime(0.25, t + dur - 0.8);
    g.gain.linearRampToValueAtTime(0, t + dur);
    src.connect(bp).connect(g).connect(this.sfxBus);
    src.start(t);
    src.stop(t + dur + 0.2);
  }

  // ---------- ambience loops ----------

  setAmbience(a: Ambience) {
    if (a === this.currentAmbience) return;
    this.currentAmbience = a;
    this.ambienceNodes?.stop();
    this.ambienceNodes = null;
    if (!this.ctx || a === "none" || a === "silence") return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(4);
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    const g = ctx.createGain();
    if (a === "static") {
      filter.type = "bandpass";
      filter.frequency.value = 2800;
      filter.Q.value = 0.6;
      g.gain.value = 0.05;
    } else if (a === "wind") {
      filter.type = "lowpass";
      filter.frequency.value = 480;
      filter.Q.value = 3;
      g.gain.value = 0.14;
    } else {
      // dust / sandstorm
      filter.type = "lowpass";
      filter.frequency.value = 300;
      filter.Q.value = 4;
      g.gain.value = 0.22;
    }
    src.connect(filter).connect(g).connect(this.sfxBus);
    src.start();
    this.ambienceNodes = {
      stop: () => {
        try {
          g.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
          src.stop(ctx.currentTime + 1.5);
        } catch {
          /* already stopped */
        }
      },
    };
  }

  // ---------- speech (development stand-in for voice files) ----------

  /** Speak a line with the voice's profile; music/sfx duck underneath. */
  speak(voice: VoiceId, text: string, onEnd: () => void) {
    if (typeof speechSynthesis === "undefined" || this.muted || !text.trim()) {
      onEnd();
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const p = VOICE_PROFILES[voice];
    u.pitch = p.pitch;
    u.rate = p.rate;
    u.volume = 1;
    this.duck(true);
    const done = () => {
      if (!this.speaking) return;
      this.speaking = false;
      this.duck(false);
      onEnd();
    };
    u.onend = done;
    u.onerror = done;
    this.speaking = true;
    speechSynthesis.speak(u);
    // Safety net: some engines never fire onend for short utterances.
    const estMs = Math.max(1500, text.length * 95);
    setTimeout(() => {
      if (this.speaking && !speechSynthesis.speaking) done();
    }, estMs);
  }

  stopSpeech() {
    if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    this.speaking = false;
    this.duck(false);
  }

  private duck(under: boolean) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.musicBus.gain.setTargetAtTime(under ? 0.25 : 1, t, 0.2);
    this.sfxBus.gain.setTargetAtTime(under ? 0.35 : 1, t, 0.2);
  }
}

export const audio = new AudioManager();
