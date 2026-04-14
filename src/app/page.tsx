import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'
import { Counter } from '@/components/Counter'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')
  return <Counter session={session} />
}
