import type { Mood } from "./store";

// Fully procedural sound design — no audio files. Layers crossfade per chapter mood.
type Layer = "static" | "wind" | "hum" | "pad";
const MOODS: Record<Mood, Record<Layer, number> & { cutoff: number }> = {
  opening: { static: 0.12, wind: 0.02, hum: 0.18, pad: 0, cutoff: 900 },
  surface: { static: 0, wind: 0.22, hum: 0.04, pad: 0.12, cutoff: 1200 },
  explore: { static: 0, wind: 0.12, hum: 0.03, pad: 0.22, cutoff: 1600 },
  comms: { static: 0.05, wind: 0.04, hum: 0.12, pad: 0.16, cutoff: 1400 },
  swell: { static: 0, wind: 0.08, hum: 0.05, pad: 0.42, cutoff: 2600 },
  storm: { static: 0.06, wind: 0.6, hum: 0.02, pad: 0.05, cutoff: 500 },
  final: { static: 0.06, wind: 0.05, hum: 0.02, pad: 0.02, cutoff: 400 },
  silence: { static: 0, wind: 0, hum: 0, pad: 0, cutoff: 400 },
  ending: { static: 0, wind: 0.03, hum: 0, pad: 0.34, cutoff: 2200 },
};

class AudioEngine {
  ctx: AudioContext | null = null;
  master!: GainNode;
  layers = {} as Record<Layer, GainNode>;
  padFilter!: BiquadFilterNode;
  windFilter!: BiquadFilterNode;
  mood: Mood = "opening";
  muted = false;

  init() {
    if (this.ctx) return;
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.8;
    this.master.connect(ctx.destination);

    const noise = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = () => {
      const s = ctx.createBufferSource();
      s.buffer = noise;
      s.loop = true;
      s.start();
      return s;
    };
    const mk = (l: Layer) => {
      const g = ctx.createGain();
      g.gain.value = 0;
      g.connect(this.master);
      this.layers[l] = g;
      return g;
    };

    // radio static
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2800;
    bp.Q.value = 0.6;
    src().connect(bp).connect(mk("static"));

    // wind: lowpassed noise with slow LFO sweeping cutoff
    this.windFilter = ctx.createBiquadFilter();
    this.windFilter.type = "lowpass";
    this.windFilter.frequency.value = 500;
    this.windFilter.Q.value = 4;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoG = ctx.createGain();
    lfoG.gain.value = 260;
    lfo.connect(lfoG).connect(this.windFilter.frequency);
    lfo.start();
    src().connect(this.windFilter).connect(mk("wind"));

    // spacecraft hum
    const hum = mk("hum");
    [55, 110.4, 164.8].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i ? "sine" : "sawtooth";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = i ? 0.25 : 0.08;
      o.connect(g).connect(hum);
      o.start();
    });

    // ambient pad: Dm(add9) voiced wide, detuned
    this.padFilter = ctx.createBiquadFilter();
    this.padFilter.type = "lowpass";
    this.padFilter.frequency.value = 1200;
    this.padFilter.connect(mk("pad"));
    [146.8, 220, 293.7, 329.6, 349.2, 440].forEach((f, i) => {
      [-4, 4].forEach((det) => {
        const o = ctx.createOscillator();
        o.type = "triangle";
        o.frequency.value = f;
        o.detune.value = det;
        const g = ctx.createGain();
        g.gain.value = 0.05;
        const trem = ctx.createOscillator();
        trem.frequency.value = 0.05 + i * 0.03;
        const tg = ctx.createGain();
        tg.gain.value = 0.035;
        trem.connect(tg).connect(g.gain);
        trem.start();
        o.connect(g).connect(this.padFilter);
        o.start();
      });
    });
    this.setMood(this.mood);
  }

  setMood(m: Mood, time = 3) {
    this.mood = m;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const p = MOODS[m];
    (Object.keys(this.layers) as Layer[]).forEach((l) => {
      const g = this.layers[l].gain;
      g.cancelScheduledValues(t);
      g.setValueAtTime(g.value, t);
      g.linearRampToValueAtTime(p[l], t + time);
    });
    this.padFilter.frequency.linearRampToValueAtTime(p.cutoff, t + time);
  }

  /** storm intensity 0..1 — wind up, everything muffled */
  setStorm(v: number) {
    if (!this.ctx || this.mood !== "storm") return;
    const t = this.ctx.currentTime;
    this.layers.wind.gain.setTargetAtTime(0.15 + v * 0.7, t, 0.3);
    this.windFilter.frequency.setTargetAtTime(700 - v * 450, t, 0.3);
    this.layers.pad.gain.setTargetAtTime(0.12 * (1 - v), t, 0.3);
  }

  blip(freq = 880, dur = 0.12, vol = 0.12) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(freq, t);
    o.frequency.exponentialRampToValueAtTime(freq * 1.5, t + dur);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  burst(dur = 1.2, vol = 0.35) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const g = this.layers.static.gain;
    g.cancelScheduledValues(t);
    g.setValueAtTime(vol, t);
    g.linearRampToValueAtTime(0, t + dur);
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.8, this.ctx.currentTime, 0.2);
  }
}

export const audio = new AudioEngine();
