# 🐂 Bull Market Relapse Counter

> *"I've been through 3 cycles. I've called the bottom 47 times. I have no regrets."*

A brutally honest tracker for crypto degenerates who can't stop calling the bottom. Log every relapse, track your shame level, and generate a downloadable share card for Twitter/X.

---

## What it does

- **Relapse counter** — one giant red number that grows every time you cave
- **Shame tiers** — unlock new titles from `🌱 First Timer` to `👑 Bottom Is A Lifestyle`
- **Roast engine** — rotating lines of targeted abuse based on your tier
- **Call history** — log the asset, date, price, and what you actually said
- **Outcome tracker** — retrospectively mark each call as *Rekt*, *Right*, or *Too Early*
- **Accuracy score** — shows your real win rate. It's lower than you think.
- **Shame card** — Canvas-generated PNG you can drop straight onto X

---

## Demo

```
🔮 The Bottom Whisperer
        17
times you've called "this is the bottom"

"generational wealth territory, we are so back"
— Apr 10 2026 @ $74,200  ·  🩸 Rekt
```

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | Vanilla HTML/CSS/JS | Zero deps, one file, instant deploy |
| Persistence | `localStorage` | No backend needed for v1 |
| Fonts | Fontshare (Cabinet Grotesk + Satoshi) | Looks expensive, it's free |
| Share card | Canvas API | Native, no library required |
| Deploy | Vercel / Netlify / GitHub Pages | Drop the file, done |

---

## Getting started

```bash
git clone https://github.com/yourname/bull-market-relapse
cd bull-market-relapse

# Option A — just open it
open bull-market-relapse.html

# Option B — local dev server
npx serve .

# Option C — deploy to Vercel
npx vercel --prod
```

No npm install. No build step. One file.

---

## Project structure

```
bull-market-relapse/
├── bull-market-relapse.html   ← The entire app
└── README.md
```

---

## Shame Tiers

| Calls | Title |
|---|---|
| 0 | 🌱 First Timer |
| 1–3 | 🐂 Cautious Optimist |
| 4–7 | 🔴 Pattern Emerging |
| 8–15 | 💀 Certified Permabull |
| 16–25 | 🔮 The Bottom Whisperer |
| 26–50 | 🎰 High Conviction Animal |
| 51+ | 👑 Bottom Is A Lifestyle |

---

## Roadmap — v2 ideas

### High value
- [ ] **X/Twitter OAuth** — auto-import tweets containing "the bottom", "we're back", "bought the dip" etc. One-click shame import.
- [ ] **Public shame profiles** — shareable URL like `bullmarketrelapse.lol/@yourhandle`
- [ ] **Community leaderboard** — opt-in wall of fame/shame
- [ ] **Supabase backend** — persist across devices

### Fun additions
- [ ] **Bottom Call Bingo** — autogenerate a card with classic bottom-call phrases; cross them off as you go
- [ ] **Price oracle** — pull real BTC/ETH price at the logged date to calculate exactly how wrong you were
- [ ] **Confetti on "Actually Right"** — you deserve it
- [ ] **Daily reminder** — optional push notification: "You haven't called the bottom today. Stay strong."
- [ ] **Year in Review** — annual PDF shame report

### Viral mechanics
- [ ] **Challenge mode** — dare a friend to track theirs, both profiles linked
- [ ] **Streak badges** — "30 days clean" badge for the reformed
- [ ] **Relapse streaks** — "Called the bottom 3 times this week" badge

---

## Deployment (Vercel, 30 seconds)

1. Push to GitHub
2. Connect repo to [vercel.com](https://vercel.com)
3. Set output directory to `.`
4. Deploy → grab the URL → post your shame

---

## Contributing

PRs welcome. The roast copy pool (`EXTRA_ROASTS` array) can always be funnier. Minimum bar: the line must sting a little.

---

## License

MIT — use it, fork it, shame your friends with it.

---

*Built for the perpetually early. WAGMI — eventually.*
