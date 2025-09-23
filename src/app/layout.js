import '@/app/global.css'
import { M_PLUS_1p } from 'next/font/google'

const mplusFont = M_PLUS_1p({
    subsets: ['latin'],
    weight: ['400', '500', '700'], // 必要に応じて太さを追加
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="ja" className={mplusFont.className}>
            <body className="antialiased">{children}</body>
        </html>
    )
}

export const metadata = {
    title: 'エンタメフロート',
    manifest: '/manifest.json',
    openGraph: {
        title: 'エンタメフロート',
        description: '社会とちょうどいい距離を保つエンタメSNS',
        images: ['/tf-rogo-p22.png'],
    },
    icons: {
        icon: [
            { url: '/tf-favicon.ico', sizes: 'any' },
            { url: '/tf-favicon.svg', type: 'image/svg+xml' },
            { url: '/tf-favicon.png', type: 'image/png' },
        ],
        apple: '/apple-touch-icon.png',
    },
}

export default RootLayout
