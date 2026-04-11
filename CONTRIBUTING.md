# Contributing — Bull Market Relapse Counter

Contributions welcome. The bar is: would a degen on Crypto Twitter find this funny AND useful?

---

## What we need most

### 1. Roast copy (easiest contribution)

The `EXTRA_ROASTS` array in the HTML is the soul of the app. Every addition should:

- **Sting a little.** Generic jokes don't land. Specific crypto trauma does.
- **Be accurate.** It's funnier when it's true.
- **Avoid slurs, hate, or targeting real people.** Self-inflicted shame only.
- **Max 2 sentences.** Punchline up front.

**Good:**
> "Your bottom calls have better timing than your exit calls. Unfortunately."

> "DCA stands for Definitely Called Again."

> "You have more bottom calls than Satoshi has UTXOs."

**Bad:**
> "haha you're bad at trading" — too generic
> "you'll never make it" — too mean-spirited with no wit

To contribute roasts: open a PR adding lines to the `EXTRA_ROASTS` array in `bull-market-relapse.html`. One PR per batch of 3–5 lines max.

---

### 2. Shame Tiers

Current tiers top out at 51+. We could use:
- More granular mid-range tiers (currently 8–15 is a big gap)
- Better labels — funnier or more specific to crypto culture
- Tier-specific roasts (each tier gets its own unique burn)

Edit the `TIERS` array. Keep the `min`/`max`/`label`/`roast` structure.

---

### 3. Bug fixes

Open an issue with:
- Browser + OS
- What happened
- What you expected
- Steps to reproduce

---

### 4. v2 features

See `ROADMAP.md` for the prioritised list. If you want to work on something, open an issue first to avoid duplicate effort.

The highest-value v2 feature is **X/Twitter OAuth auto-import**. If you've built X OAuth flows before, that PR would be very welcome.

---

## Code Style

This is a single vanilla HTML file. Keep it that way for v1.

- No build tools, no bundler, no frameworks
- CSS variables for everything — no hardcoded hex/px values outside `:root`
- JS: no classes, no modules, functions only. Keep it readable.
- New UI elements must follow the existing component patterns (see `DESIGN.md`)
- Test at 375px mobile and 1280px desktop before submitting

---

## PR checklist

- [ ] Works in Chrome and Firefox latest
- [ ] No new external dependencies added (for v1)
- [ ] Follows existing naming conventions
- [ ] If adding roast copy: read it out loud. Does it land?
- [ ] File stays under 50KB

---

## Questions

Open an issue tagged `question`. We'll answer fast.

