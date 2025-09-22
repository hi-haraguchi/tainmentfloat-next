import { Nunito } from 'next/font/google'
import '@/app/global.css'

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
})

const RootLayout = ({ children }) => {
    return (
        <html lang="en" className={nunitoFont.className}>
            <body className="antialiased">{children}</body>
        </html>
    )
}

export const metadata = {
    title: 'エンタメフロート',
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
