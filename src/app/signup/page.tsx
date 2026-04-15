'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.')
      setLoading(false)
      return
    }

    await signIn('credentials', { email, password, callbackUrl: '/' })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-[#101114] p-12">
        <div>
          <div className="flex items-center gap-2.5 mb-16">
            <svg width="28" height="28" viewBox="0 0 38 38" fill="none">
              <circle cx="19" cy="19" r="18" stroke="rgba(255,255,255,0.2)" strokeWidth="1.8"/>
              <path d="M10 18 C6 18 3 12 6 8" stroke="#7132f5" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <path d="M28 18 C32 18 35 12 32 8" stroke="#7132f5" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
              <rect x="12" y="18" width="14" height="10" rx="5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4"/>
              <circle cx="15.5" cy="23" r="1.8" fill="white"/>
              <circle cx="22.5" cy="23" r="1.8" fill="white"/>
              <circle cx="14.5" cy="16.5" r="1.6" fill="white"/>
              <circle cx="23.5" cy="16.5" r="1.6" fill="white"/>
            </svg>
            <span className="text-white font-bold text-base tracking-tight">Bull Market Relapse</span>
          </div>

          <p className="text-[#9497a9] text-sm leading-relaxed max-w-[300px]">
            Join the only platform where your worst financial decisions become your most relatable content.
          </p>
        </div>

        <div>
          <div className="text-[#9497a9] text-xs font-bold uppercase tracking-widest mb-4">What you get</div>
          <div className="space-y-3">
            {[
              { icon: '📊', text: 'Track every bottom call with outcome data' },
              { icon: '🔗', text: 'Public shame profile at /@yourhandle' },
              { icon: '🏆', text: 'Earn tier badges as your hubris grows' },
              { icon: '📤', text: 'Share your shame card on X' },
            ].map(f => (
              <div key={f.text} className="flex items-start gap-3">
                <span className="text-base leading-none mt-0.5">{f.icon}</span>
                <span className="text-[#686b82] text-sm leading-snug">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
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
            <h1 className="text-[28px] font-bold text-[#101114] tracking-tight leading-tight mb-1.5">Create your profile</h1>
            <p className="text-sm text-[#9497a9]">Own your shame. Share your pain.</p>
          </div>

          {/* X signup */}
          <button
            onClick={() => signIn('twitter', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-2.5 bg-[#101114] text-white text-sm font-semibold py-2.5 rounded-xl mb-4 hover:bg-[#1d2129] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Continue with X
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#dedee5]" />
            <span className="text-xs text-[#9497a9]">or</span>
            <div className="flex-1 h-px bg-[#dedee5]" />
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Username (e.g. your X handle)"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              required
              className="border border-[#dedee5] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all"
            />
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
              placeholder="Password (min. 8 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="border border-[#dedee5] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#7132f5] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#5741d8] transition-colors disabled:opacity-60 mt-1"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-xs text-[#9497a9] mt-5">
            Already have an account?{' '}
            <a href="/login" className="text-[#7132f5] hover:underline font-medium">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
