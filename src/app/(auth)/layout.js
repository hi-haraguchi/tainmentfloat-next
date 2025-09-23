import Link from 'next/link'
import AuthCard from '@/app/(auth)/AuthCard'
import ApplicationLogo from '@/components/ApplicationLogo'

const Layout = ({ children }) => {
    return (
        <div className="h-screen flex flex-col overflow-hidden bg-white text-gray-900 antialiased">
            {/* ヘッダー */}
            <header className="h-16 flex items-center px-6">
                <div className="flex justify-between items-center w-full">
                    <div className="flex-1">
                        <img
                            src="/images/lp/tf-font12.png"
                            alt="エンタメフロート"
                            className="h-10 md:h-12"
                        />
                    </div>
                    <div className="flex-1 flex justify-end gap-4 text-sm">
                        <Link href="/" className="text-gray-700 underline">
                            紹介ページへ戻る
                        </Link>
                    </div>
                </div>
            </header>

            {/* メイン (AuthCard部分) */}
            <main className="flex-1">
                <AuthCard
                    logo={
                        <Link href="/">
                            <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                        </Link>
                    }>
                    {children}
                </AuthCard>
            </main>
        </div>
    )
}

export default Layout
