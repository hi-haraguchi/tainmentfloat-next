'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const IntroHeader = () => {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 140)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 h-16 flex items-center transition-colors duration-300
        ${scrolled ? 'bg-white border-b' : 'bg-transparent'}
    `}>
            <div className="flex justify-between items-center w-full px-6">
                {/* 左側：スクロール後だけロゴを表示 */}
                <div className="flex-1">
                    {scrolled && (
                        <img
                            src="/images/lp/tf-font12.png"
                            alt="エンタメフロート"
                            className="h-10 md:h-12"
                        />
                    )}
                </div>

                {/* 右側：ログイン/新規登録 */}
                <div className="flex-1 flex justify-end gap-4 text-sm">
                    <Link href="/login" className="text-gray-700 underline">
                        ログイン
                    </Link>
                    <Link href="/register" className="text-gray-700 underline">
                        新規登録
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default IntroHeader
