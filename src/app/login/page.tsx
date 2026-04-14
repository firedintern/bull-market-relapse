'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#101114] tracking-tight">Bull Market Relapse</h1>
          <p className="text-sm text-[#9497a9] mt-1">Log your shame. Share your pain.</p>
        </div>

        {/* X Login */}
        <button
          onClick={() => signIn('twitter', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-3 bg-[#101114] text-white font-semibold py-3 rounded-xl mb-4 hover:bg-[#1d2129] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Continue with X
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#dedee5]" />
          <span className="text-xs text-[#9497a9]">or</span>
          <div className="flex-1 h-px bg-[#dedee5]" />
        </div>

        {/* Email login */}
        <form onSubmit={handleCredentials} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border border-[#dedee5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border border-[#dedee5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#7132f5] text-white font-semibold py-3 rounded-xl hover:bg-[#5741d8] transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs text-[#9497a9] mt-4">
          No account?{' '}
          <a href="/signup" className="text-[#7132f5] hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  )
}
