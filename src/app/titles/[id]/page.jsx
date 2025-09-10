'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function TitleDetailPage() {
    const params = useParams()
    const { id } = params

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-4">タイトル詳細ページ</h1>
            <p>選択されたID: {id}</p>
            <p className="text-gray-600 mt-2">
                このページは仮の詳細ページです。
                <br />
                後で差し替えます。
            </p>

            <Link href="/" className="ml-4 text-blue-600 underline">
                一覧に戻る
            </Link>
        </main>
    )
}
