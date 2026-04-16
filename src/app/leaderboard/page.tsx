'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const TIERS = [
  { min: 0,  max: 0,  label: '🌱 First Timer' },
  { min: 1,  max: 3,  label: '🐂 Cautious Optimist' },
  { min: 4,  max: 7,  label: '🔴 Pattern Emerging' },
  { min: 8,  max: 15, label: '💀 Certified Permabull' },
  { min: 16, max: 25, label: '🔮 The Bottom Whisperer' },
  { min: 26, max: 50, label: '🎰 High Conviction Animal' },
  { min: 51, max: Infinity, label: '👑 Bottom Is A Lifestyle' },
]

function getTier(n: number) {
  return TIERS.find(t => n >= t.min && n <= t.max) ?? TIERS[TIERS.length - 1]
}

type Row = {
  username: string
  twitter_handle: string | null
  twitter_image: string | null
  total: number
  rekt: number
  right: number
  acc: number | null
}

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(d => { setRows(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#dedee5] bg-white sticky top-0 z-40 shadow-[rgba(16,24,40,0.04)_0px_1px_4px]">
        <div className="max-w-[860px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
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
          </Link>
          <Link href="/" className="text-sm text-[#9497a9] hover:text-[#101114] px-3 py-2 rounded-xl hover:bg-[rgba(104,107,130,0.08)] transition-colors">
            ← Back
          </Link>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-6">
        {/* Hero */}
        <section className="py-16 pb-10">
          <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7132f5] bg-[rgba(133,91,251,0.16)] px-3 py-1 rounded-full mb-5">
            Hall of Shame
          </div>
          <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-bold tracking-tight text-[#101114] leading-[1.1] mb-3">
            Who called it <span className="text-[#7132f5]">most</span>?
          </h1>
          <p className="text-[#686b82] text-lg max-w-[48ch]">
            The community leaderboard. Ranked by total bottom calls. Higher is not better.
          </p>
        </section>

        {/* Table */}
        <section className="pb-16">
          {loading ? (
            <div className="py-16 text-center text-[#9497a9] text-sm">Loading the shameful…</div>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-[28px] font-bold text-[#101114] tracking-tight mb-2">Nothing here yet</div>
              <p className="text-sm text-[#9497a9]">Be the first to embarrass yourself publicly.</p>
            </div>
          ) : (
            <div className="border border-[#dedee5] rounded-2xl overflow-hidden">
              {/* Top 3 podium */}
              {rows.slice(0, 3).length > 0 && (
                <div className="grid grid-cols-3 gap-px bg-[#dedee5] border-b border-[#dedee5]">
                  {rows.slice(0, 3).map((row, i) => (
                    <Link
                      key={row.username}
                      href={`/${row.username}`}
                      className={`bg-white p-6 text-center hover:bg-[#f5f5f7] transition-colors no-underline ${i === 0 ? 'bg-[rgba(113,50,245,0.03)]' : ''}`}
                    >
                      <div className="text-3xl mb-2">{MEDALS[i]}</div>
                      {row.twitter_image ? (
                        <img src={row.twitter_image} alt={row.username} className="w-12 h-12 rounded-full mx-auto mb-2 border-2 border-[#dedee5]" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[rgba(113,50,245,0.12)] mx-auto mb-2 flex items-center justify-center text-[#7132f5] font-bold text-lg">
                          {row.username[0].toUpperCase()}
                        </div>
                      )}
                      <div className="font-bold text-[#101114] text-sm truncate">@{row.username}</div>
                      <div className="text-[#7132f5] font-bold text-3xl mt-1">{row.total}</div>
                      <div className="text-xs text-[#9497a9] mt-0.5">{getTier(row.total).label}</div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Rest of the list */}
              {rows.slice(3).map((row, i) => (
                <Link
                  key={row.username}
                  href={`/${row.username}`}
                  className="flex items-center gap-4 px-5 py-4 border-b border-[#dedee5] last:border-0 hover:bg-[#f5f5f7] transition-colors no-underline"
                >
                  <div className="w-7 text-center text-sm font-bold text-[#9497a9]">{i + 4}</div>
                  {row.twitter_image ? (
                    <img src={row.twitter_image} alt={row.username} className="w-9 h-9 rounded-full border border-[#dedee5] flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[rgba(113,50,245,0.12)] flex-shrink-0 flex items-center justify-center text-[#7132f5] font-bold">
                      {row.username[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[#101114] text-sm truncate">@{row.username}</div>
                    <div className="text-xs text-[#9497a9]">{getTier(row.total).label}</div>
                  </div>
                  <div className="flex items-center gap-4 text-right flex-shrink-0">
                    <div className="hidden sm:block text-xs text-[#9497a9]">
                      {row.rekt > 0 && <span className="text-[#991b1b]">{row.rekt} rekt</span>}
                      {row.rekt > 0 && row.right > 0 && <span className="px-1.5 text-[#dedee5]">·</span>}
                      {row.right > 0 && <span className="text-[#026b3f]">{row.right} right</span>}
                      {row.acc !== null && <span className="ml-1.5 text-[#9497a9]">({row.acc}%)</span>}
                    </div>
                    <div className="font-bold text-[#7132f5] text-lg w-8 text-right">{row.total}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-[#dedee5] py-8 text-center text-sm text-[#9497a9]">
        Built for the perpetually early. We&apos;re all going to make it — eventually.
      </footer>
    </div>
  )
}
