'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import type { Call, Outcome } from '@/lib/types'

// ── Tiers ────────────────────────────────────────────────────────────────────
const TIERS = [
  { min: 0,  max: 0,  label: '🌱 First Timer',           roast: null },
  { min: 1,  max: 3,  label: '🐂 Cautious Optimist',      roast: "Still early days. Your conviction is genuinely adorable." },
  { min: 4,  max: 7,  label: '🔴 Pattern Emerging',       roast: "The chart may be down, but your optimism never wavered. That's something." },
  { min: 8,  max: 15, label: '💀 Certified Permabull',    roast: "At this point you're not calling bottoms, you're ordering them like pizza." },
  { min: 16, max: 25, label: '🔮 The Bottom Whisperer',   roast: "You've been right so many times — you just haven't found out yet." },
  { min: 26, max: 50, label: '🎰 High Conviction Animal', roast: "The bottom isn't a location you visit. It's a state of mind you live in." },
  { min: 51, max: Infinity, label: '👑 Bottom Is A Lifestyle', roast: "Researchers study you. The bottom literally moves when you tweet." },
]

const EXTRA_ROASTS = [
  "Your bottom calls have their own Linktree at this point.",
  "If you were a technical indicator you'd be a perpetual oversold signal.",
  "DCA stands for Definitely Called Again.",
  "Your friends turned off your notifications but they still follow for the lore.",
  "The market is in price discovery. You're in denial discovery.",
  "You have more bottom calls than Satoshi has UTXOs.",
  "TradFi analysts have a case study on your conviction. Unpublished. Out of respect.",
  "Your bottom calls have better timing than your exit calls. Unfortunately.",
  "NGMI is a mindset. You've adopted it as an identity.",
  "You've seen so many bottoms you qualify for a loyalty card.",
  "Every candle is a buying opportunity. Every wick is confirmation. You are at peace.",
  "Position size: max. Conviction: unwavering. Outcome: TBD.",
]

const MILESTONE_ROASTS: Record<number, string> = {
  10:  "10. A round number. A warning sign.",
  25:  "25 times. You are statistically not learning.",
  50:  "50 bottom calls. This is no longer a mistake. It's a philosophy.",
  100: "100. Three digits. You have achieved something.",
}

const OUTCOME_BADGE: Record<Outcome, { label: string; cls: string }> = {
  waiting: { label: '⏳ Waiting',    cls: 'bg-[rgba(104,107,130,0.12)] text-[#484b5e]' },
  rekt:    { label: '🩸 Rekt',       cls: 'bg-[rgba(220,38,38,0.12)] text-[#991b1b]' },
  right:   { label: '✅ Right',      cls: 'bg-[rgba(20,158,97,0.16)] text-[#026b3f]' },
  early:   { label: '⚡ Too Early',  cls: 'bg-[rgba(217,119,6,0.14)] text-[#92400e]' },
}

const QUOTE_PLACEHOLDERS = [
  '"generational wealth territory, we are so back"',
  '"this is literally the bottom, i\'ve never been more sure"',
  '"accumulation phase confirmed, loading up"',
  '"the whales are buying, i can feel it"',
  '"we are so early, this is a gift"',
  '"100k by end of month, calling it now"',
  '"just bought more, this is free money"',
  '"the fundamentals have never been stronger"',
]

const EASTER_PRICES: Record<string, string> = {
  '69420': '69,420. of course.',
  '69,420': '69,420. of course.',
  '$69420': '69,420. of course.',
  '$69,420': '69,420. of course.',
  '420': 'nice.',
  '$420': 'nice.',
  '100000': 'you called it at 100k. bold.',
  '$100000': 'you called it at 100k. bold.',
  '$100,000': 'you called it at 100k. bold.',
  '100,000': 'you called it at 100k. bold.',
}

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

function getTier(n: number) {
  return TIERS.find(t => n >= t.min && n <= t.max) ?? TIERS[TIERS.length - 1]
}

function getRoast(calls: Call[]) {
  const n = calls.length
  if (MILESTONE_ROASTS[n]) return MILESTONE_ROASTS[n]
  const tier = getTier(n)
  if (n > 8) return EXTRA_ROASTS[n % EXTRA_ROASTS.length]
  return tier.roast ?? ''
}

