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
    secretGender: null, // "boy" | "girl"
    started: false,
  };

  // Sorted copy of a question's answers (highest points first).
  function sortedAnswers(q) {
    return [...q.answers].sort((a, b) => b.points - a.points);
  }

  // ================= SETUP =================
  const secretButtons = document.querySelectorAll(".secret-btn");
  secretButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      Sound.unlock();
      Sound.click();
      let g = btn.dataset.gender;
      if (g === "random") {
        g = Math.random() < 0.5 ? "boy" : "girl";
      }
      state.secretGender = g;
      secretButtons.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      // Deliberately vague status so onlookers can't tell what was picked.
      el("secret-status").textContent = "✓ Reveal is locked in and hidden";
    });
  });

  el("sound-check").addEventListener("change", (e) => {
    Sound.setEnabled(e.target.checked);
  });

  el("start-btn").addEventListener("click", startGame);

  function startGame() {
    Sound.unlock();
    if (!state.secretGender) {
      // Default to a coin flip if the host forgot to set it.
      state.secretGender = Math.random() < 0.5 ? "boy" : "girl";
    }
    const t1 = el("team1-name").value.trim() || "Team Pink";
    const t2 = el("team2-name").value.trim() || "Team Blue";
    el("score-name-1").textContent = t1;
    el("score-name-2").textContent = t2;
    el("award-1-btn").textContent = t1;
    el("award-2-btn").textContent = t2;

    state.started = true;
    setupScreen.classList.remove("active");
    gameScreen.classList.add("active");
    Sound.whoosh();
    nextQuestion();
  }

  // ================= BOARD RENDERING =================
  function renderBoard() {
    boardEl.innerHTML = "";
    if (state.qIndex < 0) return;
    const q = QUESTIONS[state.qIndex];
    const answers = sortedAnswers(q);

    questionBar.textContent = q.prompt;
    boardEl.classList.toggle("single-col", answers.length <= 5);

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
    if (!boardEl.classList.contains("single-col") && answers.length % 2 !== 0) {
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
    renderStrikes();
    Sound.strike();
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

  // ================= THE BIG REVEAL =================
  let confettiAnim = null;

  function doReveal() {
    const gender = state.secretGender || "boy";
    revealOverlay.classList.remove("boy", "girl");
    revealOverlay.classList.add("show", gender);

    el("reveal-word").textContent = gender === "boy" ? "Boy!" : "Girl!";
    el("reveal-emoji").textContent = gender === "boy" ? "💙 👶 💙" : "💖 👶 💖";

    Sound.fanfare();
    startConfetti(gender);
  }

  function closeReveal() {
    revealOverlay.classList.remove("show");
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

  function startConfetti(gender) {
    sizeCanvas();
    const palette =
      gender === "boy"
        ? ["#3d8bff", "#1560d8", "#9ec9ff", "#ffffff", "#ffd54a"]
        : ["#ff5fa2", "#e11d74", "#ffb3d1", "#ffffff", "#ffd54a"];
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
      case "reveal": doReveal(); break;
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
      doReveal();
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
