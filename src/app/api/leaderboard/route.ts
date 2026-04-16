import { NextResponse } from 'next/server'
import { supabaseAdmin as supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      username,
      twitter_handle,
      twitter_image,
      calls (
        id,
        outcome
      )
    `)
    .eq('is_public', true)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = (data ?? [])
    .map(p => {
      const calls = Array.isArray(p.calls) ? p.calls : []
      const total = calls.length
      const rekt = calls.filter((c: { outcome: string }) => c.outcome === 'rekt').length
      const right = calls.filter((c: { outcome: string }) => c.outcome === 'right').length
      const resolved = rekt + right
      const acc = resolved > 0 ? Math.round((right / resolved) * 100) : null
      return { username: p.username, twitter_handle: p.twitter_handle, twitter_image: p.twitter_image, total, rekt, right, acc }
    })
    .filter(p => p.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 50)

  return NextResponse.json(rows)
}
