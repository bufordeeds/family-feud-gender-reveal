/*
 * Sound effects generated with the Web Audio API — no audio files needed,
 * so the whole game works offline and from a plain folder.
 *
 * Browsers block audio until the user interacts with the page, so we lazily
 * create the AudioContext on the first sound and resume it if suspended.
 */
const Sound = (() => {
  let ctx = null;
  let enabled = true;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // A simple oscillator "note" with an envelope.
  function tone({ freq, start = 0, dur = 0.3, type = "sine", gain = 0.3 }) {
    const c = ac();
    const t0 = c.currentTime + start;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  function slide({ from, to, start = 0, dur = 0.3, type = "sawtooth", gain = 0.25 }) {
    const c = ac();
    const t0 = c.currentTime + start;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t0);
    osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  const api = {
    setEnabled(v) {
      enabled = v;
    },
    isEnabled() {
      return enabled;
    },
    // Warm up the context on a user gesture.
    unlock() {
      if (enabled) ac();
    },
    // Correct answer — the classic bright "ding!"
    correct() {
      if (!enabled) return;
      tone({ freq: 880, dur: 0.18, type: "sine", gain: 0.35 });
      tone({ freq: 1320, start: 0.05, dur: 0.3, type: "sine", gain: 0.3 });
    },
    // Wrong answer — the classic harsh "EHHHH" game-show buzzer: two
    // detuned sawtooths beating against each other with a fast vibrato
    // wobble, run through a low-pass filter for that electric-horn grit.
    strike() {
      if (!enabled) return;
      const c = ac();
      const t0 = c.currentTime;
      const dur = 0.85;

      const osc1 = c.createOscillator();
      const osc2 = c.createOscillator();
      osc1.type = "sawtooth";
      osc2.type = "sawtooth";
      osc1.frequency.setValueAtTime(110, t0);
      osc2.frequency.setValueAtTime(114, t0); // slight detune for buzz beating

      const lfo = c.createOscillator();
      const lfoGain = c.createGain();
      lfo.frequency.value = 17; // fast wobble, like an electric buzzer horn
      lfoGain.gain.value = 7;
      lfo.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);

      const filter = c.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 950;

      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.32, t0 + 0.03);
      g.gain.setValueAtTime(0.32, t0 + dur * 0.72);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(g).connect(c.destination);

      lfo.start(t0);
      osc1.start(t0);
      osc2.start(t0);
      lfo.stop(t0 + dur + 0.05);
      osc1.stop(t0 + dur + 0.05);
      osc2.stop(t0 + dur + 0.05);
    },
    // Round transition / reveal whoosh.
    whoosh() {
      if (!enabled) return;
      slide({ from: 200, to: 900, dur: 0.35, type: "triangle", gain: 0.2 });
    },
    // Little UI click.
    click() {
      if (!enabled) return;
      tone({ freq: 520, dur: 0.08, type: "triangle", gain: 0.18 });
    },
    // Applause-ish noise burst for big moments.
    cheer() {
      if (!enabled) return;
      const c = ac();
      const dur = 1.4;
      const bufferSize = c.sampleRate * dur;
      const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.min(1, i / (c.sampleRate * 0.1)) * (1 - i / bufferSize);
        data[i] = (Math.random() * 2 - 1) * env * 0.5;
      }
      const src = c.createBufferSource();
      const g = c.createGain();
      const filter = c.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1600;
      g.gain.value = 0.35;
      src.buffer = buffer;
      src.connect(filter).connect(g).connect(c.destination);
      src.start();
    },
    // Drumroll under the "And the winner is…" suspense (~2.6s).
    drumroll() {
      if (!enabled) return;
      for (let i = 0; i < 26; i++) {
        tone({ freq: 110 + (i % 2) * 8, start: i * 0.1, dur: 0.09, type: "square", gain: 0.16 });
      }
    },
  };
  // Triumphant fanfare for the winner reveal.
  api.fanfare = function () {
    if (!enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      tone({ freq: f, start: i * 0.16, dur: 0.5, type: "triangle", gain: 0.3 });
    });
    tone({ freq: 1046.5, start: 0.72, dur: 1.0, type: "triangle", gain: 0.34 });
    api.cheer();
  };
  return api;
})();
