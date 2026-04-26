import type { Metadata } from 'next'
import { Geist, Lora } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Stamped',
  description: 'Personal travel history tracker',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${lora.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-gray-900" suppressHydrationWarning>{children}</body>
    </html>
  )
}
