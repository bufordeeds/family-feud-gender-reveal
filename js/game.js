/*
 * Family Feud — Gender Reveal Edition
 * Game logic + host controls + the big reveal.
 *
 * State lives in the `state` object. The board re-renders whenever the
 * question changes; individual slots update in place when revealed.
 */
(function () {
  "use strict";

  // ---------- Elements ----------
  const el = (id) => document.getElementById(id);
  const setupScreen = el("setup");
  const gameScreen = el("game");
  const boardEl = el("board");
  const questionBar = el("question-bar");
  const potValue = el("pot-value");
  const strikesEl = el("strikes");
  const revealOverlay = el("reveal");

  // ---------- Game state ----------
  const state = {
    qIndex: -1, // no question shown yet
    revealed: [], // booleans per answer of current question
    strikes: 0,
    pot: 0,
    scores: [0, 0],
    activeTeam: null, // 0, 1, or null
    teamNames: ["Team Pink", "Team Blue"],
    started: false,
  };

  // Sorted copy of a question's answers (highest points first).
  function sortedAnswers(q) {
    return [...q.answers].sort((a, b) => b.points - a.points);
  }

  // ================= SETUP =================
  el("sound-check").addEventListener("change", (e) => {
    Sound.setEnabled(e.target.checked);
  });

  el("start-btn").addEventListener("click", startGame);

  function startGame() {
    Sound.unlock();
    const t1 = el("team1-name").value.trim() || "Team Pink";
    const t2 = el("team2-name").value.trim() || "Team Blue";
    state.teamNames = [t1, t2];
    el("score-name-1").textContent = t1;
    el("score-name-2").textContent = t2;
    el("award-1-btn").textContent = t1;
    el("award-2-btn").textContent = t2;

    state.started = true;
    setupScreen.classList.remove("active");
    gameScreen.classList.add("active");
    Sound.whoosh();
    nextQuestion();
    // The frame is invisible (display:none) until now, so it has zero
    // size until the browser commits this layout change.
    requestAnimationFrame(layoutMarqueeLights);
  }

  // ================= MARQUEE LIGHTS =================
  const boardFrameEl = el("board-frame");
  const marqueeEl = el("marquee-lights");

  // Walk the frame's actual rounded-rect outline and drop a bulb every
  // ~28px of arc length, including smoothly through the four corners, so
  // the ring is one continuous evenly-spaced row at any screen size.
  function roundedRectPoints(w, h, r, spacing) {
    r = Math.min(r, w / 2, h / 2);
    const segments = [
      { type: "line", x1: r, y1: 0, x2: w - r, y2: 0 }, // top
      { type: "arc", cx: w - r, cy: r, r, a1: -Math.PI / 2, a2: 0 }, // top-right
      { type: "line", x1: w, y1: r, x2: w, y2: h - r }, // right
      { type: "arc", cx: w - r, cy: h - r, r, a1: 0, a2: Math.PI / 2 }, // bottom-right
      { type: "line", x1: w - r, y1: h, x2: r, y2: h }, // bottom
      { type: "arc", cx: r, cy: h - r, r, a1: Math.PI / 2, a2: Math.PI }, // bottom-left
      { type: "line", x1: 0, y1: h - r, x2: 0, y2: r }, // left
      { type: "arc", cx: r, cy: r, r, a1: Math.PI, a2: 1.5 * Math.PI }, // top-left
    ].map((seg) => {
      seg.length =
        seg.type === "line"
          ? Math.hypot(seg.x2 - seg.x1, seg.y2 - seg.y1)
          : Math.abs(seg.a2 - seg.a1) * seg.r;
      return seg;
    });
    const total = segments.reduce((sum, seg) => sum + seg.length, 0);
    const count = Math.max(16, Math.round(total / spacing));
    const points = [];
    for (let i = 0; i < count; i++) {
      let dist = (i * total) / count;
      for (const seg of segments) {
        if (dist <= seg.length) {
          if (seg.type === "line") {
            const t = seg.length === 0 ? 0 : dist / seg.length;
            points.push({ x: seg.x1 + (seg.x2 - seg.x1) * t, y: seg.y1 + (seg.y2 - seg.y1) * t });
          } else {
            const a = seg.a1 + (seg.a2 - seg.a1) * (dist / seg.length);
            points.push({ x: seg.cx + Math.cos(a) * seg.r, y: seg.cy + Math.sin(a) * seg.r });
          }
          break;
        }
        dist -= seg.length;
      }
    }
    return points;
  }

  function layoutMarqueeLights() {
    if (!boardFrameEl || !marqueeEl) return;
    const w = boardFrameEl.clientWidth;
    const h = boardFrameEl.clientHeight;
    if (w === 0 || h === 0) return; // screen not visible yet
    const inset = 9; // keep bulbs just inside the frame's border
    const cornerRadius = 26; // slightly inside the frame's own 30px radius
    const spacing = 28;

    marqueeEl.style.width = `${w}px`;
    marqueeEl.style.height = `${h}px`;
    const points = roundedRectPoints(w - inset * 2, h - inset * 2, cornerRadius, spacing);

    marqueeEl.innerHTML = "";
    const frag = document.createDocumentFragment();
    points.forEach((p, i) => {
      const bulb = document.createElement("span");
      bulb.className = "bulb";
      bulb.style.left = `${p.x + inset}px`;
      bulb.style.top = `${p.y + inset}px`;
      // Alternate-index base rhythm plus a touch of per-bulb randomness so
      // the ring shimmers rather than blinking in lockstep.
      const dur = 1.3 + (i % 3) * 0.25 + Math.random() * 0.2;
      const delay = (i % 2 === 0 ? 0 : dur / 2) + Math.random() * 0.15;
      bulb.style.setProperty("--dur", `${dur.toFixed(2)}s`);
      bulb.style.setProperty("--delay", `${delay.toFixed(2)}s`);
      frag.appendChild(bulb);
    });
    marqueeEl.appendChild(frag);
  }

  let marqueeResizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(marqueeResizeTimer);
    marqueeResizeTimer = setTimeout(layoutMarqueeLights, 150);
  });

  // ================= BOARD RENDERING =================
  function renderBoard() {
    boardEl.innerHTML = "";
    if (state.qIndex < 0) return;
    const q = QUESTIONS[state.qIndex];
    const answers = sortedAnswers(q);

    questionBar.textContent = q.prompt;
    // Show-style layout: answers run DOWN the left column (1,2,3...) then
    // down the right (4,5,6...). Column flow needs an explicit row count.
    const rows = Math.ceil(answers.length / 2);
    boardEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    answers.forEach((ans, i) => {
      const slot = document.createElement("div");
      slot.className = "slot hidden";
      slot.dataset.index = i;

      const rank = document.createElement("div");
      rank.className = "rank";
      rank.textContent = i + 1;

      const text = document.createElement("div");
      text.className = "answer-text";
      text.textContent = ans.text;

      const pts = document.createElement("div");
      pts.className = "answer-points";
      pts.textContent = ans.points;

      slot.append(rank, text, pts);
      slot.addEventListener("click", () => revealAnswer(i));

      if (state.revealed[i]) markRevealed(slot);
      boardEl.appendChild(slot);
    });

    // Pad to an even number of cells for a tidy two-column grid.
    if (answers.length % 2 !== 0) {
      const filler = document.createElement("div");
      filler.className = "slot empty";
      boardEl.appendChild(filler);
    }
  }

  function markRevealed(slot) {
    slot.classList.remove("hidden");
    slot.classList.add("revealed");
  }

  function revealAnswer(i) {
    if (state.qIndex < 0) return;
    if (state.revealed[i]) return;
    const q = QUESTIONS[state.qIndex];
    const answers = sortedAnswers(q);
    if (i >= answers.length) return;

    state.revealed[i] = true;
    state.pot += answers[i].points;
    updatePot();

    const slot = boardEl.querySelector(`.slot[data-index="${i}"]`);
    if (slot) markRevealed(slot);
    Sound.correct();
  }

  // ================= SCORING / STRIKES =================
  function updatePot() {
    potValue.textContent = state.pot;
  }

  function renderStrikes() {
    strikesEl.innerHTML = "";
    for (let i = 0; i < state.strikes; i++) {
      const x = document.createElement("span");
      x.className = "strike-x";
      x.textContent = "✖";
      strikesEl.appendChild(x);
    }
  }

  function addStrike() {
    if (state.qIndex < 0) return;
    if (state.strikes >= 3) return;
    state.strikes += 1;
    Sound.strike();

    // The show moment: a giant ❌ slams into the middle of the screen,
    // hangs for a beat, then flies down into its spot in the strike row.
    const small = document.createElement("span");
    small.className = "strike-x";
    small.style.visibility = "hidden";
    strikesEl.appendChild(small);
    small.textContent = "✖";

    const overlay = document.createElement("div");
    overlay.className = "strike-big-overlay";
    const bigX = document.createElement("span");
    bigX.className = "big-x";
    bigX.textContent = "✖";
    overlay.appendChild(bigX);
    document.body.appendChild(overlay);

    setTimeout(() => {
      // FLIP: translate + shrink the big X onto the small slot's position.
      const from = bigX.getBoundingClientRect();
      const to = small.getBoundingClientRect();
      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      const scale = to.height / from.height;
      bigX.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

      setTimeout(() => {
        small.style.visibility = "";
        overlay.remove();
      }, 480);
    }, 700);
  }

  function clearStrikes() {
    state.strikes = 0;
    renderStrikes();
  }

  function updateScores() {
    el("score-points-1").textContent = state.scores[0];
    el("score-points-2").textContent = state.scores[1];
    el("score-card-1").classList.toggle("active-team", state.activeTeam === 0);
    el("score-card-2").classList.toggle("active-team", state.activeTeam === 1);
  }

  function awardPot(team) {
    if (state.pot === 0) return;
    state.scores[team] += state.pot;
    state.activeTeam = team;
    state.pot = 0;
    updatePot();
    updateScores();
    Sound.cheer();
  }

  // ================= QUESTION NAVIGATION =================
  function loadQuestion(idx) {
    if (idx < 0 || idx >= QUESTIONS.length) return;
    state.qIndex = idx;
    state.revealed = new Array(QUESTIONS[idx].answers.length).fill(false);
    state.strikes = 0;
    state.pot = 0;
    updatePot();
    renderStrikes();
    renderBoard();
    Sound.whoosh();
  }

  function nextQuestion() {
    if (state.qIndex + 1 < QUESTIONS.length) {
      loadQuestion(state.qIndex + 1);
    }
  }

  function prevQuestion() {
    if (state.qIndex > 0) {
      loadQuestion(state.qIndex - 1);
    }
  }

  // ================= WINNER FINALE =================
  let confettiAnim = null;
  let winnerTimer = null;

  function doWinner() {
    const [s1, s2] = state.scores;
    let cls, word, emoji, palette;
    if (s1 === s2) {
      cls = "win-tie";
      word = "It's a Tie!";
      emoji = "🤝 🏆 🤝";
      palette = "tie";
    } else {
      const winner = s1 > s2 ? 0 : 1;
      cls = winner === 0 ? "win-pink" : "win-blue";
      word = `${state.teamNames[winner]}!`;
      emoji = "🏆 🎉 🏆";
      palette = winner === 0 ? "pink" : "blue";
    }

    el("reveal-word").textContent = word;
    el("reveal-emoji").textContent = emoji;
    revealOverlay.classList.remove("win-pink", "win-blue", "win-tie");
    revealOverlay.classList.add("show", "suspense", cls);

    // Build suspense: drumroll under the pulsing "And the winner is…",
    // then pop the name with confetti and a fanfare.
    Sound.drumroll();
    clearTimeout(winnerTimer);
    winnerTimer = setTimeout(() => {
      revealOverlay.classList.remove("suspense");
      Sound.fanfare();
      startConfetti(palette);
    }, 2600);
  }

  function closeReveal() {
    clearTimeout(winnerTimer);
    revealOverlay.classList.remove("show", "suspense");
    stopConfetti();
  }

  el("reveal-close").addEventListener("click", closeReveal);

  // ---------- Confetti ----------
  const canvas = el("confetti");
  const cctx = canvas.getContext("2d");
  let pieces = [];

  function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", sizeCanvas);

  const CONFETTI_PALETTES = {
    blue: ["#3d8bff", "#1560d8", "#9ec9ff", "#ffffff", "#ffd54a"],
    pink: ["#ff5fa2", "#e11d74", "#ffb3d1", "#ffffff", "#ffd54a"],
    tie: ["#ffd54a", "#f5b301", "#ff5fa2", "#3d8bff", "#ffffff"],
  };

  function startConfetti(paletteName) {
    sizeCanvas();
    const palette = CONFETTI_PALETTES[paletteName] || CONFETTI_PALETTES.tie;
    pieces = [];
    for (let i = 0; i < 240; i++) {
      pieces.push(makePiece(palette));
    }
    if (confettiAnim) cancelAnimationFrame(confettiAnim);
    tickConfetti();
  }

  function makePiece(palette) {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: 6 + Math.random() * 8,
      h: 8 + Math.random() * 10,
      color: palette[Math.floor(Math.random() * palette.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      vy: 2 + Math.random() * 4,
      vx: (Math.random() - 0.5) * 2,
      sway: Math.random() * Math.PI * 2,
    };
  }

  function tickConfetti() {
    cctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.sway += 0.03;
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.sway) * 1.2;
      p.rot += p.vr;
      if (p.y > canvas.height + 20) {
        // Recycle to the top for a continuous shower.
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate(p.rot);
      cctx.fillStyle = p.color;
      cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cctx.restore();
    });
    confettiAnim = requestAnimationFrame(tickConfetti);
  }

  function stopConfetti() {
    if (confettiAnim) cancelAnimationFrame(confettiAnim);
    confettiAnim = null;
    cctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // ================= RESTART =================
  function restart() {
    if (!confirm("Restart the whole game? Scores will be reset.")) return;
    state.qIndex = -1;
    state.revealed = [];
    state.strikes = 0;
    state.pot = 0;
    state.scores = [0, 0];
    state.activeTeam = null;
    updatePot();
    updateScores();
    renderStrikes();
    closeReveal();
    gameScreen.classList.remove("active");
    setupScreen.classList.add("active");
  }

  // ================= CONTROL PANEL =================
  el("controls").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    handleAction(btn.dataset.action);
  });

  el("show-controls").addEventListener("click", () => {
    el("controls").style.display = "flex";
    el("show-controls").hidden = true;
  });

  function handleAction(action) {
    switch (action) {
      case "next": nextQuestion(); break;
      case "prev": prevQuestion(); break;
      case "strike": addStrike(); break;
      case "clear-strikes": clearStrikes(); break;
      case "award-1": awardPot(0); break;
      case "award-2": awardPot(1); break;
      case "winner": doWinner(); break;
      case "restart": restart(); break;
      case "hide-controls":
        el("controls").style.display = "none";
        el("show-controls").hidden = false;
        break;
    }
  }

  // ================= KEYBOARD SHORTCUTS =================
  document.addEventListener("keydown", (e) => {
    // Ignore while typing in the setup inputs.
    if (e.target.tagName === "INPUT") return;
    if (!state.started) return;

    if (revealOverlay.classList.contains("show")) {
      if (e.key === "Escape" || e.key === "Enter") closeReveal();
      return;
    }

    const key = e.key.toLowerCase();
    if (key >= "1" && key <= "8") {
      revealAnswer(parseInt(key, 10) - 1);
    } else if (key === "x") {
      addStrike();
    } else if (key === "c") {
      clearStrikes();
    } else if (e.key === "ArrowRight") {
      nextQuestion();
    } else if (e.key === "ArrowLeft") {
      prevQuestion();
    } else if (key === "q") {
      awardPot(0);
    } else if (key === "w") {
      awardPot(1);
    } else if (key === "r") {
      doWinner();
    } else if (key === "h") {
      const c = el("controls");
      const hidden = c.style.display === "none";
      c.style.display = hidden ? "flex" : "none";
      el("show-controls").hidden = hidden;
    }
  });

  // Initialize scoreboards.
  updateScores();
  updatePot();
})();
