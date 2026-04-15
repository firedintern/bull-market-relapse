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

    // Auto sign in after signup
    await signIn('credentials', { email, password, callbackUrl: '/' })
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#101114] tracking-tight">Create account</h1>
          <p className="text-sm text-[#9497a9] mt-1">Own your shame publicly.</p>
        </div>

        <button
          onClick={() => signIn('twitter', { callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-3 bg-[#101114] text-white font-semibold py-3 rounded-xl mb-4 hover:bg-[#1d2129] transition-colors"
        >
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
            className="border border-[#dedee5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all"
          />
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
            minLength={8}
            className="border border-[#dedee5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#7132f5] focus:ring-2 focus:ring-[#7132f5]/10 transition-all"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#7132f5] text-white font-semibold py-3 rounded-xl hover:bg-[#5741d8] transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-xs text-[#9497a9] mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-[#7132f5] hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  )
}
