'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ROASTS = [
  "You've called the bottom before. We both know it.",
  "The market remembers. Now so will you.",
  "Accountability starts here. Unfortunately.",
  "Your conviction deserves a permanent record.",
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const roast = ROASTS[Math.floor(Math.random() * ROASTS.length)]

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) setError('Invalid email or password.')
    else router.push('/')
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-[#7132f5] p-12">
        <div>
          <div className="flex items-center gap-2.5 mb-16">
            <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
              <circle cx="19" cy="19" r="18" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8"/>
              <path d="M10 18 C6 18 3 12 6 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <path d="M28 18 C32 18 35 12 32 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <rect x="12" y="18" width="14" height="10" rx="5" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.4"/>
              <circle cx="15.5" cy="23" r="1.8" fill="white"/>
              <circle cx="22.5" cy="23" r="1.8" fill="white"/>
              <circle cx="14.5" cy="16.5" r="1.6" fill="white"/>
              <circle cx="23.5" cy="16.5" r="1.6" fill="white"/>
            </svg>
            <span className="text-white font-bold text-base tracking-tight">Bull Market Relapse</span>
          </div>

          <div className="mt-auto">
            <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Today&apos;s wisdom</div>
            <p className="text-white text-2xl font-bold leading-snug tracking-tight max-w-[320px]">
              &ldquo;{roast}&rdquo;
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { icon: '/bottom is a lifestyle.svg', tier: 'Bottom Is A Lifestyle', calls: '51+ calls' },
            { icon: '/high conviction animal.svg', tier: 'High Conviction Animal', calls: '26–50 calls' },
            { icon: '/the bottom whisperer.svg', tier: 'The Bottom Whisperer', calls: '16–25 calls' },
          ].map(t => (
            <div key={t.tier} className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2.5">
                <img src={t.icon} alt={t.tier} className="w-5 h-5 invert opacity-80" />
                <span className="text-white text-sm font-medium">{t.tier}</span>
              </div>
              <span className="text-white/50 text-xs">{t.calls}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <svg width="24" height="24" viewBox="0 0 38 38" fill="none">
              <circle cx="19" cy="19" r="18" stroke="#7132f5" strokeWidth="1.8"/>
              <path d="M10 18 C6 18 3 12 6 8" stroke="#7132f5" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <path d="M28 18 C32 18 35 12 32 8" stroke="#7132f5" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <rect x="12" y="18" width="14" height="10" rx="5" fill="#101114" opacity="0.12" stroke="#101114" strokeWidth="1.4"/>
              <circle cx="15.5" cy="23" r="1.8" fill="white" stroke="#101114" strokeWidth="1"/>
              <circle cx="22.5" cy="23" r="1.8" fill="white" stroke="#101114" strokeWidth="1"/>
              <circle cx="14.5" cy="16.5" r="1.6" fill="#101114"/>
              <circle cx="23.5" cy="16.5" r="1.6" fill="#101114"/>
            </svg>
            <span className="font-bold text-[#101114] text-base tracking-tight">Bull Market <span className="text-[#7132f5]">Relapse</span></span>
          </div>

          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-[#101114] tracking-tight leading-tight mb-1.5">Welcome back</h1>
            <p className="text-sm text-[#9497a9]">Log in to face your bottom calls.</p>
          </div>

          {/* X Login */}
          <button
            onClick={() => signIn('twitter', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-2.5 bg-[#101114] text-white text-sm font-semibold py-2.5 rounded-xl mb-4 hover:bg-[#1d2129] transition-colors"
          >
            Continue with
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#dedee5]" />
            <span className="text-xs text-[#9497a9]">or</span>
            <div className="flex-1 h-px bg-[#dedee5]" />
          </div>

          <form onSubmit={handleCredentials} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="border border-[#dedee5] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border border-[#dedee5] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#7132f5] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#5741d8] transition-colors disabled:opacity-60 mt-1"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-xs text-[#9497a9] mt-5">
            No account?{' '}
            <a href="/signup" className="text-[#7132f5] hover:underline font-medium">Sign up free</a>
          </p>
        </div>
      </div>
    </div>
  )
}
