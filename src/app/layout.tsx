import './globals.css'

export const metadata = {
  title: '親子間ローン管理 App',
  description: '親子間の貸し借りをスマートに管理するアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}