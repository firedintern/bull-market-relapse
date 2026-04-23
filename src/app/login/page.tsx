'use client'

import { signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'

const ROASTS = [
  "You've called the bottom before.\nWe both know it.",
  "The market remembers.\nNow so will you.",
  "Accountability starts here.\nUnfortunately.",
  "Your conviction deserves\na permanent record.",
  "DCA stands for\nDefinitely Called Again.",
]

const TIERS = [
  { icon: '/bottom is a lifestyle.svg', label: 'Bottom Is A Lifestyle', range: '51+ calls' },
  { icon: '/high conviction animal.svg', label: 'High Conviction Animal', range: '26–50 calls' },
  { icon: '/the bottom whisperer.svg', label: 'The Bottom Whisperer', range: '16–25 calls' },
]

export default function LoginPage() {
  const [roastIdx, setRoastIdx] = useState(0)
  const [roastVisible, setRoastVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setRoastVisible(false)
      setTimeout(() => {
        setRoastIdx(i => (i + 1) % ROASTS.length)
        setRoastVisible(true)
      }, 300)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="min-h-screen bg-white flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[460px] shrink-0 bg-[#7132f5] p-10 overflow-hidden relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-white opacity-[0.06] blur-[80px]" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <svg width="26" height="26" viewBox="0 0 38 38" fill="none">
            <circle cx="19" cy="19" r="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8"/>
            <path d="M10 18 C6 18 3 12 6 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            <path d="M28 18 C32 18 35 12 32 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            <rect x="12" y="18" width="14" height="10" rx="5" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.4"/>
            <circle cx="15.5" cy="23" r="1.8" fill="white"/>
            <circle cx="22.5" cy="23" r="1.8" fill="white"/>
            <circle cx="14.5" cy="16.5" r="1.6" fill="white"/>
            <circle cx="23.5" cy="16.5" r="1.6" fill="white"/>
          </svg>
          <span className="text-white font-bold text-sm tracking-tight">Bull Market Relapse</span>
        </div>

        {/* Rotating roast */}
        <div className="relative z-10 my-auto">
          <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-5">Today&apos;s truth</div>
          <p
            key={roastIdx}
            className="text-white text-[26px] font-bold leading-snug tracking-tight max-w-[300px] transition-opacity duration-300"
            style={{ opacity: roastVisible ? 1 : 0 }}
          >
            {ROASTS[roastIdx].split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br/>}</span>
            ))}
          </p>
          <div className="flex gap-1.5 mt-6">
            {ROASTS.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === roastIdx ? '20px' : '6px',
                  background: i === roastIdx ? 'white' : 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Tier list */}
        <div className="relative z-10 space-y-2">
          <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-3">Hall of shame</div>
          {TIERS.map(t => (
            <div key={t.label} className="flex items-center justify-between bg-white/10 rounded-xl px-3.5 py-2.5 backdrop-blur-sm border border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="relative w-5 h-5">
                  <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-[6px]" />
                  <img src={t.icon} alt={t.label} className="relative w-5 h-5 invert opacity-90" />
                </div>
                <span className="text-white text-sm font-medium">{t.label}</span>
              </div>
              <span className="text-white/40 text-xs">{t.range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-80px] right-[-80px] w-[320px] h-[320px] rounded-full bg-[#7132f5] opacity-[0.06] blur-[90px] animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-[-60px] left-[-60px] w-[260px] h-[260px] rounded-full bg-[#7132f5] opacity-[0.04] blur-[80px] animate-[pulse_8s_ease-in-out_infinite_1s]" />
        </div>
        <div className="w-full max-w-[340px] animate-fade-up relative z-10">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <svg width="22" height="22" viewBox="0 0 38 38" fill="none">
              <circle cx="19" cy="19" r="18" stroke="#7132f5" strokeWidth="1.8"/>
              <path d="M10 18 C6 18 3 12 6 8" stroke="#7132f5" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <path d="M28 18 C32 18 35 12 32 8" stroke="#7132f5" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <rect x="12" y="18" width="14" height="10" rx="5" fill="#101114" opacity="0.1" stroke="#101114" strokeWidth="1.4"/>
              <circle cx="15.5" cy="23" r="1.8" fill="white" stroke="#101114" strokeWidth="1"/>
              <circle cx="22.5" cy="23" r="1.8" fill="white" stroke="#101114" strokeWidth="1"/>
              <circle cx="14.5" cy="16.5" r="1.6" fill="#101114"/>
              <circle cx="23.5" cy="16.5" r="1.6" fill="#101114"/>
            </svg>
            <span className="font-bold text-[#101114] text-sm tracking-tight">Bull Market <span className="text-[#7132f5]">Relapse</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#101114] tracking-tight mb-1">Welcome back</h1>
            <p className="text-sm text-[#9497a9]">Log in to face your bottom calls.</p>
          </div>

          <button
            onClick={() => signIn('twitter', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-2 bg-[#101114] text-white text-sm font-semibold py-3 rounded-xl hover:bg-[#1d2129] transition-colors"
          >
            Continue with
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>

          <p className="text-center text-xs text-[#9497a9] mt-6">
            By continuing, you agree to have your bottom calls permanently documented.
          </p>
        </div>
      </div>
    </div>
  )
}
