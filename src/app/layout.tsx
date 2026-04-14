import type { Metadata } from 'next'
import { IBM_Plex_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Bull Market Relapse Counter',
  description: 'Track every time you\'ve called the bottom. Because you\'ve definitely called it before.',
  openGraph: {
    title: 'Bull Market Relapse Counter',
    description: 'Track every time you\'ve called the bottom.',
    url: 'https://bullmarketrelapse.lol',
    images: [{ url: 'https://bullmarketrelapse.lol/og-image.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bull Market Relapse Counter',
    description: 'Track every time you\'ve called the bottom.',
    images: ['https://bullmarketrelapse.lol/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} h-full antialiased`}>
      <body className="min-h-full font-[family-name:var(--font-ibm)] bg-white text-[#101114]">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
