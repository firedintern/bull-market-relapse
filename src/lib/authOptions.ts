import type { NextAuthOptions } from 'next-auth'
import Twitter from 'next-auth/providers/twitter'
import Credentials from 'next-auth/providers/credentials'
import { supabase } from '@/lib/supabase'

export const authOptions: NextAuthOptions = {
  providers: [
    {
      ...Twitter({
        clientId: process.env.TWITTER_CLIENT_ID!,
        clientSecret: process.env.TWITTER_CLIENT_SECRET!,
        version: '2.0',
      }),
      authorization: {
        url: 'https://twitter.com/i/oauth2/authorize',
        params: {
          scope: 'users.read tweet.read offline.access',
          prompt: 'none',
        },
      },
    } as ReturnType<typeof Twitter>,
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
        const twitterProfile = profile as { data?: { username?: string; profile_image_url?: string } }
        const handle = twitterProfile?.data?.username ?? null
        const image = twitterProfile?.data?.profile_image_url ?? null
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
