'use client'

import Link from 'next/link'

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-700">
            {/* エラーメッセージ */}
            <div className="flex items-center mb-6">
                <div className="px-4 text-lg text-gray-500 border-r border-gray-400 tracking-wider">
                    404
                </div>
                <div className="ml-4 text-lg text-gray-500 tracking-wider">
                    ページが見つかりません
                </div>
            </div>

            {/* トップページへ戻るリンク */}
            <Link href="/" className="text-gray-700 underline text-sm">
                トップページに戻る
            </Link>
        </div>
    )
}

export default NotFoundPage
