'use client'

interface Props {
  username: string
  total: number
  rekt: number
  acc: number | null
  profileUrl: string
}

export function ChallengeButton({ username, total, rekt, acc, profileUrl }: Props) {
  function challenge() {
    const accPart = acc !== null ? ` ${acc}% accuracy.` : ''
    const text = `@${username} has called the bottom ${total} times and been rekt ${rekt}.${accPart} Think you can do worse? 👇\n\n${profileUrl}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <button
      onClick={challenge}
      className="inline-flex items-center gap-2 border border-[#5741d8] text-[#5741d8] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[rgba(133,91,251,0.16)] transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      Challenge a friend
    </button>
  )
}
