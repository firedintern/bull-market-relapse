import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Call } from '@/lib/types'
import { ChallengeButton } from '@/components/ChallengeButton'

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

const OUTCOME_BADGE: Record<string, { label: string; class: string }> = {
  waiting: { label: '⏳ Waiting',     class: 'bg-[rgba(104,107,130,0.12)] text-[#484b5e]' },
  rekt:    { label: '🩸 Rekt',        class: 'bg-[rgba(220,38,38,0.12)] text-[#991b1b]' },
  right:   { label: '✅ Right',       class: 'bg-[rgba(20,158,97,0.16)] text-[#026b3f]' },
  early:   { label: '⚡ Too Early',   class: 'bg-[rgba(217,119,6,0.14)] text-[#92400e]' },
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username: rawUsername } = await params
  // Strip leading @ if present (URLs like /@handle)
  const username = rawUsername.startsWith('%40')
    ? rawUsername.slice(3)
    : rawUsername.startsWith('@')
    ? rawUsername.slice(1)
    : rawUsername

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .single()

  if (!profile) notFound()

  const { data: calls } = await supabase
    .from('calls')
    .select('*')
    .eq('user_id', profile.id)
    .order('date', { ascending: false })

  const total = calls?.length ?? 0
  const tier = getTier(total)
  const rekt = calls?.filter((c: Call) => c.outcome === 'rekt').length ?? 0
  const right = calls?.filter((c: Call) => c.outcome === 'right').length ?? 0
  const resolved = rekt + right
  const acc = resolved > 0 ? Math.round((right / resolved) * 100) : null

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-[#dedee5] bg-white sticky top-0 z-50">
        <div className="max-w-[860px] mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-[#101114] tracking-tight">
            Bull Market <span className="text-[#7132f5]">Relapse</span>
          </a>
          <a
            href="/signup"
            className="bg-[#7132f5] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#5741d8] transition-colors"
          >
            Log your shame →
          </a>
        </div>
      </header>

      <main className="max-w-[860px] mx-auto px-6 py-12">
        {/* Profile hero */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            {profile.twitter_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.twitter_image}
                alt={profile.username}
                className="w-14 h-14 rounded-full border border-[#dedee5]"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-[#101114] tracking-tight">@{profile.username}</h1>
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7132f5] bg-[rgba(133,91,251,0.16)] px-3 py-1 rounded-full mt-1">
                {tier.label}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Total Calls', value: total },
              { label: 'Times Rekt',  value: rekt },
              { label: 'Times Right', value: right },
              { label: 'Accuracy',    value: acc !== null ? `${acc}%` : '—' },
            ].map(s => (
              <div key={s.label} className="border border-[#dedee5] rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-[#101114]">{s.value}</div>
                <div className="text-xs text-[#9497a9] font-medium mt-0.5 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Challenge CTA */}
          <div className="flex gap-3">
            <ChallengeButton
              username={profile.username}
              total={total}
              rekt={rekt}
              acc={acc}
              profileUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://bullmarketrelapse.lol'}/${profile.username}`}
            />
          </div>
        </div>

        {/* Call history */}
        <section className="border-t border-[#dedee5] pt-8">
          <h2 className="text-2xl font-bold text-[#101114] tracking-tight mb-6">Bottom Call History</h2>
          {!calls?.length ? (
            <p className="text-[#9497a9]">No calls logged yet.</p>
          ) : (
            <div className="flex flex-col">
              {calls.map((call: Call) => {
                const badge = OUTCOME_BADGE[call.outcome]
                return (
                  <div key={call.id} className="border-b border-[#dedee5] py-5 grid grid-cols-[1fr_auto] gap-4 items-start">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#7132f5] bg-[rgba(133,91,251,0.16)] px-2 py-0.5 rounded">
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
                    <span className={`text-xs font-bold px-2.5 py-1 rounded whitespace-nowrap ${badge.class}`}>
                      {badge.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
