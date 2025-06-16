import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'اطلب وجبتك الان',
  description: 'عروض خيالة ووجبات مجانية اطلب الان!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children
      }</body>
    </html>
  )
}
