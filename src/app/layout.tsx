import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import localFont from 'next/font/local'
import Provider from '@/providers/provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const riffic = localFont({
  src: './fonts/RifficFree-Bold.ttf',
  variable: '--font-riffic',
})

export const metadata: Metadata = {
  title: 'GitDate - Connect with Developers',
  description:
    'GitDate helps developers find meaningful connections through shared interests in coding and technology. Match, chat and collaborate with like-minded developers.',
  metadataBase: new URL('https://gitdates.com'),
  icons: {
    icon: [
      {
        url: '/assets/logo/gitdate-light-logo.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/assets/logo/gitdate-dark-logo.svg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
    ],
    shortcut: '/assets/logo/gitdate-light-logo.svg',
    apple: [
      {
        url: '/assets/logo/gitdate-light-logo.svg',
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
  },
  keywords: [
    'developer dating',
    'tech dating',
    'programmer dating',
    'developer connections',
    'coding community',
    'software engineer dating',
    'developer networking',
    'tech professional dating',
    'coding relationships',
    'developer matchmaking',
    'tech community dating',
    'programmer networking',
    'developer social network',
    'tech enthusiast dating',
    'coding partner finder',
  ],
  authors: [{ name: 'Sandeep Singh', url: 'https://sandeepsingh.me' }],
  openGraph: {
    title: 'GitDate - Connect with Developers',
    description: 'Find meaningful connections in the developer community',
    type: 'website',
    locale: 'en_US',
    url: 'https://gitdates.com',
  },
  twitter: {
    images: ['/opengraph-image.png'],
    creator: '@roohbuilds',
    card: 'summary_large_image',
    title: 'GitDate - Connect with Developers',
    description: 'Find meaningful connections in the developer community',
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: '#000000',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1',
  alternates: {
    canonical: 'https://gitdates.com',
  },
  category: 'Dating & Relationships',
  creator: 'Sandeep Singh',
  publisher: 'Sandeep Singh',
  applicationName: 'GitDates',
  formatDetection: {
    email: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${riffic.variable} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