function stats(calls: Call[]) {
  const total = calls.length
  const rekt = calls.filter(c => c.outcome === 'rekt').length
  const right = calls.filter(c => c.outcome === 'right').length
  const resolved = rekt + right
  const acc = resolved > 0 ? Math.round((right / resolved) * 100) : null
  const lastDate = calls.length > 0 ? new Date(calls[0].date) : null
  const days = lastDate ? Math.floor((Date.now() - lastDate.getTime()) / 86400000) : null
  return { total, rekt, right, acc, days }
}

// ── Component ────────────────────────────────────────────────────────────────
export function Counter({ session }: { session: Session }) {
  const user = session.user as { id?: string; username?: string; twitter_handle?: string; image?: string; name?: string }
  const username = user.username ?? user.twitter_handle ?? user.name ?? 'you'
  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${username}`

  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [flash, setFlash] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [konamiToast, setKonamiToast] = useState<string | null>(null)
  const [easterMsg, setEasterMsg] = useState<string | null>(null)

  // Form state
  const today = new Date().toISOString().split('T')[0]
  const [fAsset, setFAsset] = useState('BTC')
  const [fDate, setFDate] = useState(today)
  const [fPrice, setFPrice] = useState('')
  const [fOutcome, setFOutcome] = useState<Outcome>('waiting')
  const [fQuote, setFQuote] = useState('')

  // Console easter egg
  useEffect(() => {
    console.log('%c Bull Market Relapse Counter ', 'background:#7132f5;color:#fff;font-size:14px;font-weight:bold;padding:4px 8px;border-radius:3px')
    console.log('%cYou found the console. Respect.', 'color:#686b82;font-size:12px')
    console.log('%cIf you\'re reading this, you\'ve called the bottom at least once. We both know it.', 'color:#101114;font-size:11px')
  }, [])

  // Konami code
  useEffect(() => {
    let idx = 0
    function onKey(e: KeyboardEvent) {
      if (e.key === KONAMI[idx]) {
        idx++
        if (idx === KONAMI.length) {
          idx = 0
          const msg = calls.length === 0
            ? "cheat code activated. you still haven't called the bottom."
            : `cheat code activated. still doesn't make ${calls.length} calls go away.`
          setKonamiToast(msg)
          setTimeout(() => setKonamiToast(null), 3000)
          if (!window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
            confetti({ particleCount: 15, spread: 60, origin: { x: .5, y: .4 }, colors: ['#7132f5', '#dedee5', '#101114'], scalar: .7 })
          }
        }
      } else {
        idx = e.key === KONAMI[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [calls.length])

  // Live price
  const PRICE_IDS: Record<string, string> = { BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana' }
  useEffect(() => {
    const id = PRICE_IDS[fAsset]
    if (!id) { setFPrice(''); return }
    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`)
      .then(r => r.json())
      .then(d => { if (d[id]?.usd) setFPrice(`$${d[id].usd.toLocaleString()}`) })
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fAsset])

  // Rotating placeholder
  const [phIdx, setPhIdx] = useState(0)
  const quoteRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const id = setInterval(() => {
      if (document.activeElement !== quoteRef.current)
        setPhIdx(i => (i + 1) % QUOTE_PLACEHOLDERS.length)
    }, 6000)
    return () => clearInterval(id)
  }, [])

  // Load calls
  useEffect(() => {
    fetch('/api/calls')
      .then(r => r.json())
      .then(data => {
        console.log('[calls] GET response:', data)
        setCalls(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => { console.error('[calls] GET error:', err); setLoading(false) })
  }, [])

  const s = stats(calls)
  const tier = getTier(s.total)
  const roast = getRoast(calls)
  const tierIdx = TIERS.indexOf(tier)
  const nextTier = TIERS[tierIdx + 1]
  const progress = nextTier
    ? Math.round(((s.total - tier.min) / (nextTier.min - tier.min)) * 100)
    : 100

  function fireConfetti() {
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return
    confetti({ particleCount: 30, angle: 60, spread: 55, origin: { x: 0, y: .65 }, colors: ['#dc2626', '#e5dfdf', '#3e3b3b'] })
    setTimeout(() => {
      confetti({ particleCount: 30, angle: 120, spread: 55, origin: { x: 1, y: .65 }, colors: ['#dc2626', '#e5dfdf', '#3e3b3b'] })
    }, 150)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  async function addCall() {
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset: fAsset, date: fDate, price: fPrice || null, outcome: fOutcome, quote: fQuote || null }),
      })
      const newCall = await res.json()
      console.log('[calls] POST response:', res.status, newCall)
      if (res.ok) {
        const updated = [newCall, ...calls]
        setCalls(updated)
        setFlash(true); setTimeout(() => setFlash(false), 300)
        const newTier = getTier(updated.length)
        if (TIERS.indexOf(newTier) > tierIdx) showToast(`Tier unlocked: ${newTier.label}`)
        if (fOutcome === 'right' || fOutcome === 'early') fireConfetti()
        setFPrice(''); setFQuote(''); setFDate(today); setEasterMsg(null)
      } else {
        showToast(newCall?.error ?? `Error ${res.status}`)
      }
    } catch (err) {
      console.error('[calls] POST error:', err)
      showToast('Network error — try again')
    }
    setSubmitting(false)
  }

  async function updateOutcome(id: string, outcome: Outcome) {
    const res = await fetch(`/api/calls/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome }),
    })
    if (res.ok) {
      const updated = await res.json()
      setCalls(calls.map(c => c.id === id ? updated : c))
      if (outcome === 'right' || outcome === 'early') fireConfetti()
    }
  }

  async function deleteCall(id: string) {
    if (confirmDelete !== id) { setConfirmDelete(id); return }
    await fetch(`/api/calls/${id}`, { method: 'DELETE' })
    setCalls(calls.filter(c => c.id !== id))
    setConfirmDelete(null)
  }

  const [shareOpen, setShareOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function rrect(cx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    cx.beginPath()
    cx.moveTo(x+r,y); cx.lineTo(x+w-r,y)
    cx.quadraticCurveTo(x+w,y,x+w,y+r); cx.lineTo(x+w,y+h-r)
    cx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); cx.lineTo(x+r,y+h)
    cx.quadraticCurveTo(x,y+h,x,y+h-r); cx.lineTo(x,y+r)
    cx.quadraticCurveTo(x,y,x+r,y); cx.closePath()
  }

  const drawCard = useCallback(() => {
    const cv = canvasRef.current
    if (!cv) return
    const cx = cv.getContext('2d')!
    const W = 1000, H = 560
    cv.width = W; cv.height = H

    // bg
    cx.fillStyle = '#ffffff'; cx.fillRect(0, 0, W, H)

    // purple glow
    const g = cx.createRadialGradient(W/2, H/2-30, 5, W/2, H/2-30, 280)
    g.addColorStop(0, 'rgba(113,50,245,.07)'); g.addColorStop(1, 'rgba(113,50,245,0)')
    cx.fillStyle = g; cx.fillRect(0, 0, W, H)

    // border
    rrect(cx, 1, 1, W-2, H-2, 16)
    cx.strokeStyle = '#dedee5'; cx.lineWidth = 2; cx.stroke()

    // tier badge
    cx.font = '600 13px "IBM Plex Sans", sans-serif'
    cx.textAlign = 'center'
    const tw = cx.measureText(tier.label).width
    const bx = W/2-tw/2-16, by = 52, bw = tw+32, bh = 28
    rrect(cx, bx, by, bw, bh, 14)
    cx.fillStyle = 'rgba(133,91,251,0.16)'; cx.fill()
    cx.fillStyle = '#7132f5'
    cx.fillText(tier.label, W/2, by+19)

    // big number
    const fontSize = s.total >= 100 ? 160 : 200
    cx.font = `700 ${fontSize}px "IBM Plex Sans", sans-serif`
    cx.fillStyle = '#7132f5'; cx.textAlign = 'center'
    cx.fillText(s.total.toString(), W/2, H/2+55)

    // sub label
    cx.font = '400 21px "IBM Plex Sans", sans-serif'
    cx.fillStyle = '#9497a9'
    cx.fillText('times you\'ve called \u201cthis is the bottom\u201d', W/2, H/2+98)

    // stat cards
    const items = [
      { l: 'Days Since Last', v: s.days !== null ? s.days : '—' },
      { l: 'Times Rekt',      v: s.rekt },
      { l: 'Times Right',     v: s.right },
      { l: 'Accuracy',        v: s.acc !== null ? s.acc+'%' : '—' },
    ]
    const sw = 175, sh = 68, sg = 18
    const tw2 = items.length*sw+(items.length-1)*sg
    let sx = W/2-tw2/2
    items.forEach(it => {
      rrect(cx, sx, H-128, sw, sh, 10)
      cx.fillStyle = 'rgba(104,107,130,0.08)'; cx.fill()
      cx.strokeStyle = '#dedee5'; cx.lineWidth = 1; cx.stroke()
      cx.font = '700 30px "IBM Plex Sans", sans-serif'
      cx.fillStyle = '#101114'; cx.textAlign = 'center'
      cx.fillText(String(it.v), sx+sw/2, H-128+sh*.55)
      cx.font = '500 11px "IBM Plex Sans", sans-serif'
      cx.fillStyle = '#9497a9'
      cx.fillText(it.l.toUpperCase(), sx+sw/2, H-128+sh*.85)
      sx += sw+sg
    })

    // watermark
    cx.font = '600 12px "IBM Plex Sans", sans-serif'
    cx.fillStyle = '#dedee5'; cx.textAlign = 'right'
    cx.fillText('bullmarketrelapse.lol', W-22, H-18)
  }, [s, tier])

  function openShare() { setShareOpen(true); setTimeout(drawCard, 50) }
  function closeShare() { setShareOpen(false) }

  function dlCard() {
    const cv = canvasRef.current
    if (!cv) return
    const a = document.createElement('a')
    a.download = 'bull-market-relapse.png'
    a.href = cv.toDataURL('image/png'); a.click()
  }

  function getTweetText() {
    const accLine = s.acc !== null ? ` Accuracy: ${s.acc}%.` : ''
    return `I've called the bottom ${s.total} time${s.total !== 1 ? 's' : ''}.\n${tier.label}${accLine}\n\n"${roast}"\n\nbullmarketrelapse.lol`
  }

  function postOnX() {
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(getTweetText()), '_blank', 'noopener')
  }

  function copyTweet() {
    navigator.clipboard.writeText(getTweetText()).then(() => showToast('Copied!')).catch(() => {})
  }

  function scrollToForm() {
    document.getElementById('addSection')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-[#9497a9] text-sm">
      Loading your shame…
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-[#dedee5] shadow-sm text-[#101114] text-sm font-semibold px-5 py-2 rounded-full pointer-events-none animate-[fadeDown_2.2s_cubic-bezier(.16,1,.3,1)_forwards] whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Konami toast */}
      {konamiToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#101114] text-white text-sm font-medium px-5 py-3 rounded-xl pointer-events-none shadow-lg whitespace-nowrap">
          {konamiToast.split('. ').map((part, i) => (
            i === 1 ? <span key={i} className="text-[#7132f5]"> {part}</span> : <span key={i}>{part}</span>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-[#dedee5] bg-white sticky top-0 z-40 shadow-[rgba(16,24,40,0.04)_0px_1px_4px]">
        <div className="max-w-[860px] mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 no-underline">
            <svg width="32" height="32" viewBox="0 0 38 38" fill="none" aria-hidden="true">
              <circle cx="19" cy="19" r="18" stroke="#7132f5" strokeWidth="1.8"/>
              <path d="M10 18 C6 18 3 12 6 8" stroke="#7132f5" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <path d="M28 18 C32 18 35 12 32 8" stroke="#7132f5" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <rect x="12" y="18" width="14" height="10" rx="5" fill="#101114" opacity="0.12" stroke="#101114" strokeWidth="1.4"/>
              <circle cx="15.5" cy="23" r="1.8" fill="#ffffff" stroke="#101114" strokeWidth="1"/>
              <circle cx="22.5" cy="23" r="1.8" fill="#ffffff" stroke="#101114" strokeWidth="1"/>
              <circle cx="14.5" cy="16.5" r="1.6" fill="#101114"/>
              <circle cx="23.5" cy="16.5" r="1.6" fill="#101114"/>
              <path d="M12.5 14 L16.5 15.2" stroke="#7132f5" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M25.5 14 L21.5 15.2" stroke="#7132f5" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <span className="text-base font-bold tracking-tight text-[#101114]">
              Bull Market <span className="text-[#7132f5]">Relapse</span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            <a
              href="/leaderboard"
              className="flex items-center gap-1.5 text-sm font-semibold text-[#7132f5] border border-[#7132f5] px-3 py-2 rounded-xl hover:bg-[rgba(113,50,245,0.08)] transition-colors hidden sm:flex"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 20 18 10"/><polyline points="12 20 12 4"/><polyline points="6 20 6 14"/></svg>
              Leaderboard
            </a>
            <button
              onClick={openShare}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#7132f5] border border-[#7132f5] px-3 py-2 rounded-xl hover:bg-[rgba(113,50,245,0.08)] transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              Share
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#9497a9] border border-[#dedee5] px-3 py-2 rounded-xl hover:bg-[rgba(104,107,130,0.08)] transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-[860px] mx-auto px-6">

          {/* Hero */}
          <section className="py-16 pb-12">
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7132f5] bg-[rgba(133,91,251,0.16)] px-3 py-1 rounded-full mb-5">
              {tier.label}
            </div>

            <div className={`font-bold text-[#7132f5] leading-[1.17] tracking-[-1px] mb-2 transition-colors duration-200 text-[clamp(5rem,16vw,9rem)] ${flash ? 'text-[#5b1ecf]' : ''}`}>
              {s.total}
            </div>

            <div className="text-[22px] text-[#686b82] mb-6">times you&apos;ve called &ldquo;this is the bottom&rdquo;</div>

            {s.total > 0 && (
              <div className="text-sm text-[#9497a9] mb-8 leading-relaxed">
                {s.days !== null && (
                  <><span className={s.days === 0 ? 'text-[#dc2626] font-semibold' : ''}>{s.days} days since last call</span><span className="px-1.5 text-[#dedee5]">·</span></>
                )}
                <span className="text-[#991b1b] font-semibold">{s.rekt} rekt</span>
                <span className="px-1.5 text-[#dedee5]">·</span>
                <span className="text-[#026b3f] font-semibold">{s.right} right</span>
                {s.acc !== null && (
                  <><span className="px-1.5 text-[#dedee5]">·</span><span>{s.acc}% accuracy</span></>
                )}
              </div>
            )}

            {roast && s.total > 0 && (
              <div className="bg-[#f5f5f7] border border-[#dedee5] rounded-2xl p-6 mb-8">
                <div className="text-[22px] font-semibold text-[#101114] tracking-tight leading-[1.29] max-w-[54ch]">
                  &ldquo;{roast}&rdquo;
                </div>
                <div className="mt-3 text-xs text-[#9497a9] font-medium">— Bull Market Relapse Counter</div>
              </div>
            )}

            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-[.06em] text-[#686b82]">Shame Tier</span>
                <span className="text-xs text-[#9497a9]">
                  {nextTier ? `${nextTier.min - s.total} more to ${nextTier.label}` : 'Maximum shame achieved'}
                </span>
              </div>
              <div className="h-1 bg-[#f5f5f7] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7132f5] rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* CTA row */}
            <div className="flex gap-3 flex-wrap items-center mb-16">
              <button
                onClick={scrollToForm}
                className="flex items-center gap-1.5 bg-[#7132f5] text-white font-semibold px-4 py-3 rounded-xl hover:bg-[#5741d8] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Log a Relapse
              </button>
              <button
                onClick={openShare}
                className="flex items-center gap-1.5 bg-white text-[#5741d8] border border-[#5741d8] font-semibold px-4 py-3 rounded-xl hover:bg-[rgba(133,91,251,0.16)] transition-colors"
              >
                Share My Shame
              </button>
            </div>
          </section>

          {/* Add Form */}
          <section className="border-t border-[#dedee5] py-12" id="addSection">
            <div className="mb-6">
              <div className="text-[36px] font-bold tracking-tight text-[#101114] leading-[1.22] mb-1">Log a New Relapse</div>
              <div className="text-sm text-[#9497a9]">Be honest. The market knows.</div>
            </div>
            <div className="bg-white border border-[#dedee5] rounded-2xl shadow-[rgba(0,0,0,0.03)_0px_4px_24px] p-6">
              <div className="grid grid-cols-2 gap-4 mb-4 max-sm:grid-cols-1">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-[.06em] text-[#686b82]">Asset</label>
                  <select value={fAsset} onChange={e => setFAsset(e.target.value)}
                    className="bg-white border border-[#dedee5] rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all shadow-[rgba(16,24,40,0.04)_0px_1px_4px]">
                    {['BTC','ETH','SOL','ALT','MEME','OTHER'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-[.06em] text-[#686b82]">Date of incident</label>
                  <input type="date" value={fDate} onChange={e => setFDate(e.target.value)}
                    className="bg-white border border-[#dedee5] rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all shadow-[rgba(16,24,40,0.04)_0px_1px_4px]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-[.06em] text-[#686b82]">Price at the time</label>
                  <input type="text" value={fPrice} onChange={e => {
                    const val = e.target.value
                    setFPrice(val)
                    const key = val.trim().replace(/\s/g, '')
                    const match = Object.entries(EASTER_PRICES).find(([k]) => k.toLowerCase() === key.toLowerCase())
                    setEasterMsg(match ? match[1] : null)
                  }} placeholder="e.g. $74,200"
                    className="bg-white border border-[#dedee5] rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all shadow-[rgba(16,24,40,0.04)_0px_1px_4px]" />
                  {easterMsg && <p className="text-xs text-[#7132f5] font-medium mt-0.5">{easterMsg}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-[.06em] text-[#686b82]">Outcome</label>
                  <select value={fOutcome} onChange={e => setFOutcome(e.target.value as Outcome)}
                    className="bg-white border border-[#dedee5] rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all shadow-[rgba(16,24,40,0.04)_0px_1px_4px]">
                    <option value="waiting">⏳ Still waiting</option>
                    <option value="rekt">🩸 Rekt — went lower</option>
                    <option value="right">✅ Actually right</option>
                    <option value="early">⚡ Right, sold too early</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5 col-span-2 max-sm:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-[.06em] text-[#686b82]">What did you say exactly?</label>
                  <textarea
                    ref={quoteRef}
                    value={fQuote}
                    onChange={e => setFQuote(e.target.value)}
                    placeholder={QUOTE_PLACEHOLDERS[phIdx]}
                    rows={3}
                    className="bg-white border border-[#dedee5] rounded-[10px] px-3 py-2.5 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all shadow-[rgba(16,24,40,0.04)_0px_1px_4px] resize-y min-h-[88px]"
                  />
                </div>
              </div>
              <div className="flex gap-2.5 justify-end mt-5">
                <button
                  onClick={() => { setFPrice(''); setFQuote(''); setFDate(today); setFAsset('BTC'); setFOutcome('waiting') }}
                  className="bg-[rgba(148,151,169,0.08)] text-[#101114] text-sm font-medium px-3 py-2 rounded-[10px] hover:bg-[rgba(148,151,169,0.14)] transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={addCall}
                  disabled={submitting}
                  className="flex items-center gap-1.5 bg-[#7132f5] text-white font-semibold px-4 py-3 rounded-xl hover:bg-[#5741d8] transition-colors disabled:opacity-60"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  {submitting ? 'Adding…' : 'Add Relapse'}
                </button>
              </div>
            </div>
          </section>

          {/* History */}
          <section className="border-t border-[#dedee5] py-12">
            <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
              <div>
                <div className="text-[36px] font-bold tracking-tight text-[#101114] leading-[1.22] mb-1">Your Bottom Call History</div>
                <div className="text-sm text-[#9497a9]">{calls.length > 0 ? `${calls.length} call${calls.length !== 1 ? 's' : ''} logged` : 'Nothing yet'}</div>
              </div>
            </div>

            {calls.length === 0 ? (
              <div className="py-16 border-t border-[#dedee5]">
                <h3 className="text-[28px] font-bold text-[#101114] tracking-tight leading-[1.29] mb-2">Clean slate — for now</h3>
                <p className="text-sm text-[#9497a9] max-w-[40ch] leading-relaxed">No bottom calls logged yet. We both know that&apos;s not true.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {calls.map(call => {
                  const badge = OUTCOME_BADGE[call.outcome]
                  return (
                    <div key={call.id} className="border-b border-[#dedee5] py-5 grid grid-cols-[1fr_auto] gap-4 items-start hover:bg-[#f5f5f7] hover:-mx-3 hover:px-3 rounded-[10px] transition-all max-sm:grid-cols-1">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-[.1em] text-[#7132f5] bg-[rgba(133,91,251,0.16)] px-2 py-0.5 rounded">
                            {call.asset}
                          </span>
                          <span className="text-sm text-[#9497a9]">{call.date}</span>
                          {call.price && <span className="text-sm text-[#686b82]">@ {call.price}</span>}
                        </div>
                        {call.quote && (
                          <p className="text-[15px] text-[#101114] italic leading-relaxed">
                            &ldquo;{call.quote}&rdquo;
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 max-sm:flex-row max-sm:items-center">
                        <select
                          value={call.outcome}
                          onChange={e => updateOutcome(call.id, e.target.value as Outcome)}
                          className={`text-xs font-bold px-2.5 py-1 rounded border-0 cursor-pointer ${badge.cls}`}
                        >
                          <option value="waiting">⏳ Waiting</option>
                          <option value="rekt">🩸 Rekt</option>
                          <option value="right">✅ Right</option>
                          <option value="early">⚡ Too Early</option>
                        </select>
                        <button
                          onClick={() => deleteCall(call.id)}
                          className={`text-sm px-2 py-1 rounded-md transition-colors ${confirmDelete === call.id ? 'text-[#dc2626] bg-[rgba(220,38,38,0.12)]' : 'text-[#9497a9] hover:text-[#dc2626] hover:bg-[rgba(220,38,38,0.12)]'}`}
                        >
                          {confirmDelete === call.id ? 'Sure?' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

        </div>
      </main>

      <footer className="border-t border-[#dedee5] py-8 text-center text-sm text-[#9497a9]">
        Built for the perpetually early. We&apos;re all going to make it — eventually.
      </footer>

      {/* Share Modal */}
      {shareOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={e => { if (e.target === e.currentTarget) closeShare() }}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[600px] p-6">
            <div className="flex justify-between items-center mb-5">
              <div className="text-[22px] font-bold tracking-tight text-[#101114]">Go On. Post It.</div>
              <button onClick={closeShare} className="text-[#9497a9] hover:text-[#101114] hover:bg-[#f5f5f7] w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-lg">✕</button>
            </div>
            <canvas ref={canvasRef} className="w-full h-auto rounded-xl border border-[#dedee5] mb-5" />
            <div className="flex gap-2.5 justify-end flex-wrap">
              <button
                onClick={dlCard}
                className="flex items-center gap-1.5 bg-[rgba(104,107,130,0.08)] text-[#101114] text-sm font-medium px-3 py-2 rounded-[10px] hover:bg-[rgba(104,107,130,0.14)] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Save image
              </button>
              <button
                onClick={copyTweet}
                className="flex items-center gap-1.5 bg-[rgba(104,107,130,0.08)] text-[#101114] text-sm font-medium px-3 py-2 rounded-[10px] hover:bg-[rgba(104,107,130,0.14)] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy post
              </button>
              <button
                onClick={postOnX}
                className="flex items-center gap-1.5 bg-[#101114] text-white text-sm font-semibold px-4 py-2 rounded-[10px] hover:bg-[#2a2d3a] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.857L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                Post on X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
