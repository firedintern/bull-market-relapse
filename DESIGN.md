# Design System — Bull Market Relapse Counter

## Art Direction

> **Concept:** A crypto AA meeting — equal parts self-help and public shaming.
> **Tone:** Dark, dry, a little aggressive. Like a Terminal but for bad decisions.
> **Palette:** Warm dark surfaces + single red accent. No gradients. No blue. No purple.
> **Density:** Balanced — generous hero, dense history list.

---

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#0d0c0c` | Page background |
| `--surface` | `#141212` | Cards, form panels |
| `--surface-2` | `#1a1818` | Input backgrounds |
| `--surface-3` | `#222020` | Price pill, offset elements |
| `--surface-4` | `#2c2929` | Progress bar track |
| `--border` | `#2a2727` | All borders |
| `--text` | `#e5dfdf` | Primary text (warm white) |
| `--muted` | `#74706f` | Labels, secondary text |
| `--faint` | `#3e3b3b` | Tertiary / decorative |
| `--red` | `#e03535` | Primary accent — counter, badges, CTAs |
| `--red-dim` | `rgba(224,53,53,0.14)` | Red tinted surfaces |
| `--red-glow` | `rgba(224,53,53,0.4)` | Button hover shadow |
| `--green` | `#4a8a2c` | "Actually Right" outcome |
| `--green-dim` | `rgba(74,138,44,0.13)` | Green badge background |
| `--amber` | `#b87c28` | "Too Early" outcome |
| `--amber-dim` | `rgba(184,124,40,0.13)` | Amber badge background |

### Design Philosophy

- **One accent color.** Red and red only for interactive/emphasis elements.
- **Warm neutrals.** All surfaces trend warm (`#0d0c0c` not `#0d0d0d`) so the red reads as vivid, not corporate.
- **No gradients on UI elements.** Especially not buttons — solid red only.
- **OKLCH alpha blending in production.** In v2, switch to `color-mix(in oklch, ...)` for surface tinting.

---

## Typography

| Font | Role | Source | Weights |
|---|---|---|---|
| **Cabinet Grotesk** | Display — counter, headings, share card | Fontshare | 700, 800, 900 |
| **Satoshi** | Body — all UI text | Fontshare | 400, 500, 700 |

### Type Scale

```css
--t-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem)  /* 12–14px — labels, badges */
--t-sm:   clamp(0.875rem, 0.8rem  + 0.35vw, 1rem)       /* 14–16px — buttons, inputs */
--t-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem)   /* 16–18px — body copy */
--t-lg:   clamp(1.125rem, 1rem    + 0.75vw, 1.5rem)     /* 18–24px — section headings */
--t-xl:   clamp(1.5rem,   1.2rem  + 1.25vw, 2.25rem)    /* 24–36px — page title */
--t-2xl:  clamp(2rem,     1.2rem  + 2.5vw,  3.5rem)     /* 32–56px — stat numbers */
```

**Big counter:** `clamp(6rem, 18vw, 11rem)` — intentionally oversized, the whole point is that number is hard to ignore.

### Rules
- Cabinet Grotesk only at `--t-xl` (24px) and above
- All labels: `uppercase`, `letter-spacing: 0.08em`, `font-weight: 700`
- Counter and stat numbers: `letter-spacing: -0.03em` or tighter (tight tracking on heavy numerals)

---

## Spacing System (4px grid)

```
--s1: 4px   --s2: 8px   --s3: 12px  --s4: 16px
--s5: 20px  --s6: 24px  --s8: 32px  --s10: 40px
--s12: 48px --s16: 64px
```

---

## Radius Tokens

```
--r-sm:   6px    (price pill, small tags)
--r-md:   8px    (inputs, small buttons)
--r-lg:   12px   (cards, history items)
--r-xl:   16px   (form card, modal)
--r-full: 9999px (badges, tier pill)
```

**Nested radius rule:** inner element radius = outer radius − padding gap.

---

## Component Breakdown

### Counter Display
```
font: Cabinet Grotesk 900
size: clamp(6rem, 18vw, 11rem)
color: --red
text-shadow: 0 0 80px rgba(224,53,53,.3)
transition: text-shadow .3s (flashes on new entry)
```
Animates numerically from current → new value over ~22ms steps.

### Tier Badge (pill)
```
display: inline-flex
background: --red-dim
border: 1px solid --red
color: --red
font-size: --t-xs, uppercase, tracked
border-radius: --r-full
padding: 4px 12px
```

### Roast Card
```
background: --red-dim
border: 1px solid rgba(224,53,53,.25)
border-radius: --r-lg
Hidden at 0 calls, fades in at 1+
Quote marks: CSS ::before / ::after with opacity .4
```

### Stat Card
```
background: --surface
border: 1px solid --border
Number: Cabinet Grotesk 900, --t-2xl
Label: --t-xs, uppercase, --muted
Colors: red (negative stats), green (positive), white (neutral)
```

### Call History Card (`.call-card`)
```
Grid: 1fr auto (collapses to 1fr on mobile)
Left: asset tag + date + price pill + quote
Right: outcome badge + outcome selector + delete
Outcome badge colors: wait→grey, rekt→red, right→green, early→amber
```

### Share Card (Canvas)
```
Canvas: 1000 × 560px
Background: #0d0c0c + noise grain (6000 1px dots, opacity ~0.012)
Glow: radial gradient centered, red, 230px radius
Border: 2px, rgba(224,53,53,.28), radius 12px
Fonts loaded from Fontshare at runtime (Canvas uses CSS-loaded fonts)
Stats: 4 rounded-rect panels, 175×68px each, centered bottom row
Watermark: bottom-right, --faint
```

---

## Motion

| Element | Transition | Notes |
|---|---|---|
| All interactive | `180ms cubic-bezier(.16,1,.3,1)` | Global default |
| Counter number | 22ms stepped animation, 25 steps | Runs on every data change |
| Counter flash | `text-shadow` toggle, .3s | Fires on new relapse added |
| Progress bar fill | `.7s cubic-bezier(.34,1.56,.64,1)` | Slight overshoot feel |
| Modal open | `opacity` + `scale(.95)→scale(1)` + `translateY` | Both overlay and modal panel |
| Button hover | `translateY(-1px)` + box-shadow | Primary button only |

`prefers-reduced-motion` — add to v2. Currently all CSS transitions; wrapping in `@media (prefers-reduced-motion: reduce)` will disable them cleanly.

---

## Logo (SVG)

Inline SVG bull icon in the header:
- Circle outline in `--red`
- Two horns curving up
- Face ellipse in `--text`
- Dot eyes + nostrils
- One green teardrop (the detail that makes it funny)

Works at 24px and 200px. Monochrome-friendly.

---

## Accessibility Notes

- All form inputs have associated `<label>` elements
- Delete buttons have `title` attributes
- Modal closes on `Escape` and overlay click
- Focus ring: `2px solid var(--red)` via browser default (add `:focus-visible` explicit rule in v2)
- Color contrast: `--text` (#e5dfdf) on `--surface` (#141212) = ~12:1 ✅
- Touch targets: all buttons ≥ 44px effective tap area ✅

---

## File Size Budget

| Asset | Target |
|---|---|
| HTML + CSS + JS (single file) | < 40KB |
| No external JS dependencies | 0KB |
| Fonts (Fontshare CDN) | ~80KB, async |
| Total initial load | < 130KB |

---

## Dark Mode

App is dark-mode only by design. The concept (shame counter, red accent, warm-dark surfaces) only works in dark mode. No light mode planned — it would undercut the visual tone.

