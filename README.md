# 👶 Family Feud — Gender Reveal Edition

A **Family Feud** style party game with a baby/gender-reveal theme, a
show-style marquee board, and a big animated **"And the winner is…"**
finale. Built to run in any browser and cast to your TV — no install, no
internet, no accounts. Perfect entertainment *during* a gender reveal party.

See **[RULES.md](RULES.md)** for how the game is played (face-offs, strikes,
steals) and how those rules map to the on-screen controls.

![Gender reveal party game](https://img.shields.io/badge/play-in%20any%20browser-ffd54a)

---

## ▶ How to play it this weekend

You have two easy options to get it on the TV:

**Option A — Cast a Chrome tab (Chromecast / Google TV / most smart TVs)**
1. Open `index.html` in **Google Chrome** on your laptop or phone.
   (Double-click the file, or drag it into a Chrome window.)
2. Click the **⋮** menu in Chrome → **Cast…** → pick your TV.
3. Choose **"Cast tab"**. The game now fills your TV.
4. Control the game from your laptop/phone — the TV mirrors it live.

**Option B — HDMI cable (works with any TV)**
1. Plug your laptop into the TV with an HDMI cable.
2. Set the TV to that HDMI input.
3. Open `index.html` in your browser and press **F11** for full screen.

> Tip: press **F11** for full-screen either way so the board fills the whole TV.

---

## 🎮 Running the game (host guide)

1. **Setup screen**
   - Name the two teams (e.g. *Team Pink* vs *Team Blue* — guests can
     join the side matching their gender guess!).
   - Leave sound on for the classic *ding!* and buzzer.
   - Click **Start the Game**.

2. **Open the host answer key on your phone** 📱
   - Open **[`HOST-KEY.md`](HOST-KEY.md)** in the GitHub mobile app (or
     any second screen the guests can't see). It lists every question
     with all its answers, points, and — crucially — the **number** of
     the board slot each answer is hiding in. When someone guesses
     "Pickles" and your key shows Pickles = #2, press `2` on the game
     screen to flip it.
   - ⚠️ Keep the key on your phone only — never cast that screen.

3. **Playing a round** (just like the TV show)
   - Read the survey question at the top out loud.
   - When a family member guesses an answer that's on the board, check
     your phone key for its number, and reveal it.
   - Wrong or not-on-the-board guesses earn a **strike** (❌❌❌).
   - Each revealed answer adds its points to the **POT** in the middle.
   - When a team wins the round, **award the pot** to them.

4. **The finale**
   - After the last round, hit the glowing **🏆 AND THE WINNER IS… 🏆**
     button. A drumroll builds the suspense, then confetti rains in the
     winning team's colors and the TV announces the champion.

### Host controls & keyboard shortcuts
You can use the on-screen buttons or these keys (great with a wireless
keyboard or presentation remote):

| Key | Action |
|-----|--------|
| `1`–`8` | Reveal that answer on the board |
| `X` | Add a strike ❌ |
| `C` | Clear strikes |
| `→` / `←` | Next / previous question |
| `Q` / `W` | Award the pot to Team 1 / Team 2 |
| `R` | Announce the winner 🏆 |
| `H` | Hide / show the host control panel |

> Hide the host panel (`H`) once you're rolling so the TV shows a clean board.

---

## ✏️ Customize the questions

All the survey questions and answers live in **`js/questions.js`** — plain,
easy-to-edit text. Add your own inside jokes, change point values, or swap in
names your family will recognize. Keep 5–8 answers per question so they fit
the board. No build step: save the file and refresh the browser.

---

## 🗂 What's in here

```
index.html        The whole game (open this on the TV)
HOST-KEY.md       Host answer key (open in GitHub app on your phone)
css/styles.css    Board styling, tuned for a big TV
js/questions.js   The survey questions — edit these!
js/audio.js       Sound effects (generated live, no audio files)
js/game.js        Game logic, scoring, and the reveal
```

Everything is self-contained and works offline — perfect for a house full of
family and spotty Wi-Fi. Have fun, and congratulations! 🍼
