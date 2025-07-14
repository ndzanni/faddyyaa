import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'cihuy',
  description: 'Created with love',
  generator: 'love',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
