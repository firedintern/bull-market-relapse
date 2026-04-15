import type { NextAuthOptions } from 'next-auth'
import Twitter from 'next-auth/providers/twitter'
import Credentials from 'next-auth/providers/credentials'
import { supabase } from '@/lib/supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    Twitter({
      clientId: process.env.TWITTER_API_KEY!,
      clientSecret: process.env.TWITTER_API_SECRET!,
    }),
    Credentials({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })
        if (error || !data.user) return null
        return { id: data.user.id, email: data.user.email ?? null, name: data.user.user_metadata?.username ?? null }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'twitter') {
        const twitterProfile = profile as { screen_name?: string; profile_image_url_https?: string }
        const handle = twitterProfile?.screen_name ?? null
        const image = twitterProfile?.profile_image_url_https?.replace(/_normal\./, '.') ?? null
        await supabase.from('profiles').upsert({
          id: user.id,
          username: handle ?? user.id,
          twitter_handle: handle,
          twitter_image: image,
          email: user.email ?? null,
          is_public: true,
        }, { onConflict: 'id' })
      }
      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub
        const { data } = await supabase
          .from('profiles')
          .select('username, twitter_handle, twitter_image')
          .eq('id', token.sub)
          .single()
        if (data) {
          (session.user as { username?: string }).username = data.username;
          (session.user as { twitter_handle?: string }).twitter_handle = data.twitter_handle
          session.user.image = data.twitter_image ?? session.user.image
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id
      return token
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
}
