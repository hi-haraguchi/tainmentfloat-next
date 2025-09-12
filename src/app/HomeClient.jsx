'use client'

import { useState, useEffect } from 'react'
import axios from '@/lib/axios'
import LoginLinks from '@/app/LoginLinks'
import { useAuth } from '@/hooks/auth'
import Button from '@/components/Button'
import Link from 'next/link'
import TitleItem from '@/components/TitleItem'

export default function HomeClient() {
    const [titles, setTitles] = useState([])
    const [search, setSearch] = useState('')
    const { user, logout } = useAuth({ middleware: 'guest' })

    // 初期ロード
    useEffect(() => {
        if (user) {
            axios.get('/api/titles').then(res => setTitles(res.data.data))
        }
    }, [user])

    // 検索処理
    const handleSearch = async (e) => {
        e.preventDefault()
        if (!search.trim()) {
            // 空なら全部取得
            axios.get('/api/titles').then(res => setTitles(res.data.data))
            return
        }
        try {
            const res = await axios.get('/api/titles/search', {
                params: { q: search },
            })
            setTitles(res.data.data)
        } catch (err) {
            console.error(err)
        }
    }

    if (!user) {
        return (
            <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
                <LoginLinks />
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">エンタメフロート</h1>
                    <p className="text-lg">
                        社会とちょうどいい距離を保ち、必要な情報を必要なときに。
                    </p>
                    <p className="mt-2">
                        エンタメに特化したSNSで、自分の記録を残しましょう。
                    </p>
                </div>
            </div>
        )
    }

    return (
        <main className="p-6 max-w-4xl mx-auto">
            {/* ヘッダー */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{user.email} さんの記録</h1>
                <Button type="button" onClick={logout}>
                    ログアウト
                </Button>
            </div>

            {/* 検索フォーム */}
            <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                <input
                    type="text"
                    placeholder="タイトル・作者・感想・タグを検索..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 flex-1"
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    検索
                </button>
            </form>

            {/* 一覧 */}
            {titles.length === 0 ? (
                <p>まだ記録はありません。</p>
            ) : (
                titles.map((title) => <TitleItem key={title.id} title={title} defaultOpen={search !== ''} searchTerm={search}/>)
            )}

            {/* 下部リンク */}
            <div className="mt-6 flex gap-4">
                <Link
                    href="/titles/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    新しい記録を追加
                </Link>

                <Link
                    href="/"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    タイムライン表示へ
                </Link>                

                <Link
                    href="/tags"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    みつける（タグで共有ページ）を見る
                </Link>
            </div>
        </main>
    )
}
