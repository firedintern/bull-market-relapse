# Roadmap — Bull Market Relapse Counter

## Version History

| Version | Status | Description |
|---|---|---|
| v1.0 | ✅ Shipped | Single-file app, localStorage, share card |

---

## v1.1 — Polish (1–2 days)

Small improvements that don't require a backend.

- [ ] **Price oracle** — on log, fetch the real BTC/ETH/SOL price at the entered date via CoinGecko public API. Auto-fill the price field and display "you were X% off from the real bottom" in the history card.
- [ ] **Confetti on "Actually Right"** — fire a confetti burst when outcome is updated to ✅. Use `canvas-confetti` CDN.
- [ ] **"30 days clean" badge** — if `daysSince >= 30`, show a green sobriety badge below the counter.
- [ ] **Import/Export JSON** — backup and restore your calls. One button each.
- [ ] **`prefers-reduced-motion`** — disable counter animation and flash for accessibility.
- [ ] **OG meta tags** — `og:image`, `og:title`, `twitter:card` so the site previews correctly when shared.

---

## v2.0 — Social Layer (1–2 weeks)

This is the version that has real viral potential.

### X/Twitter OAuth Auto-Import ⭐
The biggest single feature. Users log in with X, the app searches their tweet history for phrases like:
- "this is the bottom"
- "we're so back"
- "generational buying opportunity"
- "bought the dip"
- "not selling"
- "accumulating here"
- "max pain zone"

Each matching tweet becomes a pre-populated relapse entry (date, quote, asset inferred from context). The shame imports itself.

**Tech:** X API v2 search endpoint (`/2/tweets/search/recent` + user context). Requires OAuth 2.0 PKCE. Store token in memory only (no localStorage in sandboxed deploys).

### Public Shame Profiles
- Shareable URL: `bullmarketrelapse.lol/@yourhandle`
- Public view of counter, tier, and call history (outcomes hidden by default)
- "Challenge" button: sends a friend a link to set up their own counter

### Backend (Supabase)
```
users         (id, twitter_handle, created_at)
calls         (id, user_id, asset, date, price, quote, outcome, created_at)
```
Row-level security: users can only write their own calls. Public profiles are read-only.

### Community Leaderboard
- Opt-in only
- Ranks by: total calls, highest rekt streak, lowest accuracy
- Weekly reset for "most relapses this week"
- Shareable weekly shame report image

---

## v2.1 — Gamification

- [ ] **Streak system** — "X days without calling the bottom" streak counter with milestone badges (7d, 30d, 100d)
- [ ] **Relapse streaks** — "3 calls in 7 days" badge (Peak Degen Week)
- [ ] **Achievement unlocks** — first call, first rekt, 10 calls, 50% accuracy, etc.
- [ ] **Bottom Call Bingo** — autogenerate a 5×5 bingo card with classic phrases. Mark them off as you call them.
- [ ] **Annual Shame Report** — Spotify Wrapped-style PDF/image showing your worst calls of the year

---

## v3.0 — Data Product

Turn the community data into something actually useful.

- [ ] **Collective Bottom Indicator** — aggregate signal: when many users log a call at the same time, that's historically a contrarian buy signal. Publish it as a free API endpoint.
- [ ] **Asset-specific stats** — "BTC has been called the bottom 12,847 times this cycle by our users"
- [ ] **Narrative heatmap** — which phrases correlate most with actual bottoms vs. midway traps
- [ ] **Embed widget** — `<iframe>` or JS snippet for newsletters / dashboards showing the community counter

---

## Won't Build

- Light mode — the dark aesthetic is part of the product identity
- Mobile app — the web app works fine on mobile; a native app adds complexity without much upside
- Paid tier — the product works best if everyone can share freely; monetize via sponsorships if needed

---

## Tech Stack Evolution

| Version | Frontend | Backend | Auth | DB |
|---|---|---|---|---|
| v1 | Vanilla HTML | None | None | localStorage |
| v2 | Next.js 15 App Router | Next.js API routes | NextAuth + X OAuth | Supabase (Postgres) |
| v3 | Next.js + tRPC | tRPC | Same | Supabase + Redis (leaderboard cache) |

