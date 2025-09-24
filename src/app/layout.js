import '@/app/global.css'
import { M_PLUS_1p } from 'next/font/google'
import ClientLayout from './ClientLayout'

const mplusFont = M_PLUS_1p({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
})

export const metadata = {
    title: 'エンタメフロート',
    manifest: '/manifest.json',
    openGraph: {
        title: 'エンタメフロート',
        description:
            'エンタメをほどよく楽しみ、社会とちょうどいい距離を保つ、エンタメ特化の記録共有アプリ',
        images: ['/tf-rogo-p22.png'],
    },
    icons: {
        icon: [
            { url: '/tf-favicon.ico', sizes: 'any' },
            { url: '/tf-favicon.svg', type: 'image/svg+xml' },
            { url: '/tf-favicon.png', type: 'image/png' },
        ],
        apple: {
            url: '/tf-rogo180.png',
            sizes: '180x180',
        },
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="ja" className={mplusFont.className}>
            <body className="antialiased">
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    )
}
