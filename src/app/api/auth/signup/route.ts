import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { email, password, username } = await req.json()

  if (!email || !password || !username) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  if (username.length < 2 || username.length > 30) {
    return NextResponse.json({ error: 'Username must be 2–30 characters.' }, { status: 400 })
  }

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error || !data.user) {
    return NextResponse.json({ error: error?.message ?? 'Signup failed.' }, { status: 400 })
  }

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    username,
    email,
    is_public: true,
  })

  if (profileError) {
    // Username unique constraint violation
    if (profileError.code === '23505') {
      await supabase.auth.admin.deleteUser(data.user.id)
      return NextResponse.json({ error: 'Username already taken.' }, { status: 409 })
    }
    await supabase.auth.admin.deleteUser(data.user.id)
    return NextResponse.json({ error: 'Failed to create profile.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
